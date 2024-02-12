import mysql from 'mysql';

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'authcrudtest'
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