import db from './db.js';

export const testDatabaseConnection = async () => {
    const [rows] = await db.execute("SELECT 1");
    return rows;
}