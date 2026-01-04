const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const validator = require("validator");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const {
  generateVerificationCode,
  sendVerificationEmail,
  sendWelcomeEmail,
} = require("./services/emailService");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENV = process.env.NODE_ENV || "development";
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const JWT_SECRET =
  process.env.JWT_SECRET ||
  (ENV === "development"
    ? "your-super-secret-jwt-key-change-this-in-production"
    : "");
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in environment variables");
}

// Setup DOMPurify for server-side HTML sanitization
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// HTML sanitization function
function sanitizeHtml(dirty) {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "u", "br", "p"],
    ALLOWED_ATTR: [],
  });
}

// Multer configuration for avatar uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads", "avatars");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 🔧 Avatar migration function
async function migrateAvatarsToFileSystem() {
  return new Promise((resolve) => {
    db.all(
      'SELECT id, avatar_url FROM users WHERE avatar_url LIKE "data:image%"',
      [],
      async (err, users) => {
        if (err) {
          console.error("❌ Error fetching users for avatar migration:", err);
          return resolve();
        }

        if (users.length === 0) {
          console.log("✅ No base64 avatars found to migrate");
          return resolve();
        }

        console.log(`🔄 Found ${users.length} base64 avatars to migrate`);

        for (const user of users) {
          try {
            // Extract base64 data
            const base64Data = user.avatar_url.split(",")[1];
            if (!base64Data) continue;

            const buffer = Buffer.from(base64Data, "base64");
            const fileName = `avatar_${user.id}_migrated_${Date.now()}.jpg`;
            const filePath = path.join(uploadsDir, fileName);

            // Process and save image
            await sharp(buffer)
              .resize(200, 200, {
                fit: "cover",
                position: "center",
              })
              .jpeg({ quality: 85 })
              .toFile(filePath);

            // Update database
            const newAvatarUrl = `/uploads/avatars/${fileName}`;
            await new Promise((updateResolve) => {
              db.run(
                "UPDATE users SET avatar_url = ? WHERE id = ?",
                [newAvatarUrl, user.id],
                (updateErr) => {
                  if (updateErr) {
                    console.error(
                      `❌ Error updating avatar for user ${user.id}:`,
                      updateErr,
                    );
                  } else {
                    console.log(`✅ Migrated avatar for user ${user.id}`);
                  }
                  updateResolve();
                },
              );
            });
          } catch (error) {
            console.error(
              `❌ Error migrating avatar for user ${user.id}:`,
              error,
            );
          }
        }

        console.log("✅ Avatar migration completed");
        resolve();
      },
    );
  });
}

// Database setup
const db = new sqlite3.Database("./database/parfumerie.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database");

    // Ensure foreign keys are enforced in SQLite
    db.run("PRAGMA foreign_keys = ON");

    // 🚀 ENHANCED REVIEW SYSTEM: Comprehensive database migration
    console.log("🔄 Checking for required database migrations...");

    // Check existing table structure
    db.all("PRAGMA table_info(reviews)", (err, columns) => {
      if (err) {
        console.error("❌ Error checking reviews table structure:", err);
        return;
      }

      const hasUserEmail = columns.some((col) => col.name === "user_email");
      const hasIsAdmin = columns.some((col) => col.name === "is_admin");
      const hasEditedAt = columns.some((col) => col.name === "edited_at");
      const hasIsEdited = columns.some((col) => col.name === "is_edited");

      // Add missing columns to reviews table
      if (!hasUserEmail) {
        console.log("🔄 Adding user_email column to reviews table...");
        db.run("ALTER TABLE reviews ADD COLUMN user_email TEXT", (err) => {
          if (err) console.error("❌ Error adding user_email column:", err);
          else console.log("✅ Added user_email column to reviews table");
        });
      }

      if (!hasIsAdmin) {
        console.log("🔄 Adding is_admin column to reviews table...");
        db.run(
          "ALTER TABLE reviews ADD COLUMN is_admin INTEGER DEFAULT 0",
          (err) => {
            if (err) console.error("❌ Error adding is_admin column:", err);
            else console.log("✅ Added is_admin column to reviews table");
          },
        );
      }

      if (!hasEditedAt) {
        console.log("🔄 Adding edited_at column to reviews table...");
        db.run("ALTER TABLE reviews ADD COLUMN edited_at DATETIME", (err) => {
          if (err) console.error("❌ Error adding edited_at column:", err);
          else console.log("✅ Added edited_at column to reviews table");
        });
      }

      if (!hasIsEdited) {
        console.log("🔄 Adding is_edited column to reviews table...");
        db.run(
          "ALTER TABLE reviews ADD COLUMN is_edited INTEGER DEFAULT 0",
          (err) => {
            if (err) console.error("❌ Error adding is_edited column:", err);
            else console.log("✅ Added is_edited column to reviews table");
          },
        );
      }
    });

    // Create review_replies table for nested replies
    console.log("🔄 Creating review_replies table...");
    db.run(
      `
            CREATE TABLE IF NOT EXISTS review_replies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                review_id INTEGER NOT NULL,
                parent_reply_id INTEGER,
                user_id INTEGER NOT NULL,
                user_name TEXT NOT NULL,
                user_email TEXT,
                user_avatar TEXT,
                is_admin INTEGER DEFAULT 0,
                reply_text TEXT NOT NULL,
                likes INTEGER DEFAULT 0,
                dislikes INTEGER DEFAULT 0,
                is_edited INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                edited_at DATETIME,
                FOREIGN KEY (review_id) REFERENCES reviews (id) ON DELETE CASCADE,
                FOREIGN KEY (parent_reply_id) REFERENCES review_replies (id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `,
      (err) => {
        if (err) console.error("❌ Error creating review_replies table:", err);
        else console.log("✅ Created review_replies table");
      },
    );

    // Create reply_likes table for reply voting
    console.log("🔄 Creating reply_likes table...");
    db.run(
      `
            CREATE TABLE IF NOT EXISTS reply_likes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                reply_id INTEGER NOT NULL,
                user_id INTEGER NOT NULL,
                like_type TEXT NOT NULL CHECK (like_type IN ('like', 'dislike')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(reply_id, user_id),
                FOREIGN KEY (reply_id) REFERENCES review_replies (id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
        `,
      (err) => {
        if (err) console.error("❌ Error creating reply_likes table:", err);
        else console.log("✅ Created reply_likes table");
      },
    );

    // 🔧 ENHANCED: Create indexes for better performance
    console.log("🔄 Creating database indexes for better performance...");

    // Index for review_replies table
    db.run(
      "CREATE INDEX IF NOT EXISTS idx_review_replies_review_id ON review_replies(review_id)",
      (err) => {
        if (err) console.error("❌ Error creating review_replies index:", err);
        else console.log("✅ Created review_replies index");
      },
    );

    db.run(
      "CREATE INDEX IF NOT EXISTS idx_review_replies_user_id ON review_replies(user_id)",
      (err) => {
        if (err) console.error("❌ Error creating user_id index:", err);
        else console.log("✅ Created user_id index");
      },
    );

    db.run(
      "CREATE INDEX IF NOT EXISTS idx_review_replies_created_at ON review_replies(created_at)",
      (err) => {
        if (err) console.error("❌ Error creating created_at index:", err);
        else console.log("✅ Created created_at index");
      },
    );

    // Index for reply_likes table
    db.run(
      "CREATE INDEX IF NOT EXISTS idx_reply_likes_reply_id ON reply_likes(reply_id)",
      (err) => {
        if (err) console.error("❌ Error creating reply_likes index:", err);
        else console.log("✅ Created reply_likes index");
      },
    );

    // 🔧 NEW: Add updated_at column to existing review_replies table if it doesn't exist
    console.log("🔄 Adding updated_at column to review_replies table...");
    db.run(
      "ALTER TABLE review_replies ADD COLUMN updated_at DATETIME",
      (err) => {
        if (err && !err.message.includes("duplicate column name")) {
          console.error("❌ Error adding updated_at column:", err);
        } else if (!err) {
          console.log("✅ Added updated_at column to review_replies table");
          // Now update existing rows to have a default value
          db.run(
            "UPDATE review_replies SET updated_at = created_at WHERE updated_at IS NULL",
            (updateErr) => {
              if (updateErr) {
                console.error(
                  "❌ Error setting default updated_at values:",
                  updateErr,
                );
              } else {
                console.log(
                  "✅ Set default updated_at values for existing replies",
                );
              }
            },
          );
        } else {
          console.log(
            "✅ updated_at column already exists in review_replies table",
          );
        }
      },
    );

    // 🔧 NEW: Migrate base64 avatars to file system
    console.log("🔄 Migrating base64 avatars to file system...");
    migrateAvatarsToFileSystem();

    console.log("✅ Enhanced review system database migration completed");
  }
});

