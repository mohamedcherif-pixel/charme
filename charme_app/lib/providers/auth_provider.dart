import 'package:flutter/foundation.dart';

class AuthProvider extends ChangeNotifier {
  bool _isLoggedIn = false;
  String _userName = '';
  String _userEmail = '';
  String? _avatarUrl;

  bool get isLoggedIn => _isLoggedIn;
  String get userName => _userName;
  String get userEmail => _userEmail;
  String? get avatarUrl => _avatarUrl;

  void login(String name, String email) {
    _isLoggedIn = true;
    _userName = name;
    _userEmail = email;
    notifyListeners();
  }

  void logout() {
    _isLoggedIn = false;
    _userName = '';
    _userEmail = '';
    _avatarUrl = null;
    notifyListeners();
  }

  void updateProfile({String? name, String? email, String? avatarUrl}) {
    if (name != null) _userName = name;
    if (email != null) _userEmail = email;
    if (avatarUrl != null) _avatarUrl = avatarUrl;
    notifyListeners();
  }
}
