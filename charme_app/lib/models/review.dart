class Review {
  final String userName;
  final String? userAvatar;
  final double rating;
  final String text;
  final DateTime createdAt;
  final int likes;
  final int dislikes;

  const Review({
    required this.userName,
    this.userAvatar,
    required this.rating,
    required this.text,
    required this.createdAt,
    this.likes = 0,
    this.dislikes = 0,
  });
}
