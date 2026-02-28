import 'package:flutter/foundation.dart';
import '../models/fragrance.dart';

class FavoritesProvider extends ChangeNotifier {
  final Set<String> _favoriteNames = {};

  Set<String> get favoriteNames => Set.unmodifiable(_favoriteNames);

  int get count => _favoriteNames.length;

  bool isFavorite(String fragranceName) => _favoriteNames.contains(fragranceName);

  void toggle(Fragrance fragrance) {
    if (_favoriteNames.contains(fragrance.name)) {
      _favoriteNames.remove(fragrance.name);
    } else {
      _favoriteNames.add(fragrance.name);
    }
    notifyListeners();
  }

  void remove(String name) {
    _favoriteNames.remove(name);
    notifyListeners();
  }

  void clear() {
    _favoriteNames.clear();
    notifyListeners();
  }
}
