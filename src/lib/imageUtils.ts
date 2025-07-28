// Image utilities for blog posts
export const BLOG_IMAGES = {
  // Default images from assets
  academic: '/src/assets/academic-building.jpg',
  lawBooks: '/src/assets/law-books.jpg',
  hero: '/src/assets/hero-image.jpg',
  
  // Uploaded images
  personCar: '/lovable-uploads/personcar2.jpeg',
  uploaded1: '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
  uploaded2: '/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png',
  
  // Category-based image mapping
  categoryImages: {
    'International Criminal Law': '/lovable-uploads/79b917eb-f9ca-4687-b317-cab1aa5e5968.png',
    'Environmental Law': '/src/assets/academic-building.jpg',
    'Human Rights': '/src/assets/law-books.jpg',
    'Trade Law': '/lovable-uploads/a8a8f724-8489-4325-bccb-3c63dd8bd236.png',
    'Transportation Law': '/lovable-uploads/personcar2.jpeg',
  }
};

// Function to get image based on category
export const getImageByCategory = (category: string): string => {
  return BLOG_IMAGES.categoryImages[category as keyof typeof BLOG_IMAGES.categoryImages] || BLOG_IMAGES.academic;
};

// Function to get image with fallback
export const getImageWithFallback = (imageUrl?: string, category?: string): string => {
  if (imageUrl) return imageUrl;
  if (category) return getImageByCategory(category);
  return BLOG_IMAGES.academic; // Default fallback
};

// Function to get random image from available images
export const getRandomImage = (): string => {
  const images = Object.values(BLOG_IMAGES).filter(img => typeof img === 'string');
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}; 