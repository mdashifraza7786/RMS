const mysql = require('mysql2/promise');

async function migrate() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'rms'
    });

    try {
        await connection.query("ALTER TABLE `order_items` ADD COLUMN `status` VARCHAR(50) DEFAULT 'active'");
        console.log("Migration successful: Added 'status' column to order_items");
    } catch (e) {
        if (e.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Column already exists");
        } else {
            console.error(e);
        }
    } finally {
        await connection.end();
    }
}

migrate();
