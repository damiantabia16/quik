import mysql from 'mysql2';
import { config } from 'dotenv';

config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

export const connection = () => {
    return new Promise((resolve, reject) => {
        try {
            db.getConnection((error, connection) => {
                if (error) {
                    console.error('Database connection error', error);
                    reject(error);
                } else {
                    console.log('Database connection successful');
                    resolve(connection);
                }
            });
        } catch (error) {
            console.error('Error connecting to database', error);
            reject(error);
        }
    });
};

export default db;