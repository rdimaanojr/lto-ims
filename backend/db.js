import mysql from 'mysql2';
import * as config from './config.js';

// connection pool
const pool = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DATABASE,
    waitForConnections: true,
    connectionLimit: 20
});

export default pool.promise();