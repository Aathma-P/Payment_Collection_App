const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔧 Setting up Payment Collection Database...\n');

    // Connect to MySQL without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL');

    // Read SQL schema file
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    await connection.query(schema);

    console.log('✅ Database created successfully');
    console.log('✅ Tables created successfully');
    console.log('✅ Sample data inserted');
    console.log('\n═══════════════════════════════════════════');
    console.log('  Database Setup Complete! 🎉');
    console.log('═══════════════════════════════════════════\n');
    console.log('You can now start the server with:');
    console.log('  npm start');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    console.error('\nPlease check:');
    console.error('  1. MySQL is installed and running');
    console.error('  2. Database credentials in .env file are correct');
    console.error('  3. MySQL user has necessary permissions');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();
