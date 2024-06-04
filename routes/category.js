const express = require('express');
const db = require('../db.config');

const categories = express();

categories.get('/', (req, res) => {
    db.query('SELECT cat_id, cat_name, cat_photo FROM categories', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No categories found', data: rows });
        } else {
            res.json({status: 200, message: 'categories fetched successfully', data: rows});
        }
    });
});

categories.get('/:id', (req, res) => {
    const cat_id = req.params.id;
    if(!cat_id) {
        return res.status(400).json({ status: 400, message: "cat_id is required" });
    }

    db.query('SELECT cat_id, cat_name, cat_photo FROM categories WHERE cat_id =?', [ cat_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(200).json({ status: 200, message: "category not found" });
        } else {
            res.json({status: 200, message: 'category fetched successfully', data: rows });
        }
    });
});

module.exports = categories;