const express = require('express');
const db = require('../db.config');

const classes = express();


classes.get('/', (req, res) => {
    db.query('SELECT class_id, class_name, class_schedule, capacity FROM classes', (err, rows) => {
        if(err) throw err;
        res.json({status: 200, data: rows});
    });
})

classes.get('/:id', (req, res) => {
    const class_id = req.params.id;
    db.query('SELECT class_id, class_name, class_schedule, capacity FROM classes WHERE class_id', [ class_id ], (err, rows) => {
        if(err) throw err;
        res.json({status: 200, data: rows});
    });
})

classes.post('/add-class', (req, res) => {
    const { class_name, class_schedule, capacity } = req.body;

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('INSERT INTO classes (class_name, class_schedule, capacity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)', [ class_name, class_schedule, capacity, createdAt, updatedAt ], (err, result) => {
            if(err) return res.status(400).json({ status: 400, message: err });
            if(result.affectedRows === 1) {
                return res.status(200).json({ status: 200, message: 'class created successfully' });
            } else {
                return res.status(400).json({ status: 400, message: '' });
            }
        })
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = classes;