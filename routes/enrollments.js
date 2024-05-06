const express = require('express');
const db = require('../db.config');

const enrollements = express();


enrollements.get('/', (req, res) => {
    db.query('SELECT enrollment_id, student_id, class_id, enrollement_date, enrollement_year FROM enrollements', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err.message });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No enrollements found', data: rows });
        } else {
            res.json({status: 200, message: 'enrollements fetched successfully', data: rows});
        }
    });
});

enrollements.get('/:id', (req, res) => {
    const enrollment_id = req.params.id;
    if(!enrollment_id) {
        return res.status(400).json({ status: 400, message: "enrollment_id is required" });
    }

    db.query('SELECT enrollment_id, student_id, class_id, enrollement_date, enrollement_year FROM enrollements WHERE enrollment_id =?', [ enrollment_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err.message });
        if(rows.length === 0) {
            return res.status(400).json({ status: 400, message: "enrollement not found" });
        } else {
            retres.json({status: 400, message: 'enrollement fetched successfully', data: rows });
        }
    });
})

enrollements.post('/add-enrollement', (req, res) => {
    const { student_id, class_id, enrollement_date, enrollement_year } = req.body;
    if(!student_id) return res.status(400).json({ status: 400, message: 'Missing required student_id' });
    if(!class_id) return res.status(400).json({ status: 400, message: 'Missing required class_id' });
    if(!enrollement_date) return res.status(400).json({ status: 400, message: 'Missing required enrollement_date' });
    if(!enrollement_year) return res.status(400).json({ status: 400, message: 'Missing required enrollement_year' });

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('INSERT INTO enrollements (student_id, class_id, enrollement_date, enrollement_year, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)', [ student_id, class_id, enrollement_date, enrollement_year, createdAt, updatedAt ], (err, result) => {
            if(err) return res.status(400).json({ status: 400, error: err.message });
            if(result.affectedRows === 1) {
                return res.status(200).json({ status: 200, message: 'enrollement made successfully' });
            } else {
                return res.status(400).json({ status: 400, message: 'enrollement not made' });
            }
        })
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

enrollements.put('/update-enrollement/:id', (req, res) => {
    const enrollment_id = req.params.id;
    if (!enrollment_id) return res.status(400).json({ status: 400, error: "Missing required enrollment_id" });

    const { student_id, class_id, enrollement_date, enrollement_year } = req.body;
    if(!student_id) return res.status(400).json({ status: 400, message: 'Missing required student_id' });
    if(!class_id) return res.status(400).json({ status: 400, message: 'Missing required class_id' });
    if(!enrollement_date) return res.status(400).json({ status: 400, message: 'Missing required enrollement_date' });
    if(!enrollement_year) return res.status(400).json({ status: 400, message: 'Missing required enrollement_year' });

    const date = new Date();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    db.query('UPDATE enrollements SET student_id =?, class_id =?, teacher_id =?, date_taken =?, enrollement_status =?, updatedAt =? WHERE enrollment_id =?', [ student_id, class_id, enrollement_date, enrollement_year, updatedAt, enrollment_id ], (err, results) =>{
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'enrollement updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'enrollement not found' });
        }
    });
});

enrollements.delete('/delete-enrollement/:id', (req, res) => {
    const enrollment_id = req.params.id;
    if (!enrollment_id) return res.status(400).json({ status: 400, error: "Missing required enrollment_id" });
    
    db.query('DELETE FROM enrollements WHERE enrollment_id =?', [ enrollment_id ], (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'enrollement deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'enrollement not found' });
        }
    });
});

enrollements.delete('/delete-all-enrollements', (req, res) => {
    db.query('DELETE FROM enrollements', (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'enrollements deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'enrollements not found' });
        }
    });
});

module.exports = enrollements;