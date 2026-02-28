import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppTheme {
  // ── Brand Colors ──
  static const Color gold = Color(0xFFC9A94E);
  static const Color goldLight = Color(0xFFDFC573);
  static const Color goldDark = Color(0xFFA68B3C);
  static const Color goldMuted = Color(0x1FC9A94E);
  static const Color champagne = Color(0xFFE8D5A3);
  static const Color rose = Color(0xFFD4A0A0);
  static const Color roseMuted = Color(0x1FD4A0A0);

  // ── Surface Colors ──
  static const Color surface = Color(0xFF060606);
  static const Color surfaceRaised = Color(0xFF0E0E0E);
  static const Color surfaceOverlay = Color(0xFF151515);
  static const Color surfaceCard = Color(0xFF111111);
  static const Color surfaceLight = Color(0xFF1A1A1A);
  static const Color surfaceGlass = Color(0x14FFFFFF);

  // ── Text Colors ──
  static const Color textPrimary = Color(0xE6F5F3F0);
  static const Color textSecondary = Color(0x99F5F3F0);
  static const Color textMuted = Color(0x4DF5F3F0);

  // ── Semantic Colors ──
  static const Color success = Color(0xFF3ECF8E);
  static const Color error = Color(0xFFE5484D);
  static const Color warning = Color(0xFFF5A623);

  // ── Border ──
  static const Color borderColor = Color(0x12FFFFFF);
  static const Color borderGold = Color(0x26C9A94E);

  // ── Gradients ──
  static const LinearGradient goldGradient = LinearGradient(
    colors: [Color(0xFFC9A94E), Color(0xFFE8C96A), Color(0xFFA68B3C)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient heroGradient = LinearGradient(
    colors: [Color(0xFF0A0A0A), Color(0xFF111111), Color(0xFF080808)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient cardGradient = LinearGradient(
    colors: [Color(0xFF141414), Color(0xFF0C0C0C)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ── Glass morphism decorator ──
  static BoxDecoration get glassDecoration => BoxDecoration(
        color: surfaceGlass,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0x14FFFFFF), width: 0.5),
      );

  static BoxDecoration get goldBorderDecoration => BoxDecoration(
        gradient: cardGradient,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderGold, width: 0.5),
      );

  // ── Shadows ──
  static List<BoxShadow> get subtleShadow => [
        const BoxShadow(color: Color(0x40000000), blurRadius: 20, offset: Offset(0, 8)),
      ];

  static List<BoxShadow> get goldGlow => [
        const BoxShadow(color: Color(0x1AC9A94E), blurRadius: 24, offset: Offset(0, 4)),
      ];

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: surface,
      primaryColor: gold,
      colorScheme: const ColorScheme.dark(
        primary: gold,
        secondary: goldLight,
        surface: surface,
        error: error,
        onPrimary: surface,
        onSecondary: surface,
        onSurface: textPrimary,
        onError: Colors.white,
        outline: borderColor,
      ),
      fontFamily: 'Inter',
      appBarTheme: const AppBarTheme(
        backgroundColor: surface,
        foregroundColor: textPrimary,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontFamily: 'Playfair Display',
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
          letterSpacing: 1.2,
        ),
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.light,
          systemNavigationBarColor: surface,
          systemNavigationBarIconBrightness: Brightness.light,
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: surfaceRaised,
        selectedItemColor: gold,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        selectedLabelStyle: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, letterSpacing: 0.5),
        unselectedLabelStyle: TextStyle(fontSize: 10, letterSpacing: 0.3),
      ),
      cardTheme: CardThemeData(
        color: surfaceCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(14),
          side: const BorderSide(color: borderColor, width: 1),
        ),
        margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceRaised,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderColor),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: borderColor),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: gold, width: 1.5),
        ),
        hintStyle: const TextStyle(color: textMuted, fontSize: 14),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: gold,
          foregroundColor: surface,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: gold,
          side: const BorderSide(color: borderGold),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          textStyle: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.5,
          ),
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: surfaceRaised,
        labelStyle: const TextStyle(color: textSecondary, fontSize: 12),
        side: const BorderSide(color: borderColor),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
      ),
      dividerTheme: const DividerThemeData(
        color: borderColor,
        thickness: 1,
      ),
      iconTheme: const IconThemeData(color: textSecondary, size: 22),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontFamily: 'Playfair Display',
          fontSize: 28,
          fontWeight: FontWeight.w700,
          color: textPrimary,
          letterSpacing: 0.5,
        ),
        headlineMedium: TextStyle(
          fontFamily: 'Playfair Display',
          fontSize: 22,
          fontWeight: FontWeight.w600,
          color: textPrimary,
          letterSpacing: 0.3,
        ),
        headlineSmall: TextStyle(
          fontFamily: 'Playfair Display',
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleLarge: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textPrimary,
          letterSpacing: 0.2,
        ),
        titleMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w500,
          color: textPrimary,
        ),
        bodyLarge: TextStyle(
          fontSize: 15,
          color: textPrimary,
          height: 1.6,
        ),
        bodyMedium: TextStyle(
          fontSize: 13,
          color: textSecondary,
          height: 1.5,
        ),
        bodySmall: TextStyle(
          fontSize: 11,
          color: textMuted,
          letterSpacing: 0.3,
        ),
        labelLarge: TextStyle(
          fontSize: 12,
          fontWeight: FontWeight.w600,
          color: gold,
          letterSpacing: 1.5,
        ),
        labelSmall: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w500,
          color: textMuted,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}
