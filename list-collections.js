// Tüm koleksiyonları detaylı listele
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// .env.local dosyasını manuel olarak oku
let MONGODB_URI = process.env.MONGODB_URI;

try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = envFile.split('\n');
    envVars.forEach(line => {
      const [key, ...values] = line.split('=');
      if (key.trim() === 'MONGODB_URI') {
        MONGODB_URI = values.join('=').trim();
      }
    });
  }
} catch (error) {
  console.log('⚠️  .env.local dosyası okunamadı');
}

async function listCollections() {
  try {
    console.log('🔄 MongoDB\'ye bağlanılıyor...');
    console.log('📍 URI:', MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI);
    
    const dbName = mongoose.connection.name;
    console.log(`\n✅ Bağlandı: ${dbName} veritabanı\n`);
    
    // Koleksiyonları listele
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    console.log('📁 KOLEKSIYONLAR:\n');
    console.log('='.repeat(60));
    
    if (collections.length === 0) {
      console.log('⚠️  Hiç koleksiyon yok!');
    } else {
      for (const col of collections) {
        const collectionName = col.name;
        const stats = await mongoose.connection.db.collection(collectionName).stats();
        
        console.log(`\n📦 Koleksiyon: ${collectionName}`);
        console.log(`   Döküman sayısı: ${stats.count}`);
        console.log(`   Boyut: ${(stats.size / 1024).toFixed(2)} KB`);
        
        // İlk 2 dökümanı göster
        if (stats.count > 0) {
          const docs = await mongoose.connection.db.collection(collectionName)
            .find({})
            .limit(2)
            .toArray();
          
          console.log(`   İlk kayıt örneği:`);
          docs.forEach((doc, idx) => {
            console.log(`   ${idx + 1}.`, JSON.stringify(doc, null, 2).split('\n').map((line, i) => i === 0 ? line : '      ' + line).join('\n'));
          });
        }
        console.log('   ' + '-'.repeat(55));
      }
    }
    
    console.log('\n' + '='.repeat(60));
    
    // Şimdi users koleksiyonuna özel bak
    console.log('\n\n🔍 USERS KOLEKSIYONU DETAYLI KONTROL:\n');
    
    try {
      const usersCollection = mongoose.connection.db.collection('users');
      const userCount = await usersCollection.countDocuments();
      
      console.log(`✅ users koleksiyonu bulundu!`);
      console.log(`   Toplam kullanıcı: ${userCount}`);
      
      if (userCount > 0) {
        const users = await usersCollection.find({}).toArray();
        console.log('\n   Kullanıcılar:');
        users.forEach((user, idx) => {
          console.log(`   ${idx + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
        });
      }
    } catch (error) {
      console.log('❌ users koleksiyonu bulunamadı!');
      console.log('   Hata:', error.message);
    }
    
  } catch (error) {
    console.error('\n❌ HATA:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n\n🔌 Bağlantı kapatıldı.');
  }
}

listCollections();

