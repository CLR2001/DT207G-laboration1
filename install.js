import pgImport from 'pg';
const { Client } = pgImport;
import 'dotenv/config';

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  ssl: {
    rejectUnauthorized: false,
  },
})

connectToDatabase();

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');
    createTables();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Connection error: ' + error.message);
    }
  }
}

async function createTables() {
  try {
    const res = await client.query(`
      DROP TABLE IF EXISTS courses;
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        coursecode TEXT NOT NULL,
        coursename TEXT NOT NULL,
        syllabus TEXT NOT NULL,
        progression CHAR(1) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } 
  catch (error) {
    console.error(error);
  }
  finally {
    
  }
}