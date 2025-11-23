const sql = require('mssql');

const dbConfig = {
    server: 'localhost\\SQLEXPRESS', // or 'localhost'
    database: 'BusTrackDB',
    driver: 'msnodesqlv8',           // Windows Auth driver
    options: {
        trustedConnection: true
    }
};

async function testConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        console.log('✅ Connected to SQL Server via Windows Authentication!');
        await pool.close(); // close connection after test
    } catch (err) {
        console.error('❌ Connection failed:', err);
    }
}

testConnection();
