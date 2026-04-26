// run `node backend/test-db.js` to test if MariaDB database connects
import db from './db.js';

async function test() {
  try {
    const [rows] = await db.execute('SELECT 1');
    console.log('Database connected successfully!');
    process.exit();
  } catch (err) {
    console.error('Connection failed:', err.message);
    process.exit(1);
  }
}

test();