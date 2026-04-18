const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rms',
};

async function checkData() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log("Current Server Time (JS):", new Date().toLocaleString());
        const [sysDate] = await connection.query("SELECT NOW() as db_now, @@system_time_zone, @@time_zone");
        console.log("Database Time Info:", sysDate[0]);

        const [invoices] = await connection.query("SELECT id, orderid, total_amount, payment_status, generated_at FROM invoices ORDER BY generated_at DESC LIMIT 5");
        console.log("Latest Invoices (raw generated_at):");
        invoices.forEach(inv => {
            console.log(`ID: ${inv.id}, Order: ${inv.orderid}, Status: ${inv.payment_status}, Time: ${inv.generated_at}`);
        });

        // Test with UTC string
        const [utcQuery] = await connection.query(`
            SELECT 
                COUNT(*) as count, 
                SUM(total_amount) as total 
            FROM invoices 
            WHERE generated_at >= '2026-04-18 00:00:00' 
            AND generated_at <= '2026-04-18 23:59:59'
        `);
        console.log("Manual query for 2026-04-18 (April 18):", utcQuery[0]);

        const [todayQuery] = await connection.query(`
            SELECT 
                COUNT(*) as count, 
                SUM(total_amount) as total 
            FROM invoices 
            WHERE generated_at >= '2026-04-19 00:00:00' 
            AND generated_at <= '2026-04-19 23:59:59'
        `);
        console.log("Manual query for 2026-04-19 (April 19):", todayQuery[0]);

    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

checkData();
