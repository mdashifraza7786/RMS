import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'rms',
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONN_LIMIT || 10),
    queueLimit: 0,
    connectTimeout: Number(process.env.DB_CONNECT_TIMEOUT || 5000),
} as const;

declare global {
    var mysqlPool: mysql.Pool | undefined;
}

const pool: mysql.Pool = global.mysqlPool || mysql.createPool(dbConfig);
if (!global.mysqlPool) {
    global.mysqlPool = pool;
}

export async function dbConnect() {
    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (error) {
        console.error('Error getting MySQL connection from pool:', error);
        throw error;
    }
}

export async function testConnection(): Promise<boolean> {
    try {
        const connection = await pool.getConnection();
        await connection.query('SELECT 1');
        connection.release();
        return true;
    } catch (error) {
        return false;
    }
}

export default dbConnect;
