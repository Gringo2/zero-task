
import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Client } = pg;

async function createDatabase() {
    // Connect to default postgres database first
    const client = new Client({
        user: 'postgres',
        password: 'P@ssw0rd',
        host: 'localhost',
        port: 5432,
        database: 'postgres'
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL');

        // Check if database exists
        const res = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'zero_task'"
        );

        if (res.rows.length === 0) {
            await client.query('CREATE DATABASE zero_task');
            console.log('✅ Database "zero_task" created successfully');
        } else {
            console.log('ℹ️  Database "zero_task" already exists');
        }
    } catch (error) {
        console.error('Error creating database:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

createDatabase();
