// import postgresql
const { Pool } = require('pg');
// connect to database
const db = new Pool({
    user: 'postgres',
    host: '172.16.206.91',
    database: 'NE_Vehicle',
    password: '123456',
    port: '5432'
});

db.connect();
module.exports = db;