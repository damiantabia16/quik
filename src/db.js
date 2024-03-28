import mysql from 'mysql';
import { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } from './config.js';

const db = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE
})

export const connection = async () => {
    try {
        db.connect();
        console.log('Database connection succesfull');
    } catch (error) {
        console.error('Database connection error', err);
    }
};

export default db;