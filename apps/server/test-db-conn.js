
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

async function test() {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL');
        const res = await client.query('SELECT current_database(), current_user');
        console.log('Info:', res.rows[0]);
        client.release();
    } catch (err) {
        console.error('Connection failed:', err.message);
    } finally {
        await pool.end();
    }
}

test();
