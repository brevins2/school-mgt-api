const express = require('express');
const db = require('../db.config');

const  packages = express();

 packages.get('/', (req, res) => {
    db.query('SELECT package_id, package_name FROM  packages', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No packages found', data: rows });
        } else {
            res.json({status: 200, message: 'packages fetched successfully', data: rows});
        }
    });
});

 packages.get('/:id', (req, res) => {
    const package_id = req.params.id;
    if(!package_id) {
        return res.status(400).json({ status: 400, message: "package_id is required" });
    }

    db.query('SELECT package_id, package_name FROM  packages WHERE package_id =?', [ package_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(400).json({ status: 400, message: "category not found" });
        } else {
            res.json({status: 200, message: 'category fetched successfully', data: rows[0] });
        }
    });
});

module.exports =  packages;