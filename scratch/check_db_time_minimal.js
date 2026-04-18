const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rms',
};

async function checkData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query("SELECT NOW() as db_now, @@session.time_zone as sess_tz, @@global.time_zone as glob_tz");
        console.log("DB Time Info:", rows[0]);

        const [latest] = await connection.query("SELECT generated_at FROM invoices ORDER BY generated_at DESC LIMIT 1");
        if (latest.length > 0) {
            console.log("Latest Invoice Time (Raw):", latest[0].generated_at);
            console.log("Latest Invoice Time (JS string):", new Date(latest[0].generated_at).toString());
        }
        
    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

checkData();
