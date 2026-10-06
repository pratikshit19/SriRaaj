// Product data types and mock data for SRIRAAJ

export interface ProductSize {
  label: string;
  value: string;
  price: number;
  compareAtPrice?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: 'ghee' | 'oils' | 'pantry' | 'gifting' | 'new';
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  sizes: ProductSize[];
  ingredients: string;
  nutritionPer100g: Record<string, string>;
  features: string[];
  howToUse: string;
  storage: string;
  stock: number;
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  badges: string[];
  seoTitle: string;
  seoDescription: string;
}

export interface RecipePost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  image: string;
  readTime: string;
  date: string;
  featured: boolean;
}

// ─── Products ────────────────────────────────────────────────────────────────

export const products: Product[] = [
  {
    id: 'p-001',
    name: 'A2 Cow Ghee',
    slug: 'a2-cow-ghee',
    category: 'ghee',
    shortDescription: 'Traditionally churned from A2 milk. Slow-cooked, pure, and deeply nourishing.',
    description: `[PRODUCT DESCRIPTION TO BE PROVIDED]\n\nSriraaj A2 Cow Ghee is made using the traditional Bilona method — slow-churned from curd set from A2 cow milk. The result is a rich, golden ghee with a characteristic grainy texture and a deep, nutty aroma that fills the kitchen the moment you open the jar.\n\nThis ghee carries the essence of a practice passed down through generations — made the way it was always meant to be made.`,
    price: 699,
    compareAtPrice: 849,
    images: [
      '/images/product-ghee.jpg',
      '/images/hero-ghee.jpg',
    ],
    sizes: [
      { label: '250 ml', value: '250ml', price: 499 },
      { label: '500 ml', value: '500ml', price: 699, compareAtPrice: 849 },
      { label: '1 Litre', value: '1l', price: 1299 },
    ],
    ingredients: '[INGREDIENTS TO BE PROVIDED]',
    nutritionPer100g: {
      'Energy': '[TO BE PROVIDED] kcal',
      'Total Fat': '[TO BE PROVIDED] g',
      'Saturated Fat': '[TO BE PROVIDED] g',
      'Protein': '0 g',
      'Carbohydrates': '0 g',
    },
    features: [
      'Sourced from A2 milk cows',
      'Traditional Bilona process',
      'No additives or preservatives',
      'Rich in naturally occurring nutrients',
      'Deep golden colour and grainy texture',
    ],
    howToUse: 'Use for tempering, roasting, or as a finishing touch on dal, rice, and rotis. A small amount goes a long way.',
    storage: 'Store in a cool, dry place away from direct sunlight. Use a clean, dry spoon. Best consumed within 12 months of manufacture.',
    stock: 48,
    rating: 4.8,
    reviewCount: 0,
    reviews: [],
    badges: ['Traditional Process', 'A2 Milk'],
    seoTitle: 'A2 Cow Ghee — Traditionally Made | SRIRAAJ',
    seoDescription: 'Premium A2 Cow Ghee by SRIRAAJ, made using the traditional Bilona method. Pure, authentic, and deeply nourishing.',
  },
  {
    id: 'p-002',
    name: 'Cold-Pressed Mustard Oil',
    slug: 'cold-pressed-mustard-oil',
    category: 'oils',
    shortDescription: 'Single-pressed from select mustard seeds. Pungent, pure, and unmistakably Indian.',
    description: `[PRODUCT DESCRIPTION TO BE PROVIDED]\n\nSriraaj Cold-Pressed Mustard Oil is extracted using the traditional wooden churner (kachi ghani) method — a single pressing at low temperature that preserves the natural pungency and aroma of mustard seeds.\n\nThe result is a deep golden oil with a characteristic sharp flavour that has defined Indian cooking for centuries.`,
    price: 349,
    compareAtPrice: undefined,
    images: [
      '/images/product-mustard-oil.jpg',
    ],
    sizes: [
      { label: '500 ml', value: '500ml', price: 349 },
      { label: '1 Litre', value: '1l', price: 599 },
    ],
    ingredients: '[INGREDIENTS TO BE PROVIDED]',
    nutritionPer100g: {
      'Energy': '[TO BE PROVIDED] kcal',
      'Total Fat': '[TO BE PROVIDED] g',
      'Saturated Fat': '[TO BE PROVIDED] g',
      'Protein': '0 g',
      'Carbohydrates': '0 g',
    },
    features: [
      'Single cold-pressed extraction',
      'Kachi Ghani (wooden press) method',
      'Retains natural pungency and aroma',
      'No solvent extraction',
      'Traditional Indian cooking oil',
    ],
    howToUse: 'Ideal for frying, tempering, pickling, and marinating. Widely used in North and East Indian cooking.',
    storage: 'Store in a cool, dry place. Keep away from sunlight. Best consumed within 6 months of pressing.',
    stock: 63,
    rating: 4.7,
    reviewCount: 0,
    reviews: [],
    badges: ['Cold Pressed', 'Kachi Ghani'],
    seoTitle: 'Cold-Pressed Mustard Oil — Kachi Ghani | SRIRAAJ',
    seoDescription: 'Traditional cold-pressed mustard oil by SRIRAAJ. Extracted using the Kachi Ghani method for authentic pungency and flavour.',
  },
  {
    id: 'p-003',
    name: 'Cold-Pressed Groundnut Oil',
    slug: 'cold-pressed-groundnut-oil',
    category: 'oils',
    shortDescription: 'Pressed from select groundnuts. Mild, stable, and naturally flavourful.',
    description: `[PRODUCT DESCRIPTION TO BE PROVIDED]\n\nSriraaj Cold-Pressed Groundnut Oil is made from carefully selected groundnuts, pressed slowly at low temperatures to retain natural flavour and nutritional integrity.\n\nWith a mild nuttiness and high smoke point, it is a versatile everyday cooking oil rooted in Indian tradition.`,
    price: 399,
    compareAtPrice: undefined,
    images: [
      '/images/product-groundnut-oil.jpg',
    ],
    sizes: [
      { label: '500 ml', value: '500ml', price: 399 },
      { label: '1 Litre', value: '1l', price: 699 },
    ],
    ingredients: '[INGREDIENTS TO BE PROVIDED]',
    nutritionPer100g: {
      'Energy': '[TO BE PROVIDED] kcal',
      'Total Fat': '[TO BE PROVIDED] g',
      'Saturated Fat': '[TO BE PROVIDED] g',
      'Protein': '0 g',
      'Carbohydrates': '0 g',
    },
    features: [
      'Cold-pressed from select groundnuts',
      'High smoke point for all-purpose cooking',
      'Mild natural nutty flavour',
      'No chemical solvents used',
      'Traditional pressing method',
    ],
    howToUse: 'Suitable for deep-frying, sautéing, salad dressings, and everyday cooking. A staple in Gujarati and South Indian cuisine.',
    storage: 'Store in a cool, dry place. Avoid direct sunlight. Best consumed within 6 months of pressing.',
    stock: 55,
    rating: 4.6,
    reviewCount: 0,
    reviews: [],
    badges: ['Cold Pressed', 'High Smoke Point'],
    seoTitle: 'Cold-Pressed Groundnut Oil — Traditional Process | SRIRAAJ',
    seoDescription: 'Premium cold-pressed groundnut oil by SRIRAAJ. Made from select groundnuts using traditional cold-pressing for authentic flavour.',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products;
  return products.filter((p) => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.slice(0, 3);
}

// ─── Recipes ─────────────────────────────────────────────────────────────────

export const recipes: RecipePost[] = [
  {
    id: 'r-001',
    title: 'Dal Tadka with Ghee',
    slug: 'dal-tadka-with-ghee',
    category: 'Everyday Cooking',
    excerpt: 'The humble dal elevated by a finishing spoonful of pure A2 ghee — an essential of the Indian kitchen.',
    image: '/images/recipe-ghee-rice.jpg',
    readTime: '25 min',
    date: 'October 2026',
    featured: true,
  },
  {
    id: 'r-002',
    title: 'Sarson ka Saag',
    slug: 'sarson-ka-saag',
    category: 'Regional Classics',
    excerpt: 'Punjab\'s most beloved winter dish — bitter mustard greens cooked low and slow, finished with cold-pressed mustard oil.',
    image: '/images/story-kitchen.jpg',
    readTime: '45 min',
    date: 'October 2026',
    featured: true,
  },
  {
    id: 'r-003',
    title: 'The Art of Tempering',
    slug: 'the-art-of-tempering',
    category: 'Technique',
    excerpt: 'Understanding tadka — India\'s most fundamental cooking technique and the oils that make it perfect.',
    image: '/images/process-sourcing.jpg',
    readTime: '10 min read',
    date: 'September 2026',
    featured: false,
  },
];

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'ghee', label: 'Ghee' },
  { id: 'oils', label: 'Cooking Oils' },
  { id: 'pantry', label: 'Pantry' },
  { id: 'gifting', label: 'Gifting' },
  { id: 'new', label: 'New Arrivals' },
];

// ─── Navigation ───────────────────────────────────────────────────────────────

export const navLinks = [
  { href: '/shop', label: 'Shop' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/our-process', label: 'Our Process' },
  { href: '/quality', label: 'Quality' },
  { href: '/recipes', label: 'Recipes' },
];
