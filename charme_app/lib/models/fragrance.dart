class Fragrance {
  final String name;
  final String brand;
  final String family;
  final String description;
  final List<String> ingredients;
  final int year;
  final String perfumer;
  final String? image;
  final String? concentration;
  final Map<String, double> sizes;
  final bool available;

  const Fragrance({
    required this.name,
    required this.brand,
    required this.family,
    required this.description,
    required this.ingredients,
    required this.year,
    required this.perfumer,
    this.image,
    this.concentration,
    this.sizes = const {},
    this.available = false,
  });

  /// Returns a placeholder image URL based on brand
  String get imageUrl {
    // Use Unsplash perfume images as placeholders
    final hash = name.hashCode.abs() % 20;
    return 'https://images.unsplash.com/photo-${_perfumeImageIds[hash % _perfumeImageIds.length]}?w=400&h=500&fit=crop';
  }

  static const _perfumeImageIds = [
    '1541643600914-78b084683601',
    '1523293182086-7651a899d37f',
    '1588405748880-12d1d2a59f75',
    '1592945403244-b3fbafd7f539',
    '1563170351-be82bc888aa4',
    '1557170334-a9632e77c6e4',
    '1595535373192-0daaef4e36b6',
    '1594035910387-fea081dae7a0',
    '1566977776052-6e61e35bf9be',
    '1587017539504-67cfbddac569',
  ];

  /// Price range based on brand tier
  String get priceRange {
    switch (brand) {
      case 'Parfums de Marly':
      case 'Tom Ford':
      case 'Creed':
      case 'Maison Francis Kurkdjian':
      case 'Byredo':
      case 'Le Labo':
      case 'Nasomatto':
      case 'Xerjoff':
      case 'Amouage':
      case 'Roja Parfums':
        return '\$200 - \$400+';
      case 'Chanel':
      case 'Dior':
      case 'Yves Saint Laurent':
      case 'Hermès':
      case 'Prada':
      case 'Giorgio Armani':
      case 'Bulgari':
        return '\$100 - \$200';
      default:
        return '\$50 - \$150';
    }
  }

  /// Returns family icon name
  String get familyIcon {
    final f = family.toLowerCase();
    if (f.contains('oriental')) return '🌙';
    if (f.contains('woody')) return '🌲';
    if (f.contains('floral')) return '🌸';
    if (f.contains('citrus') || f.contains('fresh')) return '🍋';
    if (f.contains('aquatic')) return '🌊';
    if (f.contains('gourmand')) return '🍫';
    if (f.contains('aromatic')) return '🌿';
    if (f.contains('leather')) return '🖤';
    if (f.contains('spicy')) return '🌶️';
    if (f.contains('fougere')) return '🍃';
    return '✨';
  }
}
