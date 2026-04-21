const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

async function seed() {
  const client = await pool.connect();
  try {
    // Run schema first
    const schema = fs.readFileSync(
      path.join(__dirname, 'schema.sql'),
      'utf-8'
    );
    await client.query(schema);
    console.log('Schema created successfully');

    // Insert default user
    await client.query(
      `INSERT INTO users (id, name, email, phone)
       VALUES (1, 'Flipkart User', 'user@flipkart.com', '9876543210')
       ON CONFLICT (id) DO NOTHING`
    );

    // Insert categories
    const categories = [
      { name: 'Mobiles', slug: 'mobiles', image_url: 'https://rukminim1.flixcart.com/flap/96/96/image/22fddf3c7da4c4f4.png' },
      { name: 'Electronics', slug: 'electronics', image_url: 'https://rukminim1.flixcart.com/flap/96/96/image/0ff199d1bd27eb98.png' },
      { name: 'Fashion', slug: 'fashion', image_url: 'https://rukminim1.flixcart.com/fk-p-flap/96/96/image/0d75b34f7d8fbcb3.png' },
      { name: 'Home & Furniture', slug: 'home-furniture', image_url: 'https://rukminim1.flixcart.com/flap/96/96/image/ab7e2b022a4587dd.jpg' },
      { name: 'Appliances', slug: 'appliances', image_url: 'https://rukminim1.flixcart.com/fk-p-flap/96/96/image/0139228b2f7eb413.jpg' },
      { name: 'Books', slug: 'books', image_url: 'https://rukminim1.flixcart.com/flap/96/96/image/69c6589653afdb9a.png' },
      { name: 'Toys & Baby', slug: 'toys-baby', image_url: 'https://rukminim1.flixcart.com/flap/96/96/image/dff3f7adcf3a90c6.png' },
      { name: 'Grocery', slug: 'grocery', image_url: 'https://rukminim1.flixcart.com/flap/96/96/image/29327f40e9c4d26b.png' },
    ];

    for (const cat of categories) {
      await client.query(
        'INSERT INTO categories (name, slug, image_url) VALUES (\$1, \$2, \$3) ON CONFLICT (slug) DO NOTHING',
        [cat.name, cat.slug, cat.image_url]
      );
    }
    console.log('Categories seeded');

    // Insert products
    const products = [
      // MOBILES
      {
        name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
        description: 'Samsung Galaxy S24 Ultra features a 6.8-inch Dynamic AMOLED 2X display with a 120Hz refresh rate. Powered by Snapdragon 8 Gen 3 processor with 12GB RAM.',
        price: 129999,
        original_price: 144999,
        discount_percent: 10,
        category_slug: 'mobiles',
        brand: 'Samsung',
        rating: 4.5,
        rating_count: 12845,
        stock: 25,
        highlights: ['256 GB ROM', '17.27 cm (6.8 inch) Quad HD+ Display', '200MP + 50MP + 12MP + 10MP', '5000 mAh Battery', 'Snapdragon 8 Gen 3 Processor'],
        specifications: { "General": { "Brand": "Samsung", "Model": "Galaxy S24 Ultra", "OS": "Android 14", "RAM": "12 GB", "Storage": "256 GB" }, "Display": { "Size": "6.8 inch", "Type": "Dynamic AMOLED 2X", "Resolution": "3120 x 1440" } },
        images: [
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
          'https://images.unsplash.com/photo-1592950630581-03cb41342cc5?w=500',
          'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500',
        ],
      },
      {
        name: 'Apple iPhone 15 Pro Max (Natural Titanium, 256 GB)',
        description: 'iPhone 15 Pro Max. Forged in titanium with the A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.',
        price: 156900,
        original_price: 159900,
        discount_percent: 2,
        category_slug: 'mobiles',
        brand: 'Apple',
        rating: 4.7,
        rating_count: 8562,
        stock: 15,
        highlights: ['256 GB ROM', '17.02 cm (6.7 inch) Super Retina XDR Display', '48MP + 12MP + 12MP', 'A17 Pro Chip', 'USB-C Connector'],
        specifications: { "General": { "Brand": "Apple", "Model": "iPhone 15 Pro Max", "OS": "iOS 17", "RAM": "8 GB", "Storage": "256 GB" } },
        images: [
          'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
          'https://images.unsplash.com/photo-1592286927505-1def25115558?w=500',
          'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500',
        ],
      },
      {
        name: 'OnePlus 12 (Flowy Emerald, 256 GB)',
        description: 'OnePlus 12 features a 6.82-inch 2K 120Hz ProXDR Display with Snapdragon 8 Gen 3 processor and 5400 mAh battery with 100W SUPERVOOC charging.',
        price: 64999,
        original_price: 69999,
        discount_percent: 7,
        category_slug: 'mobiles',
        brand: 'OnePlus',
        rating: 4.4,
        rating_count: 5623,
        stock: 30,
        highlights: ['256 GB ROM', '6.82 inch 2K ProXDR Display', '50MP + 64MP + 48MP', '5400 mAh Battery', '100W SUPERVOOC Charging'],
        specifications: { "General": { "Brand": "OnePlus", "Model": "OnePlus 12", "OS": "OxygenOS 14", "RAM": "12 GB", "Storage": "256 GB" } },
        images: [
          'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
          'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500',
        ],
      },
      {
        name: 'Redmi Note 13 Pro+ 5G (Fusion Purple, 256 GB)',
        description: 'Redmi Note 13 Pro+ 5G with 200MP camera, 120W HyperCharge, and MediaTek Dimensity 7200-Ultra processor.',
        price: 29999,
        original_price: 34999,
        discount_percent: 14,
        category_slug: 'mobiles',
        brand: 'Xiaomi',
        rating: 4.2,
        rating_count: 15432,
        stock: 50,
        highlights: ['256 GB ROM', '6.67 inch AMOLED Display', '200MP OIS Camera', '5000 mAh Battery', '120W HyperCharge'],
        specifications: { "General": { "Brand": "Xiaomi", "Model": "Redmi Note 13 Pro+", "RAM": "8 GB", "Storage": "256 GB" } },
        images: [
          'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500',
          'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        ],
      },

      // ELECTRONICS
      {
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones.',
        price: 26990,
        original_price: 34990,
        discount_percent: 23,
        category_slug: 'electronics',
        brand: 'Sony',
        rating: 4.6,
        rating_count: 7845,
        stock: 40,
        highlights: ['Industry Leading Noise Cancellation', '30 Hours Battery Life', 'Touch Sensor Controls', 'Speak-to-Chat Technology', 'Multipoint Connection'],
        specifications: { "General": { "Brand": "Sony", "Model": "WH-1000XM5", "Type": "Over-Ear", "Connectivity": "Bluetooth 5.2" } },
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
        ],
      },
      {
        name: 'Apple MacBook Air M2 (Midnight, 8 GB/256 GB SSD)',
        description: 'Supercharged by M2 chip. The redesigned MacBook Air is impossibly thin, with a 13.6-inch Liquid Retina display.',
        price: 99990,
        original_price: 119900,
        discount_percent: 17,
        category_slug: 'electronics',
        brand: 'Apple',
        rating: 4.7,
        rating_count: 4523,
        stock: 12,
        highlights: ['Apple M2 Chip', '8 GB Unified Memory', '256 GB SSD', '13.6 inch Liquid Retina Display', '18 Hours Battery Life'],
        specifications: { "General": { "Brand": "Apple", "Model": "MacBook Air M2", "Processor": "Apple M2", "RAM": "8 GB", "Storage": "256 GB SSD" } },
        images: [
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500',
          'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500',
        ],
      },
      {
        name: 'JBL Charge 5 Portable Bluetooth Speaker',
        description: 'JBL Charge 5 features bold JBL Original Pro Sound with an optimized long excursion driver and dual JBL bass radiators.',
        price: 13499,
        original_price: 18999,
        discount_percent: 29,
        category_slug: 'electronics',
        brand: 'JBL',
        rating: 4.4,
        rating_count: 9876,
        stock: 60,
        highlights: ['20 Hours Playtime', 'IP67 Waterproof', 'Built-in Powerbank', 'JBL PartyBoost', 'Dual Bass Radiators'],
        specifications: { "General": { "Brand": "JBL", "Model": "Charge 5", "Type": "Portable Speaker", "Connectivity": "Bluetooth 5.1" } },
        images: [
          'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
          'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500',
        ],
      },
      {
        name: 'Samsung 55" Crystal 4K UHD Smart TV (2024)',
        description: 'Samsung Crystal 4K TV delivers a crystal clear picture with 4K resolution. Powered by Crystal Processor 4K.',
        price: 44990,
        original_price: 64900,
        discount_percent: 31,
        category_slug: 'electronics',
        brand: 'Samsung',
        rating: 4.3,
        rating_count: 6234,
        stock: 18,
        highlights: ['55 inch Crystal 4K Display', 'Crystal Processor 4K', 'PurColor Technology', 'Smart TV with Tizen OS', 'Q-Symphony'],
        specifications: { "General": { "Brand": "Samsung", "Size": "55 inch", "Resolution": "3840 x 2160", "Smart TV": "Yes" } },
        images: [
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
          'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500',
        ],
      },

      // FASHION
      {
        name: 'Nike Air Max 270 Running Shoes (Black/White)',
        description: 'The Nike Air Max 270 features Nike\'s biggest heel Air unit yet for a super-soft ride. Breathable mesh upper.',
        price: 11495,
        original_price: 14995,
        discount_percent: 23,
        category_slug: 'fashion',
        brand: 'Nike',
        rating: 4.3,
        rating_count: 3456,
        stock: 35,
        highlights: ['Breathable Mesh Upper', 'Max Air 270 Unit', 'Foam Midsole', 'Rubber Outsole', 'Pull Tab on Heel'],
        specifications: { "General": { "Brand": "Nike", "Type": "Running Shoes", "Material": "Mesh", "Sole": "Rubber" } },
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
          'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500',
          'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500',
        ],
      },
      {
        name: 'Levi\'s Men\'s 511 Slim Fit Jeans (Blue)',
        description: 'Levi\'s 511 Slim Fit Jeans sit below the waist with a slim fit through the hip and thigh. Made with premium denim.',
        price: 2799,
        original_price: 4599,
        discount_percent: 39,
        category_slug: 'fashion',
        brand: "Levi's",
        rating: 4.2,
        rating_count: 8901,
        stock: 45,
        highlights: ['Slim Fit', 'Premium Denim', 'Mid Rise', '98% Cotton 2% Elastane', 'Machine Washable'],
        specifications: { "General": { "Brand": "Levi's", "Type": "Jeans", "Fit": "Slim", "Material": "Denim" } },
        images: [
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500',
        ],
      },
      {
        name: 'Allen Solly Men\'s Regular Fit Formal Shirt',
        description: 'Classic regular fit formal shirt from Allen Solly. Perfect for office wear with a crisp look.',
        price: 1199,
        original_price: 1999,
        discount_percent: 40,
        category_slug: 'fashion',
        brand: 'Allen Solly',
        rating: 4.1,
        rating_count: 5643,
        stock: 55,
        highlights: ['Regular Fit', '100% Cotton', 'Full Sleeves', 'Spread Collar', 'Machine Washable'],
        specifications: { "General": { "Brand": "Allen Solly", "Type": "Formal Shirt", "Fit": "Regular", "Material": "Cotton" } },
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500',
        ],
      },
      {
        name: 'Fossil Grant Chronograph Leather Watch',
        description: 'The Fossil Grant chronograph watch features a classic Roman numeral dial with genuine leather strap.',
        price: 8495,
        original_price: 12495,
        discount_percent: 32,
        category_slug: 'fashion',
        brand: 'Fossil',
        rating: 4.5,
        rating_count: 2345,
        stock: 20,
        highlights: ['Chronograph Movement', 'Genuine Leather Strap', 'Roman Numeral Dial', '44mm Case', 'Water Resistant'],
        specifications: { "General": { "Brand": "Fossil", "Type": "Chronograph", "Strap": "Leather", "Case Size": "44mm" } },
        images: [
          'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500',
          'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500',
        ],
      },

      // HOME & FURNITURE
      {
        name: 'Wakefit Orthopaedic Memory Foam Mattress (Queen, 6 inch)',
        description: 'Wakefit Orthopaedic Memory Foam Mattress provides optimal support and comfort. CertiPUR-US certified foam.',
        price: 8999,
        original_price: 16949,
        discount_percent: 47,
        category_slug: 'home-furniture',
        brand: 'Wakefit',
        rating: 4.3,
        rating_count: 45678,
        stock: 22,
        highlights: ['Memory Foam', 'Queen Size (78x60)', '6 inch Thickness', '10 Year Warranty', 'CertiPUR-US Certified'],
        specifications: { "General": { "Brand": "Wakefit", "Size": "Queen", "Thickness": "6 inch", "Material": "Memory Foam" } },
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500',
        ],
      },
      {
        name: 'Nilkamal Freedom Mini Medium Storage Cabinet',
        description: 'Nilkamal Freedom Mini is a medium-sized plastic storage cabinet for home and office use.',
        price: 3899,
        original_price: 5999,
        discount_percent: 35,
        category_slug: 'home-furniture',
        brand: 'Nilkamal',
        rating: 4.0,
        rating_count: 7654,
        stock: 15,
        highlights: ['Plastic Material', 'Weather Resistant', '2 Doors', 'Easy Assembly', '5 Year Warranty'],
        specifications: { "General": { "Brand": "Nilkamal", "Material": "Plastic", "Doors": "2", "Color": "Weathered Brown" } },
        images: [
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=500',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
        ],
      },

      // APPLIANCES
      {
        name: 'LG 7 kg Fully Automatic Front Load Washing Machine',
        description: 'LG front load washing machine with 6 Motion Direct Drive technology and Steam wash for allergen-free laundry.',
        price: 29990,
        original_price: 39990,
        discount_percent: 25,
        category_slug: 'appliances',
        brand: 'LG',
        rating: 4.4,
        rating_count: 12345,
        stock: 10,
        highlights: ['7 kg Capacity', '6 Motion DD', 'Steam Wash', 'Inverter Direct Drive', '1200 RPM'],
        specifications: { "General": { "Brand": "LG", "Capacity": "7 kg", "Type": "Front Load", "RPM": "1200" } },
        images: [
          'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500',
          'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500',
        ],
      },
      {
        name: 'Philips Air Fryer HD9200/90 (4.1L)',
        description: 'Philips Essential Air Fryer uses Rapid Air technology to fry your favorites with up to 90% less fat.',
        price: 6499,
        original_price: 9995,
        discount_percent: 35,
        category_slug: 'appliances',
        brand: 'Philips',
        rating: 4.3,
        rating_count: 8765,
        stock: 30,
        highlights: ['4.1L Capacity', 'Rapid Air Technology', '90% Less Fat', 'Touch Screen', '1400W Power'],
        specifications: { "General": { "Brand": "Philips", "Capacity": "4.1L", "Power": "1400W", "Color": "Black" } },
        images: [
          'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
          'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=500',
        ],
      },

      // BOOKS
      {
        name: 'Atomic Habits by James Clear (Paperback)',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. The #1 New York Times bestseller.',
        price: 399,
        original_price: 799,
        discount_percent: 50,
        category_slug: 'books',
        brand: 'Penguin',
        rating: 4.6,
        rating_count: 34567,
        stock: 100,
        highlights: ['Paperback Edition', '320 Pages', 'Language: English', 'Author: James Clear', 'Self-Help Category'],
        specifications: { "General": { "Author": "James Clear", "Publisher": "Penguin", "Pages": "320", "Language": "English" } },
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
        ],
      },
      {
        name: 'The Psychology of Money by Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness. Morgan Housel shares 19 short stories exploring the strange ways people think about money.',
        price: 349,
        original_price: 599,
        discount_percent: 42,
        category_slug: 'books',
        brand: 'Jaico Publishing',
        rating: 4.5,
        rating_count: 23456,
        stock: 80,
        highlights: ['Paperback Edition', '256 Pages', 'Language: English', 'Author: Morgan Housel', 'Finance Category'],
        specifications: { "General": { "Author": "Morgan Housel", "Publisher": "Jaico Publishing", "Pages": "256", "Language": "English" } },
        images: [
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500',
        ],
      },

      // TOYS & BABY
      {
        name: 'LEGO Classic Large Creative Brick Box (790 Pieces)',
        description: 'LEGO Classic Large Creative Brick Box with 790 pieces in 33 different colors. Endless building possibilities.',
        price: 3499,
        original_price: 4999,
        discount_percent: 30,
        category_slug: 'toys-baby',
        brand: 'LEGO',
        rating: 4.7,
        rating_count: 5678,
        stock: 25,
        highlights: ['790 Pieces', '33 Colors', 'Ages 4+', 'Storage Box Included', 'Creative Building'],
        specifications: { "General": { "Brand": "LEGO", "Pieces": "790", "Age": "4+", "Material": "ABS Plastic" } },
        images: [
          'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=500',
          'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500',
        ],
      },

      // GROCERY
      {
        name: 'Tata Sampann Unpolished Toor Dal (1kg)',
        description: 'Tata Sampann Unpolished Toor Dal is sourced directly from farmers. Unpolished and rich in protein.',
        price: 179,
        original_price: 210,
        discount_percent: 15,
        category_slug: 'grocery',
        brand: 'Tata Sampann',
        rating: 4.2,
        rating_count: 12345,
        stock: 200,
        highlights: ['Unpolished', 'Rich in Protein', 'No Artificial Colors', '1kg Pack', 'Farm Fresh'],
        specifications: { "General": { "Brand": "Tata Sampann", "Weight": "1 kg", "Type": "Toor Dal", "Polished": "No" } },
        images: [
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500',
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500',
        ],
      },
    ];

    for (const product of products) {
      // Get category id
      const catResult = await client.query(
        'SELECT id FROM categories WHERE slug = \$1',
        [product.category_slug]
      );
      const categoryId = catResult.rows[0]?.id || null;

      const prodResult = await client.query(
        `INSERT INTO products (name, description, price, original_price, discount_percent, category_id, brand, rating, rating_count, stock, highlights, specifications)
         VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9, \$10, \$11, \$12) RETURNING id`,
        [
          product.name,
          product.description,
          product.price,
          product.original_price,
          product.discount_percent,
          categoryId,
          product.brand,
          product.rating,
          product.rating_count,
          product.stock,
          product.highlights,
          JSON.stringify(product.specifications),
        ]
      );

      const productId = prodResult.rows[0].id;

      // Insert images
      for (let i = 0; i < product.images.length; i++) {
        await client.query(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (\$1, \$2, \$3, \$4)',
          [productId, product.images[i], i === 0, i]
        );
      }
    }

    console.log(`${products.length} products seeded successfully`);
    console.log('Database seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

seed();