import mysql from 'mysql2';
import { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } from './config.js';

const db = mysql.createPool({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
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