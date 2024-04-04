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
                    console.error('Conexión a la base de datos fallida', error);
                    reject(error);
                } else {
                    console.log('Conexión a la base de datos exitosa');
                    resolve(connection);
                }
            });
        } catch (error) {
            console.error('No se ha podido conectar a la base de datos', error);
            reject(error);
        }
    });
};

export default db;