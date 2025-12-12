const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/randevu-reklamcilik';

async function seedData() {
 try {
  await mongoose.connect(MONGODB_URI);
  const hashedPassword = await bcrypt.hash('Selaminko123*', 10);

  const admin = await mongoose.connection.db.collection('users').findOneAndUpdate(
   { email: 'omerhd16@outlook.com' },
   {
    $set: {
     name: 'Admin',
     email: 'omerhd16@outlook.com',
     password: hashedPassword,
     role: 'admin',
     isActive: true,
     updatedAt: new Date()
    },
    $setOnInsert: {
     createdAt: new Date()
    }
   },
   { upsert: true, returnDocument: 'after' }
  );
  await mongoose.disconnect();
  process.exit(0);
 } catch (error) {
  console.error('❌ Hata:', error);
  process.exit(1);
 }
}

seedData();
