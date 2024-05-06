const express = require('express');
const db = require('../db.config');

const classes = express();


classes.get('/', (req, res) => {
    db.query('SELECT class_id, class_name, syllabus, capacity FROM classes', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No classes found', data: rows });
        } else {
            res.json({status: 200, message: 'classes fetched successfully', data: rows});
        }
    });
});

classes.get('/:id', (req, res) => {
    const class_id = req.params.id;
    if(!class_id) {
        return res.status(400).json({ status: 400, message: "class_id is required" });
    }

    db.query('SELECT class_id, class_name, syllabus, capacity FROM classes WHERE class_id =?', [ class_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(200).json({ status: 200, message: "class not found" });
        } else {
            res.json({status: 200, message: 'class fetched successfully', data: rows });
        }
    });
})

classes.post('/add-class', (req, res) => {
    const { class_name, syllabus, capacity } = req.body;
    if(!capacity) return res.status(400).json({ status: 400, message: 'Missing required capacity' });
    if(!class_name) return res.status(400).json({ status: 400, message: 'Missing required class_name' });
    if(!syllabus) return res.status(400).json({ status: 400, message: 'Missing required syllabus' });

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('SELECT * FROM classes WHERE class_name =?', [ class_name ], (err, rows) => {
            if(err) return res.status(400).json({ status: 400, message: err });
            if(rows.length > 0) {
                return res.status(400).json({ status: 400, message: 'class_name already exists' });
            } else {
                db.query('INSERT INTO classes (class_name, syllabus, capacity, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)', [ class_name, syllabus, capacity, createdAt, updatedAt ], (err, result) => {
                    if(err) return res.status(400).json({ status: 400, message: err });
                    if(result.affectedRows === 1) {
                        return res.status(200).json({ status: 200, message: 'class created successfully' });
                    } else {
                        return res.status(400).json({ status: 400, message: '' });
                    }
                })
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error', error: err.message });
    }
})

classes.put('/update-class/:id', (req, res) => {
    const class_id = req.params.id;
    if (!class_id) return res.status(400).json({ status: 400, error: "Missing required class_id" });

    const { class_name, syllabus, capacity } = req.body;
    if(!capacity) return res.status(400).json({ status: 400, message: 'Missing required capacity' });
    if(!class_name) return res.status(400).json({ status: 400, message: 'Missing required class_name' });
    if(!syllabus) return res.status(400).json({ status: 400, message: 'Missing required syllabus' });

    db.query('UPDATE classes SET class_name =?, syllabus =?, capacity = ? WHERE class_id =?', [ class_name, syllabus, capacity, class_id ], (err, results) =>{
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'class updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'class not found' });
        }
    });
});

classes.delete('/delete-class/:id', (req, res) => {
    const class_id = req.params.id;
    if (!class_id) return res.status(400).json({ status: 400, error: "Missing required class_id" });
    
    db.query('DELETE FROM classes WHERE class_id =?', [ class_id ], (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'class deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'class not found' });
        }
    });
});

classes.delete('/delete-all-classes', (req, res) => {
    db.query('DELETE FROM classes', (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'classes deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'classes not found' });
        }
    });
});

module.exports = classes;