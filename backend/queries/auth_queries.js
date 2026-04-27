import { pbkdf2Sync, randomBytes } from 'node:crypto';
import db from '../db.js';

const ITERATIONS = 100000;
const KEY_LEN = 64;
const DIGEST = "sha256";

export const hashPassword = (password, salt) => {
    return pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex');
}

// find user by username
export const findUserByUsername = async (username) => {
    const sql = `
        SELECT id, username, password_hash, salt, role, is_approved
        FROM account WHERE username = ?
    `;
    const [rows] = await db.execute(sql, [username]);
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

export const getPendingAccounts = async () => {
    const sql = `SELECT id, username, role FROM accounts WHERE is_approved = FALSE`;
    const [rows] = await db.execute(sql);
    return rows;
}

export const approveAccount = async (id) => {
    const sql = `UPDATE accounts SET is_approved = TRUE WHERE id = ?`;
    await db.execute(sql, [id]);
};

export const rejectAccount = async (id) => {
    const sql = `DELETE FROM account WHERE id = ?`;
    await db.execute(sql, [id]);
}