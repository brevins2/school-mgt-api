const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});


db.getConnection((err, conn) => {
    if(err) {
        console.log('Could not connect to the database with error: ' + err.message);
    }
})


module.exports = db;