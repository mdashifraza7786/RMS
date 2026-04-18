const { dbConnect } = require('./src/database/connection');
async function run() {
    const conn = await dbConnect();
    try {
        const [rows] = await conn.query('DESCRIBE orders');
        console.log(JSON.stringify(rows, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await conn.release();
        process.exit();
    }
}
run();
