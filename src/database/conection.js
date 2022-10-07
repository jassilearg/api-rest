const { Pool } = require('pg');

const pool = new Pool ({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE
});

const query = (text, param) => {
    return pool.query(text, param);
}

module.exports = {
    query
};