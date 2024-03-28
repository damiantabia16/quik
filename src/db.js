import mysql from 'mysql2';
import { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } from './config.js';
import { config } from 'dotenv';

config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})


export const connection = () => {
    return new Promise((resolve, reject) => {
        db.getConnection((error, connection) => {
            if (error) {
                console.error('Database connection error', error);
                reject(error);
            } else {
                console.log('Database connection successful');
                resolve(connection);
            }
        });
    });
};

export default db;