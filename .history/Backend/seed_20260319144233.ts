import mongoose from 'mongoose';
import Product from '../api/models/product.schema.js';
import 'dotenv/config';

const dummyProducts = [
  {
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.',
    price: 199.99,
    category: 'Electronics',
    brand: 'AudioPro',
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500',
    ],
    rating: 4.8,
    numReviews: 245,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Ultra HD 4K Webcam',
    description: 'Professional 4K webcam perfect for streaming and video conferencing with auto-focus and built-in microphone.',
    price: 149.99,
    category: 'Electronics',
    brand: 'VisionTech',
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
      'https://images.unsplash.com/photo-1578303512414-39d8a38c3a09?w=500',
    ],
    rating: 4.6,
    numReviews: 189,
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'Ergonomic Mechanical Keyboard',
    description: 'RGB mechanical keyboard with customizable switches, ergonomic design, and programmable keys.',
    price: 129.99,
    category: 'Electronics',
    brand: 'KeyMaster',
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=500',
      'https://images.unsplash.com/photo-1595225476933-018acacbc767?w=500',
    ],
    rating: 4.7,
    numReviews: 312,
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'Professional USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0 ports, SD card reader, and fast charging support.',
    price: 79.99,
    category: 'Accessories',
    brand: 'ConnectMax',
    stock: 100,
    images: [
      'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
      'https://images.unsplash.com/photo-1588872657840-218e412ee5ff?w=500',
    ],
    rating: 4.5,
    numReviews: 178,
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'Smart RGB LED Strip Lights',
    description: 'App-controlled LED strip lights with 16 million color options and voice control support.',
    price: 49.99,
    category: 'Lighting',
    brand: 'BrightHome',
    stock: 150,
    images: [
      'https://images.unsplash.com/photo-1544923408-75c3861e759c?w=500',
      'https://images.unsplash.com/photo-1567296776843-7aef9b35c5f5?w=500',
    ],
    rating: 4.3,
    numReviews: 421,
    isFeatured: false,
    isTrending: false,
  },
  {
    name: 'Portable SSD 1TB',
    description: 'Ultra-fast portable SSD with 1TB storage, USB 3.1 interface, and compact design for on-the-go storage.',
    price: 189.99,
    category: 'Storage',
    brand: 'DataVault',
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
      'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500',
    ],
    rating: 4.9,
    numReviews: 567,
    isFeatured: true,
    isTrending: true,
  },
  {
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices with LED indicator and non-slip design.',
    price: 34.99,
    category: 'Accessories',
    brand: 'PowerFlow',
    stock: 200,
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500',
    ],
    rating: 4.4,
    numReviews: 334,
    isFeatured: false,
    isTrending: false,
  },
  {
    name: 'Premium Monitor Stand with USB Hub',
    description: 'Adjustable monitor stand with integrated 4-port USB hub, perfect ergonomic positioning, and storage drawer.',
    price: 99.99,
    category: 'Accessories',
    brand: 'DeskPro',
    stock: 80,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    ],
    rating: 4.6,
    numReviews: 203,
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'Cooling Laptop Stand',
    description: 'Aluminum laptop stand with built-in cooling fans, adjustable height, and foldable design.',
    price: 59.99,
    category: 'Accessories',
    brand: 'CoolTech',
    stock: 120,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    ],
    rating: 4.7,
    numReviews: 289,
    isFeatured: true,
    isTrending: false,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360-degree sound wireless speaker with waterproof design, 20-hour battery, and deep bass.',
    price: 89.99,
    category: 'Audio',
    brand: 'SoundWave',
    stock: 95,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    ],
    rating: 4.5,
    numReviews: 456,
    isFeatured: false,
    isTrending: true,
  },
  {
    name: 'Desktop RGB Microphone',
    description: 'Professional streaming microphone with RGB lighting, noise cancellation, and plug-and-play connectivity.',
    price: 119.99,
    category: 'Audio',
    brand: 'StreamPro',
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500',
    ],
    rating: 4.8,
    numReviews: 345,
    isFeatured: true,
    isTrending: true,
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('MongoDB connected');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert dummy products
    const result = await Product.insertMany(dummyProducts);
    console.log(`✅ Successfully seeded ${result.length} products`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