// Security hardening
app.disable("x-powered-by");
const helmetOptions =
  ENV === "production"
    ? {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "blob:"],
            mediaSrc: ["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            frameAncestors: ["'none'"],
          },
        },
      }
    : { contentSecurityPolicy: false };
app.use(helmet(helmetOptions));

if (ENV === "production" && allowedOrigins.length > 0) {
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );
} else {
  app.use(cors());
}

// Add request logging for debugging
app.use((req, res, next) => {
  if (req.path.startsWith("/api/")) {
    const maskedBody =
      req.body && typeof req.body === "object" ? { ...req.body } : {};
    // Mask sensitive fields if present
    ["password", "verificationCode", "token", "avatarData"].forEach((k) => {
      if (Object.prototype.hasOwnProperty.call(maskedBody, k))
        maskedBody[k] = "***";
    });
    const hasBody = maskedBody && Object.keys(maskedBody).length > 0;
    const bodyInfo = hasBody
      ? `with body: ${JSON.stringify(maskedBody)}`
      : "no body";
    const authInfo = req.headers.authorization ? "with auth" : "no auth";
    console.log(`${req.method} ${req.path} ${bodyInfo} ${authInfo}`);
  }
  next();
});

app.use(express.json({ limit: "10mb" }));

// Block access to sensitive paths/files before static serving
const denyList = [
  "/database",
  "/scripts",
  "/_pgbackup",
  "/_pginfo",
  "/test-api.js",
  "/test-profile-save.js",
  "/investigate-reply-system.js",
  "/reply-system-issues-analysis.md",
  "/script.backup.js",
];
app.use((req, res, next) => {
  const pathToCheck = req.path.toLowerCase();
  const isDeniedPrefix = denyList.some((p) => pathToCheck.startsWith(p));
  const isDbFile = pathToCheck.endsWith(".db");
  const isCheckScript = /^\/check-.*\.js$/.test(pathToCheck);
  if (isDeniedPrefix || isDbFile || isCheckScript) {
    return res.status(404).send("Not found");
  }
  next();
});

app.use(express.static(".", { index: "index.html", dotfiles: "ignore" }));

// Serve avatar files
app.use(
  "/uploads/avatars",
  express.static(path.join(__dirname, "uploads", "avatars")),
);

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs (more generous)
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Don't count successful requests
  skipFailedRequests: false, // Count failed requests
});

// Apply rate limiting to auth routes
app.use("/api/auth", authLimiter);

// Apply modest rate limits to content-posting APIs (skip safe methods, return JSON)
const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => ["GET", "HEAD", "OPTIONS"].includes(req.method),
  message: {
    error: "Too many requests. Please slow down and try again shortly.",
  },
});

app.use(["/api/reviews", "/api/replies"], writeLimiter);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

// Validation helpers
const validateEmail = (email) => {
  return validator.isEmail(email) && email.length <= 255;
};

const validatePassword = (password) => {
  return password && password.length >= 8 && password.length <= 128;
};

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

