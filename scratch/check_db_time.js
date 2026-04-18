const { dbConnect } = require('./src/database/index');

async function checkData() {
    const connection = await dbConnect();
    try {
        console.log("Current Server Time (JS):", new Date().toLocaleString());
        const [sysDate]: any = await connection.query("SELECT NOW() as db_now, @@system_time_zone, @@time_zone");
        console.log("Database Time Info:", sysDate[0]);

        const [invoices]: any = await connection.query("SELECT id, orderid, total_amount, payment_status, generated_at FROM invoices ORDER BY generated_at DESC LIMIT 5");
        console.log("Latest Invoices:", invoices);

        const [overviewQuery]: any = await connection.query(`
            SELECT 
                COUNT(*) as count, 
                SUM(total_amount) as total 
            FROM invoices 
            WHERE generated_at >= '2026-04-19 00:00:00' 
            AND generated_at <= '2026-04-19 23:59:59'
        `);
        console.log("Manual query for 2026-04-19:", overviewQuery[0]);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit();
    }
}

checkData();
