const express = require('express');
const users = require('../models/users');
const db = require('../db.config');

const user = express();

user.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if(err) throw err;
        if(results.length == 0) res.json({status: 'OK', message: 'No users found', data: results});
        if(results.length > 0) res.json({status: 'OK', message: 'Users found fetched successfully', data: results});
    })
})

user.get('/:id', (req, res) => {
    db.query(`SELECT * FROM users WHERE userid = ${req.params.id}`, (err, response) => {
        if(err) throw err;
        if(response.length == 0) res.json({success: true, message: "User not found"})
        if(response.length > 0) res.json({success: true, message: "User fetched successfully"})
    });
})

user.post('/add-user', (req, res) => {
    const { name, email, password } = req.body;
    db.query('INSERT INTO users (name, email, password) values (?)', { name, email, password }, (err, response) => {
        if(err) throw err;
        if(response) res.json({success: true, message: "user added successfully"});
    });
})

module.exports = user;