// 🆕 Level System Functions
// XP and level system functions removed

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!validateName(firstName) || !validateName(lastName)) {
      return res.status(400).json({
        error: "First name and last name must be 2-100 characters long",
      });
    }

    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ error: "Password must be 8-128 characters long" });
    }

    // Check if user already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM users WHERE email = ?",
        [email.toLowerCase()],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user (unverified)
    const userId = await new Promise((resolve, reject) => {
      const stmt = db.prepare(`
                INSERT INTO users (first_name, last_name, email, password_hash, email_verified, verification_code, verification_expires, created_at)
                VALUES (?, ?, ?, ?, 0, ?, ?, datetime('now'))
            `);

      stmt.run(
        [
          firstName.trim(),
          lastName.trim(),
          email.toLowerCase(),
          hashedPassword,
          verificationCode,
          verificationExpires.toISOString(),
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        },
      );
      stmt.finalize();
    });

    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      firstName,
      verificationCode,
    );

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);
      // Continue with registration even if email fails
    }

    // Return response requiring verification
    res.status(201).json({
      success: true,
      message:
        "Account created successfully! Please check your email for verification code.",
      requiresVerification: true,
      userId: userId,
      email: email.toLowerCase(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify token endpoint
app.get("/api/auth/verify", authenticateToken, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE id = ?",
        [req.user.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        isAdmin: user.is_admin === 1,
        avatar: user.avatar_url || "default.jpg",
      },
    });
  } catch (error) {
    console.error("Verify token error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Email verification endpoint
app.post("/api/auth/verify-email", async (req, res) => {
  try {
    const { userId, verificationCode } = req.body;

    if (!userId || !verificationCode) {
      return res
        .status(400)
        .json({ error: "User ID and verification code are required" });
    }

    // Get user from database
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.email_verified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Check if verification code matches and hasn't expired
    if (user.verification_code !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    const now = new Date();
    const expiresAt = new Date(user.verification_expires);
    if (now > expiresAt) {
      return res.status(400).json({ error: "Verification code has expired" });
    }

    // Update user as verified
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET email_verified = 1, verification_code = NULL, verification_expires = NULL WHERE id = ?",
        [userId],
        function (err) {
          if (err) reject(err);
          else resolve();
        },
      );
    });

    // Send welcome email
    await sendWelcomeEmail(user.email, user.first_name);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      message: "Email verified successfully! Welcome to Parfumerie Charme.",
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        isAdmin: user.is_admin === 1,
        avatar: user.avatar_url || "default.jpg",
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Resend verification code endpoint
app.post("/api/auth/resend-verification", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get user from database
    const user = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.email_verified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Update user with new code
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE users SET verification_code = ?, verification_expires = ? WHERE id = ?",
        [verificationCode, verificationExpires.toISOString(), userId],
        function (err) {
          if (err) reject(err);
          else resolve();
        },
      );
    });

    // Send new verification email
    const emailResult = await sendVerificationEmail(
      user.email,
      user.first_name,
      verificationCode,
    );

    if (!emailResult.success) {
      return res
        .status(500)
        .json({ error: "Failed to send verification email" });
    }

    res.json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!validateEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    // Find user
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE email = ?",
        [email.toLowerCase()],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if user is banned
    if (user.is_banned) {
      return res.status(403).json({
        error: "Your account has been banned",
        reason: user.banned_reason || "No reason provided",
        bannedAt: user.banned_at,
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if email is verified (skip for admin)
    if (!user.email_verified && user.is_admin !== 1) {
      return res.status(403).json({
        error: "Please verify your email address before logging in",
        requiresVerification: true,
        userId: user.id,
        email: user.email,
      });
    }

    // Update last login
    db.run("UPDATE users SET last_login = datetime('now') WHERE id = ?", [
      user.id,
    ]);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    // Return user data (without password)
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone: user.phone,
        birthday: user.birthday,
        isAdmin: user.is_admin === 1,
        avatar: user.avatar_url || "default.jpg",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User profile routes
app.get("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE id = ?",
        [req.user.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return comprehensive user data with proper formatting
    const profileData = {
      id: user.id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
      email: user.email,
      phone: user.phone || "",
      birthday: user.birthday || "",
      avatar: user.avatar_url || "default.jpg",
      avatar_url: user.avatar_url,
      email_verified: Boolean(user.email_verified),
      is_admin: Boolean(user.is_admin),
      is_banned: Boolean(user.is_banned),
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      // Level system data (simplified - XP system removed)
      level: 1,
      experience: 0,
      currentXP: 0,
      requiredXP: 100,
      levelProgress: 0,
    };

    console.log(`📋 Profile data for user ${req.user.userId}:`, {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      hasAvatar: !!profileData.avatar_url,
      avatarSize: profileData.avatar_url ? profileData.avatar_url.length : 0,
      level: profileData.level,
      experience: profileData.experience,
      levelProgress: profileData.levelProgress,
    });

    res.json({
      success: true,
      user: profileData,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get profile details for any user (for profile modal)
app.get("/api/user/profile-details", async (req, res) => {
  try {
    const { userId, email } = req.query;
    
    if (!userId && !email) {
      return res.status(400).json({ error: "User ID or email required" });
    }
    
    console.log(`🔍 Fetching profile details for: userId=${userId}, email=${email}`);
    
    // Query user by ID or email
    const query = userId ? "SELECT * FROM users WHERE id = ?" : "SELECT * FROM users WHERE email = ?";
    const param = userId || email;
    
    const user = await new Promise((resolve, reject) => {
      db.get(query, [param], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get user's review count
    const reviewCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM reviews WHERE user_id = ?", [user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });

    // Get user's reply count  
    const replyCount = await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM replies WHERE user_id = ?", [user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });

    // Get user's favorite fragrances (if favorites table exists)
    let favorites = [];
    try {
      favorites = await new Promise((resolve, reject) => {
        db.all("SELECT fragrance_name FROM favorites WHERE user_id = ? LIMIT 5", [user.id], (err, rows) => {
          if (err) resolve([]); // Table might not exist
          else resolve(rows || []);
        });
      });
    } catch (error) {
      console.log("Favorites table not found, using empty array");
    }

    // Calculate display name
    const displayName = user.first_name && user.last_name 
      ? `${user.first_name} ${user.last_name}`.trim()
      : user.first_name || user.last_name || user.email.split('@')[0];

    // Return profile data for modal
    const profileData = {
      id: user.id,
      email: user.email,
      displayName: displayName,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      avatar_url: user.avatar_url || "default.jpg",
      is_admin: Boolean(user.is_admin),
      is_banned: Boolean(user.is_banned),
      created_at: user.created_at,
      member_since: user.created_at,
      
      // Stats
      reviewCount: reviewCount,
      replyCount: replyCount,
      followers: 0, // Placeholder - implement followers system later
      following: 0, // Placeholder - implement following system later
      
      // Activity
      favorites: favorites.map(f => f.fragrance_name),
      purchases: [], // Placeholder - implement purchases system later
      
      // Badge/Level info
      level: 1,
      badge: user.is_admin ? "Admin" : "Member",
      bio: `Member since ${new Date(user.created_at).getFullYear()}. ${reviewCount} reviews, ${replyCount} replies.`
    };

    console.log(`✅ Profile details fetched for ${displayName}:`, {
      id: profileData.id,
      displayName: profileData.displayName,
      reviewCount: profileData.reviewCount,
      replyCount: profileData.replyCount,
      favoritesCount: profileData.favorites.length,
      isAdmin: profileData.is_admin
    });

    res.json({
      success: true,
      profile: profileData
    });

  } catch (error) {
    console.error("Profile details fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/user/profile", authenticateToken, async (req, res) => {
  try {
    const { name, first_name, last_name, phone, birthday, avatar } = req.body;

    console.log(`📝 Profile update request for user ${req.user.userId}:`, {
      name,
      first_name,
      last_name,
      phone,
      birthday,
      hasAvatar: !!avatar,
      avatarSize: avatar ? avatar.length : 0,
    });

    // Handle both old format (name) and new format (first_name, last_name)
    let firstName, lastName;

    if (first_name !== undefined && last_name !== undefined) {
      // New format: separate first_name and last_name
      firstName = first_name ? first_name.trim() : "";
      lastName = last_name ? last_name.trim() : "";
    } else if (name) {
      // Old format: parse name into first and last
      const nameParts = name.trim().split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    } else {
      // No name changes
      firstName = null;
      lastName = null;
    }

    // Validation
    if (firstName && !validateName(firstName)) {
      return res.status(400).json({ error: "Invalid first name format" });
    }

    if (lastName && lastName.length > 100) {
      return res.status(400).json({ error: "Last name too long" });
    }

    if (
      phone &&
      !validator.isMobilePhone(phone, "any", { strictMode: false })
    ) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    if (birthday && !validator.isDate(birthday)) {
      return res.status(400).json({ error: "Invalid birthday format" });
    }

    // Validate avatar path if provided (ensure it points to uploads or default)
    let sanitizedAvatar = avatar || undefined;
    if (sanitizedAvatar) {
      const isValidPath =
        sanitizedAvatar === "default.jpg" ||
        sanitizedAvatar.startsWith("/uploads/avatars/") ||
        sanitizedAvatar.startsWith("data:image/");
      if (!isValidPath) {
        return res.status(400).json({ error: "Invalid avatar path" });
      }
    }

    // Update user in database
    await new Promise((resolve, reject) => {
      const stmt = db.prepare(`
                UPDATE users
                SET first_name = COALESCE(?, first_name),
                    last_name = COALESCE(?, last_name),
                    phone = ?,
                    birthday = ?,
                    avatar_url = COALESCE(?, avatar_url),
                    updated_at = datetime('now')
                WHERE id = ?
            `);

      const params = [
        firstName !== null ? firstName : undefined,
        lastName !== null ? lastName : undefined,
        phone || null,
        birthday || null,
        sanitizedAvatar,
        req.user.userId,
      ];

      console.log(`💾 Updating user ${req.user.userId} with params:`, {
        firstName: params[0],
        lastName: params[1],
        phone: params[2],
        birthday: params[3],
        hasAvatar: !!params[4],
        avatarSize: params[4] ? params[4].length : 0,
      });

      stmt.run(params, function (err) {
        if (err) reject(err);
        else resolve();
      });
      stmt.finalize();
    });

    // Get updated user data to return
    const updatedUser = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM users WHERE id = ?",
        [req.user.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    // Return comprehensive updated user data
    const responseData = {
      id: updatedUser.id,
      first_name: updatedUser.first_name || "",
      last_name: updatedUser.last_name || "",
      name: `${updatedUser.first_name || ""} ${updatedUser.last_name || ""}`.trim(),
      email: updatedUser.email,
      phone: updatedUser.phone || "",
      birthday: updatedUser.birthday || "",
      avatar: updatedUser.avatar_url || "default.jpg",
      avatar_url: updatedUser.avatar_url,
      email_verified: Boolean(updatedUser.email_verified),
      is_admin: Boolean(updatedUser.is_admin),
      is_banned: Boolean(updatedUser.is_banned),
      updated_at: updatedUser.updated_at,
    };

    console.log(
      `✅ Profile updated successfully for user ${req.user.userId}:`,
      {
        name: responseData.name,
        hasAvatar: !!responseData.avatar_url,
      },
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: responseData,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Settings routes
app.get("/api/user/settings", authenticateToken, async (req, res) => {
  try {
    const settings = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM user_settings WHERE user_id = ?",
        [req.user.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    res.json({
      success: true,
      settings: settings
        ? {
            emailNotifications: settings.email_notifications === 1,
            smsNotifications: settings.sms_notifications === 1,
            profileVisibility: settings.profile_visibility === 1,
            dataCollection: settings.data_collection === 1,
          }
        : {
            emailNotifications: true,
            smsNotifications: false,
            profileVisibility: true,
            dataCollection: true,
          },
    });
  } catch (error) {
    console.error("Settings fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/user/settings", authenticateToken, async (req, res) => {
  try {
    const {
      emailNotifications,
      smsNotifications,
      profileVisibility,
      dataCollection,
    } = req.body;

    await new Promise((resolve, reject) => {
      const stmt = db.prepare(`
                INSERT OR REPLACE INTO user_settings
                (user_id, email_notifications, sms_notifications, profile_visibility, data_collection, updated_at)
                VALUES (?, ?, ?, ?, ?, datetime('now'))
            `);

      stmt.run(
        [
          req.user.userId,
          emailNotifications ? 1 : 0,
          smsNotifications ? 1 : 0,
          profileVisibility ? 1 : 0,
          dataCollection ? 1 : 0,
        ],
        function (err) {
          if (err) reject(err);
          else resolve();
        },
      );
      stmt.finalize();
    });

    res.json({
      success: true,
      message: "Settings updated successfully",
    });
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Favorites routes
app.get("/api/user/favorites", authenticateToken, async (req, res) => {
  try {
    const favorites = await new Promise((resolve, reject) => {
      db.all(
        "SELECT * FROM user_favorites WHERE user_id = ?",
        [req.user.userId],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        },
      );
    });

    res.json({
      success: true,
      favorites: favorites.map((fav) => ({
        id: fav.id,
        productId: fav.product_id,
        productName: fav.product_name,
        addedAt: fav.created_at,
      })),
    });
  } catch (error) {
    console.error("Favorites fetch error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add to favorites
app.post("/api/user/favorites", authenticateToken, async (req, res) => {
  try {
    const { productId, productName } = req.body;

    if (!productId || !productName) {
      return res
        .status(400)
        .json({ error: "Product ID and name are required" });
    }

    // Check if already in favorites
    const existing = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM user_favorites WHERE user_id = ? AND product_id = ?",
        [req.user.userId, productId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    if (existing) {
      return res.status(409).json({ error: "Product already in favorites" });
    }

    // Add to favorites
    await new Promise((resolve, reject) => {
      const stmt = db.prepare(`
                INSERT INTO user_favorites (user_id, product_id, product_name, created_at)
                VALUES (?, ?, ?, datetime('now'))
            `);

      stmt.run([req.user.userId, productId, productName], function (err) {
        if (err) reject(err);
        else resolve();
      });
      stmt.finalize();
    });

    res.json({
      success: true,
      message: "Product added to favorites",
    });
  } catch (error) {
    console.error("Add to favorites error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove from favorites
app.delete(
  "/api/user/favorites/:productId",
  authenticateToken,
  async (req, res) => {
    try {
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      // Remove from favorites
      const result = await new Promise((resolve, reject) => {
        const stmt = db.prepare(
          "DELETE FROM user_favorites WHERE user_id = ? AND product_id = ?",
        );

        stmt.run([req.user.userId, productId], function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
        stmt.finalize();
      });

      if (result === 0) {
        return res
          .status(404)
          .json({ error: "Product not found in favorites" });
      }

      res.json({
        success: true,
        message: "Product removed from favorites",
      });
    } catch (error) {
      console.error("Remove from favorites error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Toggle favorite (add if not exists, remove if exists)
app.post("/api/user/favorites/toggle", authenticateToken, async (req, res) => {
  try {
    const { productId, productName } = req.body;
    console.log(
      `🔄 Toggle favorite request: userId=${req.user.userId}, productId=${productId}, productName=${productName}`,
    );

    if (!productId || !productName) {
      console.log("❌ Missing productId or productName");
      return res
        .status(400)
        .json({ error: "Product ID and name are required" });
    }

    // Check if already in favorites
    const existing = await new Promise((resolve, reject) => {
      db.get(
        "SELECT id FROM user_favorites WHERE user_id = ? AND product_id = ?",
        [req.user.userId, productId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    console.log(
      `📊 Existing favorite check: ${existing ? "EXISTS" : "NOT EXISTS"} (id: ${existing?.id})`,
    );

    if (existing) {
      // Remove from favorites
      console.log(
        `🗑️ Removing from favorites: userId=${req.user.userId}, productId=${productId}`,
      );
      const result = await new Promise((resolve, reject) => {
        const stmt = db.prepare(
          "DELETE FROM user_favorites WHERE user_id = ? AND product_id = ?",
        );

        stmt.run([req.user.userId, productId], function (err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
        stmt.finalize();
      });

      console.log(`✅ Removal result: ${result} rows affected`);

      res.json({
        success: true,
        action: "removed",
        isFavorite: false,
        message: `${productName} removed from favorites`,
      });
    } else {
      // Add to favorites
      console.log(
        `➕ Adding to favorites: userId=${req.user.userId}, productId=${productId}, productName=${productName}`,
      );
      await new Promise((resolve, reject) => {
        const stmt = db.prepare(`
                    INSERT INTO user_favorites (user_id, product_id, product_name, created_at)
                    VALUES (?, ?, ?, datetime('now'))
                `);

        stmt.run([req.user.userId, productId, productName], function (err) {
          if (err) reject(err);
          else resolve();
        });
        stmt.finalize();
      });

      console.log(`✅ Added to favorites successfully`);

      res.json({
        success: true,
        action: "added",
        isFavorite: true,
        message: `${productName} added to favorites`,
      });
    }
  } catch (error) {
    console.error("Toggle favorites error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Middleware to check admin privileges
const requireAdmin = async (req, res, next) => {
  try {
    const user = await new Promise((resolve, reject) => {
      db.get(
        "SELECT is_admin FROM users WHERE id = ?",
        [req.user.userId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    if (!user || !user.is_admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Public user statistics endpoint (no authentication required)
app.get("/api/stats/users", async (req, res) => {
  try {
    const stats = await new Promise((resolve, reject) => {
      db.get(
        `
                SELECT
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN email LIKE '%@gmail.com' THEN 1 END) as gmail_users,
                    COUNT(CASE WHEN is_admin = 1 THEN 1 END) as admin_users,
                    COUNT(CASE WHEN is_banned = 1 THEN 1 END) as banned_users
                FROM users
            `,
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        },
      );
    });

    res.json({
      success: true,
      stats: {
        totalUsers: stats.total_users,
        gmailUsers: stats.gmail_users,
        adminUsers: stats.admin_users,
        bannedUsers: stats.banned_users,
      },
    });
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user statistics",
    });
  }
});

// Admin Routes
app.get(
  "/api/admin/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await new Promise((resolve, reject) => {
        db.all(
          `
                SELECT
                    id, first_name, last_name, email, phone, birthday,
                    is_admin, is_banned, banned_reason, banned_at,
                    created_at, last_login
                FROM users
                ORDER BY created_at DESC
            `,
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          },
        );
      });

      res.json({
        success: true,
        users: users.map((user) => ({
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          birthday: user.birthday,
          isAdmin: user.is_admin === 1,
          isBanned: user.is_banned === 1,
          bannedReason: user.banned_reason,
          bannedAt: user.banned_at,
          createdAt: user.created_at,
          lastLogin: user.last_login,
        })),
      });
    } catch (error) {
      console.error("Admin users fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Search user profiles endpoint
app.get("/api/search/users", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) {
      return res.json([]);
    }

    const searchTerm = `%${query.toLowerCase()}%`;
    const users = await new Promise((resolve, reject) => {
      db.all(
        `
                SELECT
                    id,
                    first_name,
                    last_name,
                    email,
                    avatar_url,
                    created_at,
                    is_admin
                FROM users
                WHERE
                    (LOWER(first_name) LIKE ? OR
                     LOWER(last_name) LIKE ? OR
                     LOWER(email) LIKE ?)
                    AND is_banned = 0
                ORDER BY
                    CASE
                        WHEN LOWER(first_name) = LOWER(?) THEN 1
                        WHEN LOWER(last_name) = LOWER(?) THEN 2
                        WHEN LOWER(first_name) LIKE ? THEN 3
                        WHEN LOWER(last_name) LIKE ? THEN 4
                        ELSE 5
                    END
                LIMIT 10
            `,
        [
          searchTerm,
          searchTerm,
          searchTerm,
          query,
          query,
          `${query.toLowerCase()}%`,
          `${query.toLowerCase()}%`,
        ],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        },
      );
    });

    // Format the response to include display name and hide sensitive info
    const formattedUsers = users.map((user) => ({
      id: user.id,
      display_name: `${user.first_name} ${user.last_name}`.trim(),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      avatar_url: user.avatar_url,
      member_since: user.created_at,
      is_admin: user.is_admin === 1,
      badge: user.is_admin === 1 ? "Admin" : "Member",
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get(
  "/api/admin/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId, reason } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      if (userId === req.user.userId) {
        return res.status(400).json({ error: "Cannot ban yourself" });
      }

      // Check if user exists
      const targetUser = await new Promise((resolve, reject) => {
        db.get(
          "SELECT id, is_admin FROM users WHERE id = ?",
          [userId],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          },
        );
      });

      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      if (targetUser.is_admin) {
        return res.status(400).json({ error: "Cannot ban admin users" });
      }

      // Ban the user
      await new Promise((resolve, reject) => {
        const stmt = db.prepare(`
                UPDATE users
                SET is_banned = 1, banned_reason = ?, banned_at = datetime('now'), banned_by = ?
                WHERE id = ?
            `);

        stmt.run(
          [reason || "No reason provided", req.user.userId, userId],
          function (err) {
            if (err) reject(err);
            else resolve();
          },
        );
        stmt.finalize();
      });

      res.json({
        success: true,
        message: "User banned successfully",
      });
    } catch (error) {
      console.error("Ban user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

app.post(
  "/api/admin/unban-user",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      // Unban the user
      await new Promise((resolve, reject) => {
        const stmt = db.prepare(`
                UPDATE users
                SET is_banned = 0, banned_reason = NULL, banned_at = NULL, banned_by = NULL
                WHERE id = ?
            `);

        stmt.run([userId], function (err) {
          if (err) reject(err);
          else resolve();
        });
        stmt.finalize();
      });

      res.json({
        success: true,
        message: "User unbanned successfully",
      });
    } catch (error) {
      console.error("Unban user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// Development route to reset rate limits (remove in production)
if (process.env.NODE_ENV === "development") {
  app.post("/api/dev/reset-rate-limit", (req, res) => {
    authLimiter.resetKey(req.ip);
    res.json({ success: true, message: "Rate limit reset for your IP" });
  });

  // Debug route to check favorites in database
  app.get("/api/dev/debug-favorites/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const favorites = await new Promise((resolve, reject) => {
        db.all(
          "SELECT * FROM user_favorites WHERE user_id = ? ORDER BY created_at DESC",
          [userId],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          },
        );
      });

      res.json({
        success: true,
        userId: userId,
        favorites: favorites,
        count: favorites.length,
      });
    } catch (error) {
      console.error("Debug favorites error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Debug route to check user avatar in database
  app.get("/api/dev/debug-user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await new Promise((resolve, reject) => {
        db.get(
          "SELECT id, first_name, last_name, email, avatar_url FROM users WHERE id = ?",
          [userId],
          (err, row) => {
            if (err) reject(err);
            else resolve(row);
          },
        );
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const computedAvatar = user.avatar_url || "default.jpg";

      res.json({
        success: true,
        user: {
          id: user.id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          avatar_url_in_db: user.avatar_url,
          computed_avatar: computedAvatar,
        },
      });
    } catch (error) {
      console.error("Debug user error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Force refresh user data endpoint
  app.post(
    "/api/dev/refresh-user-data",
    authenticateToken,
    async (req, res) => {
      try {
        const user = await new Promise((resolve, reject) => {
          db.get(
            "SELECT * FROM users WHERE id = ?",
            [req.user.userId],
            (err, row) => {
              if (err) reject(err);
              else resolve(row);
            },
          );
        });

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        res.json({
          success: true,
          message: "User data refreshed from database",
          user: {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            phone: user.phone,
            birthday: user.birthday,
            isAdmin: user.is_admin === 1,
            avatar: user.avatar_url || "default.jpg",
          },
        });
      } catch (error) {
        console.error("Refresh user data error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    },
  );
}

// Avatar upload endpoint
app.post("/api/user/upload-avatar", authenticateToken, async (req, res) => {
  try {
    const { avatarData } = req.body;

    if (!avatarData) {
      return res.status(400).json({ error: "Avatar data is required" });
    }

    // Validate that it's a base64 image
    if (!avatarData.startsWith("data:image/")) {
      return res.status(400).json({ error: "Invalid image format" });
    }

    console.log(`📸 Uploading avatar for user ${req.user.userId}`);

    // Update user's avatar in database
    await new Promise((resolve, reject) => {
      const stmt = db.prepare(`
                UPDATE users
                SET avatar_url = ?, updated_at = datetime('now')
                WHERE id = ?
            `);

      stmt.run([avatarData, req.user.userId], function (err) {
        if (err) reject(err);
        else resolve();
      });
      stmt.finalize();
    });

    console.log(`✅ Avatar updated in database for user ${req.user.userId}`);

    // Return success with the new avatar URL
    res.json({
      success: true,
      message: "Avatar updated successfully",
      avatar: avatarData,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Reviews API endpoints
// Get reviews for a specific fragrance
app.get("/api/reviews/:fragrance", (req, res) => {
  const { fragrance } = req.params;

  db.all(
    `SELECT r.*, u.first_name, u.last_name, u.avatar_url, u.is_admin
         FROM reviews r
         LEFT JOIN users u ON r.user_id = u.id
         WHERE r.fragrance = ?
         ORDER BY r.created_at DESC`,
    [fragrance],
    (err, rows) => {
      if (err) {
        console.error("Error fetching reviews:", err);
        return res.status(500).json({ error: "Failed to fetch reviews" });
      }

      // Add level progress calculation for each review
      const reviewsWithLevelData = rows.map((review) => {
        return {
          ...review,
        };
      });

      console.log(
        `✅ Fetched ${reviewsWithLevelData.length} reviews for ${fragrance}`,
      );
      res.json({ success: true, reviews: reviewsWithLevelData });
    },
  );
});

// Post a new review
app.post("/api/reviews", authenticateToken, (req, res) => {
  const { fragrance, rating, review_text } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!fragrance || !rating || !review_text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  // 🔒 SECURITY: Sanitize review text to prevent XSS
  const sanitizedReviewText = sanitizeHtml(review_text);

  if (review_text.length < 10) {
    return res
      .status(400)
      .json({ error: "Review must be at least 10 characters long" });
  }

  // Get user info including admin status
  db.get(
    "SELECT first_name, last_name, avatar_url, is_admin, email FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Failed to fetch user info" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Properly construct user name (avoid trailing spaces)
      const userName = `${user.first_name} ${user.last_name || ""}`.trim();
      const userAvatar = user.avatar_url || "default.jpg";
      const isAdmin = user.is_admin ? 1 : 0;

      console.log(`📝 Creating review for user: "${userName}" (ID: ${userId})`);
      console.log(
        `🖼️ Using avatar: ${userAvatar ? (userAvatar.startsWith("data:") ? "custom base64" : userAvatar) : "default"}`,
      );
      console.log(`👑 User admin status: ${isAdmin}`);

      // Validate user name is not empty
      if (!userName || userName.trim() === "") {
        return res.status(400).json({ error: "User name cannot be empty" });
      }

      // Insert review with admin status (using sanitized text)
      db.run(
        "INSERT INTO reviews (user_id, user_name, user_avatar, user_email, is_admin, fragrance, rating, review_text) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          userId,
          userName,
          userAvatar,
          user.email,
          isAdmin ? 1 : 0,
          fragrance,
          rating,
          sanitizedReviewText,
        ],
        function (err) {
          if (err) {
            console.error("Error inserting review:", err);
            return res.status(500).json({ error: "Failed to save review" });
          }

          // Get the inserted review
          db.get(
            "SELECT * FROM reviews WHERE id = ?",
            [this.lastID],
            async (err, review) => {
              if (err) {
                console.error("Error fetching inserted review:", err);
                return res
                  .status(500)
                  .json({ error: "Review saved but failed to fetch" });
              }

              // 🆕 Award experience for creating a review and return updated XP/level
              let xpPayload = null;
              // XP system removed

              console.log(
                `✅ New review saved for ${fragrance} by ${userName}`,
              );
              res.json({ success: true, review, xp: xpPayload });
            },
          );
        },
      );
    },
  );
});

// Update review likes/dislikes
// Legacy like endpoint removed to prevent unauthenticated spamming of counts
app.post("/api/reviews/:reviewId/like", (req, res) => {
  return res.status(410).json({
    error: "This endpoint is deprecated. Use POST /api/reviews/like instead.",
  });
});

// 🔧 NEW: Avatar upload endpoint with file system storage
app.post(
  "/api/upload-avatar",
  authenticateToken,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const userId = req.user.userId;
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      const fileName = `avatar_${userId}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Process and resize image using Sharp
      await sharp(req.file.buffer)
        .resize(200, 200, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 85 })
        .toFile(filePath);

      // Update user's avatar_url in database
      const avatarUrl = `/uploads/avatars/${fileName}`;

      db.run(
        "UPDATE users SET avatar_url = ? WHERE id = ?",
        [avatarUrl, userId],
        function (err) {
          if (err) {
            console.error("Error updating avatar in database:", err);
            // Clean up uploaded file
            fs.unlink(filePath, () => {});
            return res.status(500).json({ error: "Failed to update avatar" });
          }

          console.log(`✅ Avatar updated for user ${userId}: ${avatarUrl}`);
          res.json({
            success: true,
            avatarUrl: avatarUrl,
            message: "Avatar uploaded successfully",
          });
        },
      );
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ error: "Failed to upload avatar" });
    }
  },
);

// Update user profile in all existing reviews and replies
app.post("/api/reviews/update-user-profile", authenticateToken, (req, res) => {
  console.log("📝 Update profile request body:", req.body);
  const { name, avatar } = req.body;
  const userId = req.user.userId;

  console.log(
    `📝 Updating profile for user ${userId}: name="${name}", avatar="${avatar}"`,
  );

  if (!name) {
    console.error("❌ Name is missing from request");
    return res.status(400).json({ error: "Name is required" });
  }

  // Start transaction to update both reviews and replies
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    let reviewsUpdated = 0;
    let repliesUpdated = 0;
    let errors = [];

    // Update all reviews for this user
    db.run(
      "UPDATE reviews SET user_name = ?, user_avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
      [name, avatar || "default.jpg", userId],
      function (err) {
        if (err) {
          console.error("Error updating user profile in reviews:", err);
          errors.push("Failed to update reviews");
        } else {
          reviewsUpdated = this.changes;
          console.log(
            `✅ Updated profile in ${reviewsUpdated} reviews for user ${userId}`,
          );
        }

        // Update all replies for this user
        db.run(
          "UPDATE review_replies SET user_name = ?, user_avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
          [name, avatar || "default.jpg", userId],
          function (err) {
            if (err) {
              console.error("Error updating user profile in replies:", err);
              errors.push("Failed to update replies");
            } else {
              repliesUpdated = this.changes;
              console.log(
                `✅ Updated profile in ${repliesUpdated} replies for user ${userId}`,
              );
            }

            // Commit or rollback transaction
            if (errors.length > 0) {
              db.run("ROLLBACK");
              return res.status(500).json({
                error: "Failed to update profile",
                details: errors,
              });
            } else {
              db.run("COMMIT");
              res.json({
                success: true,
                updatedReviews: reviewsUpdated,
                updatedReplies: repliesUpdated,
                message: `Updated ${reviewsUpdated} reviews and ${repliesUpdated} replies with new profile information`,
              });
            }
          },
        );
      },
    );
  });
});

// Update review endpoint
app.put("/api/reviews/update", authenticateToken, (req, res) => {
  const { reviewId, fragrance, text, rating } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!reviewId || !fragrance || !text || !rating) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: "Rating must be between 1 and 5" });
  }

  if (text.length > 500) {
    return res
      .status(400)
      .json({ error: "Review text must be 500 characters or less" });
  }

  // Check if user owns this review or is admin
  db.get(
    "SELECT user_id FROM reviews WHERE id = ?",
    [reviewId],
    (err, review) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Check if user owns the review
      if (review.user_id !== userId) {
        // Check if user is admin
        db.get(
          "SELECT is_admin FROM users WHERE id = ?",
          [userId],
          (err, user) => {
            if (err || !user || !user.is_admin) {
              return res
                .status(403)
                .json({ error: "You can only edit your own reviews" });
            }

            // Admin can edit any review
            updateReview();
          },
        );
      } else {
        // User owns the review
        updateReview();
      }

      function updateReview() {
        // Sanitize review text to avoid XSS
        const sanitizedText = sanitizeHtml(text);
        db.run(
          "UPDATE reviews SET review_text = ?, rating = ?, updated_at = datetime('now') WHERE id = ?",
          [sanitizedText, rating, reviewId],
          function (err) {
            if (err) {
              console.error("Database error:", err);
              return res.status(500).json({ error: "Failed to update review" });
            }

            res.json({
              success: true,
              message: "Review updated successfully",
            });
          },
        );
      }
    },
  );
});

// Delete review endpoint
app.delete("/api/reviews/delete", authenticateToken, (req, res) => {
  const { reviewId, fragrance } = req.body;
  const userId = req.user.userId;

  // Validation
  if (!reviewId || !fragrance) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check if user owns this review or is admin
  db.get(
    "SELECT user_id FROM reviews WHERE id = ?",
    [reviewId],
    (err, review) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      // Check if user owns the review
      if (review.user_id !== userId) {
        // Check if user is admin
        db.get(
          "SELECT is_admin FROM users WHERE id = ?",
          [userId],
          (err, user) => {
            if (err || !user || !user.is_admin) {
              return res
                .status(403)
                .json({ error: "You can only delete your own reviews" });
            }

            // Admin can delete any review
            deleteReview();
          },
        );
      } else {
        // User owns the review
        deleteReview();
      }

      function deleteReview() {
        db.run("DELETE FROM reviews WHERE id = ?", [reviewId], function (err) {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to delete review" });
          }

          res.json({
            success: true,
            message: "Review deleted successfully",
          });
        });
      }
    },
  );
});

// Like/Dislike review endpoint
app.post("/api/reviews/like", authenticateToken, (req, res) => {
  const { reviewId, likeType } = req.body; // likeType: 'like' or 'dislike'
  const userId = req.user.userId;

  // Validation
  if (!reviewId || !likeType) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!["like", "dislike"].includes(likeType)) {
    return res
      .status(400)
      .json({ error: 'Invalid like type. Must be "like" or "dislike"' });
  }

  console.log(`👍 User ${userId} ${likeType}s review ${reviewId}`);

  // Check if user already liked/disliked this review
  db.get(
    "SELECT like_type FROM review_likes WHERE review_id = ? AND user_id = ?",
    [reviewId, userId],
    (err, existingLike) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (existingLike) {
        if (existingLike.like_type === likeType) {
          // User is removing their like/dislike
          db.run(
            "DELETE FROM review_likes WHERE review_id = ? AND user_id = ?",
            [reviewId, userId],
            function (err) {
              if (err) {
                console.error("Database error:", err);
                return res
                  .status(500)
                  .json({ error: "Failed to remove like/dislike" });
              }

              updateReviewCounts(reviewId, res, `${likeType} removed`);
            },
          );
        } else {
          // User is changing their like/dislike
          db.run(
            "UPDATE review_likes SET like_type = ?, created_at = datetime('now') WHERE review_id = ? AND user_id = ?",
            [likeType, reviewId, userId],
            function (err) {
              if (err) {
                console.error("Database error:", err);
                return res
                  .status(500)
                  .json({ error: "Failed to update like/dislike" });
              }

              updateReviewCounts(reviewId, res, `changed to ${likeType}`);
            },
          );
        }
      } else {
        // User is adding a new like/dislike
        db.run(
          "INSERT INTO review_likes (review_id, user_id, like_type) VALUES (?, ?, ?)",
          [reviewId, userId, likeType],
          function (err) {
            if (err) {
              console.error("Database error:", err);
              return res
                .status(500)
                .json({ error: "Failed to add like/dislike" });
            }

            updateReviewCounts(reviewId, res, `${likeType} added`);
          },
        );
      }
    },
  );

  // Helper function to update review counts and respond
  function updateReviewCounts(reviewId, res, action) {
    // Get updated counts
    db.all(
      `SELECT
                SUM(CASE WHEN like_type = 'like' THEN 1 ELSE 0 END) as likes,
                SUM(CASE WHEN like_type = 'dislike' THEN 1 ELSE 0 END) as dislikes
             FROM review_likes WHERE review_id = ?`,
      [reviewId],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ error: "Failed to get updated counts" });
        }

        const counts = result[0] || { likes: 0, dislikes: 0 };
        const likes = counts.likes || 0;
        const dislikes = counts.dislikes || 0;

        // Update the reviews table with new counts
        db.run(
          "UPDATE reviews SET likes = ?, dislikes = ?, updated_at = datetime('now') WHERE id = ?",
          [likes, dislikes, reviewId],
          function (err) {
            if (err) {
              console.error("Database error:", err);
              return res
                .status(500)
                .json({ error: "Failed to update review counts" });
            }

            console.log(
              `✅ Review ${reviewId}: ${action} - Likes: ${likes}, Dislikes: ${dislikes}`,
            );

            res.json({
              success: true,
              message: `Review ${action} successfully`,
              likes: likes,
              dislikes: dislikes,
            });
          },
        );
      },
    );
  }
});

// Get user's like status for reviews
app.get("/api/reviews/likes/:fragrance", authenticateToken, (req, res) => {
  const fragrance = req.params.fragrance;
  const userId = req.user.userId;

  console.log(
    `📊 Getting like status for user ${userId} on ${fragrance} reviews`,
  );

  db.all(
    `SELECT rl.review_id, rl.like_type
         FROM review_likes rl
         JOIN reviews r ON rl.review_id = r.id
         WHERE r.fragrance = ? AND rl.user_id = ?`,
    [fragrance, userId],
    (err, likes) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Convert to object for easy lookup
      const likeStatus = {};
      likes.forEach((like) => {
        likeStatus[like.review_id] = like.like_type;
      });

      res.json({
        success: true,
        likes: likeStatus,
      });
    },
  );
});

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🚀 ENHANCED REVIEW SYSTEM: Reply Management Endpoints

// Get replies for a specific review
app.get("/api/reviews/:reviewId/replies", (req, res) => {
  const { reviewId } = req.params;

  // 🔧 ENHANCED: Validate reviewId parameter
  if (!reviewId || isNaN(parseInt(reviewId))) {
    return res.status(400).json({ error: "Invalid review ID" });
  }

  console.log(`📥 Fetching replies for review ${reviewId}`);

  // 🔧 ENHANCED: Check if review exists first
  db.get("SELECT id FROM reviews WHERE id = ?", [reviewId], (err, review) => {
    if (err) {
      console.error("Error checking review existence:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Fetch replies with user data
    db.all(
      `
            SELECT r.*,
                   u.first_name, u.last_name, u.avatar_url, u.is_admin,
                   COALESCE(
                       (SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id AND like_type = 'like'), 0
                   ) as likes,
                   COALESCE(
                       (SELECT COUNT(*) FROM reply_likes WHERE reply_id = r.id AND like_type = 'dislike'), 0
                   ) as dislikes
            FROM review_replies r
            LEFT JOIN users u ON r.user_id = u.id
            WHERE r.review_id = ?
            ORDER BY r.created_at ASC
            LIMIT 100
        `,
      [reviewId],
      (err, replies) => {
        if (err) {
          console.error("Error fetching replies:", err);
          return res.status(500).json({ error: "Failed to fetch replies" });
        }

        // Ensure we have an array of replies
        const safeReplies = Array.isArray(replies) ? replies : [];
        
        console.log(
          `✅ Found ${safeReplies.length} replies for review ${reviewId}`,
        );
        res.json({ success: true, replies: safeReplies });
      },
    );
  });
});

// Rate limiting for reply submissions
const replyRateLimit = new Map();

// Add a reply to a review
app.post("/api/reviews/:reviewId/replies", authenticateToken, (req, res) => {
  const { reviewId } = req.params;
  const { reply_text, parent_reply_id } = req.body;
  const userId = req.user.userId;

  // 🔧 ENHANCED: Rate limiting to prevent spam
  const now = Date.now();
  const userKey = `reply_${userId}`;
  const lastReply = replyRateLimit.get(userKey) || 0;
  const rateLimitWindow = 30000; // 30 seconds between replies

  if (now - lastReply < rateLimitWindow) {
    const remainingTime = Math.ceil(
      (rateLimitWindow - (now - lastReply)) / 1000,
    );
    return res.status(429).json({
      error: `Please wait ${remainingTime} seconds before submitting another reply`,
    });
  }
  replyRateLimit.set(userKey, now);

  // Clean up old rate limit entries (older than 1 hour)
  for (const [key, timestamp] of replyRateLimit.entries()) {
    if (now - timestamp > 3600000) {
      // 1 hour
      replyRateLimit.delete(key);
    }
  }

  // 🔧 ENHANCED: Comprehensive server-side reply validation
  if (!reply_text || reply_text.trim().length === 0) {
    return res.status(400).json({ error: "Reply text is required" });
  }

  const trimmedText = reply_text.trim();

  // 🔒 SECURITY: Sanitize reply text to prevent XSS
  const sanitizedReplyText = sanitizeHtml(trimmedText);

  if (trimmedText.length < 3) {
    return res
      .status(400)
      .json({ error: "Reply must be at least 3 characters long" });
  }

  if (trimmedText.length > 1000) {
    return res
      .status(400)
      .json({ error: "Reply text too long (max 1000 characters)" });
  }

  // Check for spam patterns
  const spamPatterns = [
    /(.)\1{10,}/g, // 10+ repeated characters
    /^(.{1,3})\1{5,}$/g, // Short repeated patterns
    /(buy now|click here|free money|make money|earn \$|viagra|casino)/gi,
    /^[^a-zA-Z]*$/g, // Only symbols/numbers
  ];

  const isSpam = spamPatterns.some((pattern) =>
    pattern.test(trimmedText.toLowerCase()),
  );
  if (isSpam) {
    return res.status(400).json({
      error: "Reply appears to be spam. Please write a meaningful comment.",
    });
  }

  // Check for excessive HTML/script content
  if (
    /<script|<iframe|<object|<embed|javascript:|vbscript:/gi.test(trimmedText)
  ) {
    return res.status(400).json({ error: "Reply contains invalid content" });
  }

  console.log(`💬 Adding reply to review ${reviewId} by user ${userId}`);

  // Get user info including admin status
  db.get(
    "SELECT first_name, last_name, avatar_url, is_admin, email FROM users WHERE id = ?",
    [userId],
    (err, user) => {
      if (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({ error: "Failed to fetch user info" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const userName = `${user.first_name} ${user.last_name || ""}`.trim();
      const userAvatar = user.avatar_url || "default.jpg";
      const isAdmin = user.is_admin ? 1 : 0;

      // Insert reply with sanitized content
      db.run(
        `
            INSERT INTO review_replies
            (review_id, parent_reply_id, user_id, user_name, user_email, user_avatar, is_admin, reply_text)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          reviewId,
          parent_reply_id || null,
          userId,
          userName,
          user.email,
          userAvatar,
          isAdmin ? 1 : 0,
          sanitizedReplyText,
        ],
        function (err) {
          if (err) {
            console.error("Error inserting reply:", err);
            return res.status(500).json({ error: "Failed to save reply" });
          }

          // Get the inserted reply
          db.get(
            "SELECT * FROM review_replies WHERE id = ?",
            [this.lastID],
            async (err, reply) => {
              if (err) {
                console.error("Error fetching inserted reply:", err);
                return res
                  .status(500)
                  .json({ error: "Reply saved but failed to fetch" });
              }

              // 🆕 Award experience for creating a reply and return updated XP/level
              let xpPayload = null;
              // XP system removed

              console.log(
                `✅ New reply saved for review ${reviewId} by ${userName}`,
              );
              res.json({ success: true, reply, xp: xpPayload });
            },
          );
        },
      );
    },
  );
});

// Like/Dislike a reply
app.post("/api/replies/:replyId/like", authenticateToken, (req, res) => {
  const { replyId } = req.params;
  const { likeType } = req.body; // 'like' or 'dislike'
  const userId = req.user.userId;

  if (!["like", "dislike"].includes(likeType)) {
    return res
      .status(400)
      .json({ error: 'Invalid like type. Must be "like" or "dislike"' });
  }

  console.log(`👍 User ${userId} ${likeType}s reply ${replyId}`);

  // Check if user already liked/disliked this reply
  db.get(
    "SELECT like_type FROM reply_likes WHERE reply_id = ? AND user_id = ?",
    [replyId, userId],
    (err, existingLike) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (existingLike) {
        if (existingLike.like_type === likeType) {
          // User is removing their like/dislike
          db.run(
            "DELETE FROM reply_likes WHERE reply_id = ? AND user_id = ?",
            [replyId, userId],
            function (err) {
              if (err) {
                console.error("Database error:", err);
                return res
                  .status(500)
                  .json({ error: "Failed to remove like/dislike" });
              }
              updateReplyCounts(replyId, res, `${likeType} removed`);
            },
          );
        } else {
          // User is changing their like/dislike
          db.run(
            "UPDATE reply_likes SET like_type = ? WHERE reply_id = ? AND user_id = ?",
            [likeType, replyId, userId],
            function (err) {
              if (err) {
                console.error("Database error:", err);
                return res
                  .status(500)
                  .json({ error: "Failed to update like/dislike" });
              }
              updateReplyCounts(replyId, res, `changed to ${likeType}`);
            },
          );
        }
      } else {
        // User is adding a new like/dislike
        db.run(
          "INSERT INTO reply_likes (reply_id, user_id, like_type) VALUES (?, ?, ?)",
          [replyId, userId, likeType],
          function (err) {
            if (err) {
              console.error("Database error:", err);
              return res
                .status(500)
                .json({ error: "Failed to add like/dislike" });
            }
            updateReplyCounts(replyId, res, `${likeType} added`);
          },
        );
      }
    },
  );

  function updateReplyCounts(replyId, res, action) {
    db.all(
      `
            SELECT
                COALESCE(SUM(CASE WHEN like_type = 'like' THEN 1 ELSE 0 END), 0) as likes,
                COALESCE(SUM(CASE WHEN like_type = 'dislike' THEN 1 ELSE 0 END), 0) as dislikes
            FROM reply_likes
            WHERE reply_id = ?
        `,
      [replyId],
      (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res
            .status(500)
            .json({ error: "Failed to get updated counts" });
        }

        const counts = result[0] || { likes: 0, dislikes: 0 };
        const likes = counts.likes || 0;
        const dislikes = counts.dislikes || 0;

        console.log(
          `✅ Reply ${replyId}: ${action} - Likes: ${likes}, Dislikes: ${dislikes}`,
        );

        res.json({
          success: true,
          message: `Reply ${action} successfully`,
          likes: likes,
          dislikes: dislikes,
        });
      },
    );
  }
});

// 🗑️ DELETE REPLY: Allow users to delete their own replies
app.delete("/api/replies/:replyId", authenticateToken, (req, res) => {
  const { replyId } = req.params;
  const userId = req.user.userId;

  console.log(`🗑️ User ${userId} attempting to delete reply ${replyId}`);

  // First, check if the reply exists and belongs to the user
  db.get(
    "SELECT * FROM review_replies WHERE id = ?",
    [replyId],
    (err, reply) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!reply) {
        return res.status(404).json({ error: "Reply not found" });
      }

      // Check ownership or admin from DB (synchronously via callback chain)
      const isOwner = reply.user_id === userId;
      if (isOwner) {
        return deleteReply();
      }

      db.get(
        "SELECT is_admin FROM users WHERE id = ?",
        [userId],
        (err, user) => {
          if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
          }

          const isAdmin = !!(user && user.is_admin);
          if (!isAdmin) {
            console.log(
              `❌ User ${userId} not authorized to delete reply ${replyId} (owner: ${reply.user_id})`,
            );
            return res
              .status(403)
              .json({ error: "Not authorized to delete this reply" });
          }

          return deleteReply();
        },
      );

      function deleteReply() {
        console.log(`✅ User ${userId} authorized to delete reply ${replyId}`);
        db.run(
          "DELETE FROM review_replies WHERE id = ?",
          [replyId],
          function (err) {
            if (err) {
              console.error("Error deleting reply:", err);
              return res.status(500).json({ error: "Failed to delete reply" });
            }

            if (this.changes === 0) {
              return res
                .status(404)
                .json({ error: "Reply not found or already deleted" });
            }

            console.log(
              `✅ Reply ${replyId} deleted successfully by user ${userId}`,
            );
            res.json({ success: true, message: "Reply deleted successfully" });
          },
        );
      }
    },
  );
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});
