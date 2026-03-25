import mongoose from 'mongoose';
import Product from './api/models/product.schema.js';
import 'dotenv/config';

// Better matched images for each product (Based on the name)
const imageMap: Record<string, string[]> = {
  'Premium Wireless Headphones': ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'],
  'Ultra HD 4K Webcam': ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'],
  'Ergonomic Mechanical Keyboard': ['https://images.unsplash.com/photo-1587829191301-dc798b83add3?w=800&q=80'],
  'Professional USB-C Hub': ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&q=80'],
  'Smart RGB LED Strip Lights': ['https://images.unsplash.com/photo-1544923408-75c3861e759c?w=800&q=80'],
  'Portable SSD 1TB': ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80'],
  'Wireless Charging Pad': ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'],
  'Premium Monitor Stand with USB Hub': ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
  'Cooling Laptop Stand': ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'],
  'Portable Bluetooth Speaker': ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'],
  'Desktop RGB Microphone': ['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80'],
  'Wireless Noise Cancelling Headphones': ['https://images.unsplash.com/photo-1518441902110-7a8c6f6b3b7a?w=800&q=80'],
  'Smart Watch Series 8': ['https://images.unsplash.com/photo-1517430816045-df4b7de1d9f0?w=800&q=80'],
  'Gaming Mechanical Keyboard': ['https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80'],
  '4K Ultra HD Smart TV': ['https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80'],
  'DSLR Camera Canon EOS': ['https://images.unsplash.com/photo-1519183071298-a2962eadc4b4?w=800&q=80'],
  'Bluetooth Earbuds Pro': ['https://images.unsplash.com/photo-1606220588913-b3aacb4d2f37?w=800&q=80'],
  'Gaming Mouse RGB': ['https://images.unsplash.com/photo-1587202372775-9895d7b9b1c3?w=800&q=80'],
  'Laptop Stand Aluminum': ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'],
  'Smartphone Android X': ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'],
  'Portable Power Bank 20000mAh': ['https://images.unsplash.com/photo-1585386959984-a41552262c8d?w=800&q=80'],
  'Fitness Band Pro': ['https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&q=80'],
  'LED Desk Lamp': ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80'],
  'External Hard Drive 1TB': ['https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800&q=80'],
  'USB-C Hub Multiport': ['https://images.unsplash.com/photo-1587202372599-1c8e0e5c5e0f?w=800&q=80'],
  'Office Chair Ergonomic': ['https://images.unsplash.com/photo-1582582494700-7b8ed0c8b6d3?w=800&q=80'],
  'Gaming Console NextGen': ['https://images.unsplash.com/photo-1606813902769-1e5c7bca6b2f?w=800&q=80'],
  'Smart Home Security Camera': ['https://images.unsplash.com/photo-1581092334507-63a16f6a0f60?w=800&q=80'],
  'Electric Kettle 1.5L': ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80'],
  'Backpack Laptop Bag': ['https://images.unsplash.com/photo-1585386959984-a41552262c8d?w=800&q=80']
};

const updateImages = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/amazon-clone';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to update`);

    for (const product of products) {
      if (imageMap[product.name]) {
        product.images = imageMap[product.name];
        await product.save();
        console.log(`Updated images for: ${product.name}`);
      } else {
        // Fallback generic product image
        product.images = [`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80`];
        await product.save();
        console.log(`Updated images for (Fallback): ${product.name}`);
      }
    }

    console.log('✅ All products updated successfully');
    await mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error updating products:', err);
    process.exit(1);
  }
};

updateImages();
