import { pbkdf2Sync, randomBytes } from 'node:crypto';
import db from './db.js';

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = "sha256";

export const hashPassword = (password, salt) => {
    return pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
}

// find user by username
export const findUserByUsername = async (username) => {
    const [rows] = await db.execute(`SELECT * FROM account WHERE username = ?`, [username]);
    return rows[0];
}

export const insertAccount = async (username, password) => {
    try {
        const salt = randomBytes(16).toString('hex');
        const hash = hashPassword(password, salt);
        
        const sql = `
            INSERT INTO account (username, password_hash, salt, role, is_approved)
            VALUES (?, ?, ?, 'user', FALSE)
        `; 
        const [results] = await db.execute(sql, [username, hash, salt]);
        return results;
    } catch (err) {
        throw err;
    }
};