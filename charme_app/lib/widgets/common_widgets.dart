import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../models/fragrance.dart';

class IngredientChip extends StatelessWidget {
  final String ingredient;
  final bool isHighlighted;

  const IngredientChip({
    super.key,
    required this.ingredient,
    this.isHighlighted = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: isHighlighted ? AppTheme.goldMuted : AppTheme.surfaceRaised,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isHighlighted ? AppTheme.borderGold : AppTheme.borderColor,
        ),
      ),
      child: Text(
        ingredient,
        style: TextStyle(
          color: isHighlighted ? AppTheme.gold : AppTheme.textSecondary,
          fontSize: 12,
          fontWeight: isHighlighted ? FontWeight.w600 : FontWeight.w400,
        ),
      ),
    );
  }
}

class ScentProfileBar extends StatelessWidget {
  final String label;
  final double value; // 0..1
  final Color? color;

  const ScentProfileBar({
    super.key,
    required this.label,
    required this.value,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final barColor = color ?? AppTheme.gold;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            child: Text(
              label,
              style: const TextStyle(
                color: AppTheme.textSecondary,
                fontSize: 11,
              ),
            ),
          ),
          Expanded(
            child: Container(
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.surfaceRaised,
                borderRadius: BorderRadius.circular(2),
              ),
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: value.clamp(0, 1),
                child: Container(
                  decoration: BoxDecoration(
                    color: barColor,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class BrandHeader extends StatelessWidget {
  final String brand;
  final int count;
  final VoidCallback? onSeeAll;

  const BrandHeader({
    super.key,
    required this.brand,
    required this.count,
    this.onSeeAll,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  brand,
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                const SizedBox(height: 2),
                Text(
                  '$count fragrances',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          if (onSeeAll != null)
            TextButton(
              onPressed: onSeeAll,
              child: const Text(
                'See All',
                style: TextStyle(
                  color: AppTheme.gold,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Generates a scent profile from fragrance ingredients
Map<String, double> generateScentProfile(Fragrance fragrance) {
  final profile = <String, double>{};
  final ingredients = fragrance.ingredients.map((i) => i.toLowerCase()).toList();

  // Freshness
  final freshNotes = ['bergamot', 'lemon', 'lime', 'grapefruit', 'mint', 'orange', 'mandarin', 'neroli', 'petitgrain', 'aquatic notes', 'sea notes'];
  profile['Fresh'] = _calculateScore(ingredients, freshNotes);

  // Woody
  final woodyNotes = ['cedar', 'sandalwood', 'vetiver', 'oud', 'patchouli', 'birch', 'guaiac wood', 'cedarwood'];
  profile['Woody'] = _calculateScore(ingredients, woodyNotes);

  // Spicy
  final spicyNotes = ['pepper', 'pink pepper', 'black pepper', 'cinnamon', 'cardamom', 'saffron', 'ginger', 'clove'];
  profile['Spicy'] = _calculateScore(ingredients, spicyNotes);

  // Sweet
  final sweetNotes = ['vanilla', 'tonka bean', 'chocolate', 'praline', 'honey', 'benzoin', 'amber', 'caramel', 'coffee'];
  profile['Sweet'] = _calculateScore(ingredients, sweetNotes);

  // Floral
  final floralNotes = ['rose', 'jasmine', 'iris', 'lavender', 'geranium', 'heliotrope', 'violet', 'orange blossom', 'ylang ylang'];
  profile['Floral'] = _calculateScore(ingredients, floralNotes);

  // Smoky
  final smokyNotes = ['smoke', 'tobacco', 'leather', 'incense', 'oud', 'frankincense'];
  profile['Smoky'] = _calculateScore(ingredients, smokyNotes);

  return profile;
}

double _calculateScore(List<String> ingredients, List<String> notes) {
  int count = 0;
  for (final note in notes) {
    if (ingredients.any((i) => i.contains(note) || note.contains(i))) {
      count++;
    }
  }
  return (count / 3).clamp(0.0, 1.0);
}
