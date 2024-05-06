const express = require('express');
const db = require('../db.config');

const attendences = express();


attendences.get('/', (req, res) => {
    db.query('SELECT attendence_id, student_id, class_id, teacher_id, date_taken, attendence_status FROM attendences', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err.message });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No attendences found', data: rows });
        } else {
            res.json({status: 200, message: 'attendences fetched successfully', data: rows});
        }
    });
});

attendences.get('/:id', (req, res) => {
    const attendence_id = req.params.id;
    if(!attendence_id) {
        return res.status(400).json({ status: 400, message: "attendence_id is required" });
    }

    db.query('SELECT attendence_id, student_id, class_id, teacher_id, date_taken, attendence_status FROM attendences WHERE attendence_id =?', [ attendence_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err.message });
        if(rows.length === 0) {
            return res.status(400).json({ status: 400, message: "attendence not found" });
        } else {
            retres.json({status: 400, message: 'attendence fetched successfully', data: rows });
        }
    });
})

attendences.post('/add-attendence', (req, res) => {
    const { student_id, class_id, teacher_id, date_taken, attendence_status } = req.body;
    if(!student_id) return res.status(400).json({ status: 400, message: 'Missing required student_id' });
    if(!class_id) return res.status(400).json({ status: 400, message: 'Missing required class_id' });
    if(!date_taken) return res.status(400).json({ status: 400, message: 'Missing required date_taken' });
    if(!attendence_status) return res.status(400).json({ status: 400, message: 'Missing required attendence_status' });
    if(!teacher_id) return res.status(400).json({ status: 400, message: 'Missing required teacher_id' });

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('INSERT INTO attendences (student_id, class_id, teacher_id, date_taken, attendence_status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)', [ student_id, class_id, teacher_id, date_taken, attendence_status, createdAt, updatedAt ], (err, result) => {
            if(err) return res.status(400).json({ status: 400, error: err.message });
            if(result.affectedRows === 1) {
                return res.status(200).json({ status: 200, message: 'attendence made successfully' });
            } else {
                return res.status(400).json({ status: 400, message: 'attendence not made' });
            }
        })
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

attendences.put('/update-attendence/:id', (req, res) => {
    const attendence_id = req.params.id;
    if (!attendence_id) return res.status(400).json({ status: 400, error: "Missing required attendence_id" });

    const { student_id, class_id, teacher_id, date_taken, attendence_status } = req.body;
    if(!student_id) return res.status(400).json({ status: 400, message: 'Missing required student_id' });
    if(!class_id) return res.status(400).json({ status: 400, message: 'Missing required class_id' });
    if(!teacher_id) return res.status(400).json({ status: 400, message: 'Missing required teacher_id' });
    if(!date_taken) return res.status(400).json({ status: 400, message: 'Missing required date_taken' });
    if(!attendence_status) return res.status(400).json({ status: 400, message: 'Missing required attendence_status' });

    const date = new Date();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    db.query('UPDATE attendences SET student_id =?, class_id =?, teacher_id =?, date_taken =?, attendence_status =?, updatedAt =? WHERE attendence_id =?', [ student_id, class_id, teacher_id, date_taken, attendence_status, updatedAt, attendence_id ], (err, results) =>{
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'attendence updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'attendence not found' });
        }
    });
});

attendences.delete('/delete-attendence/:id', (req, res) => {
    const attendence_id = req.params.id;
    if (!attendence_id) return res.status(400).json({ status: 400, error: "Missing required attendence_id" });
    
    db.query('DELETE FROM attendences WHERE attendence_id =?', [ attendence_id ], (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'attendence deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'attendence not found' });
        }
    });
});

attendences.delete('/delete-all-attendences', (req, res) => {
    db.query('DELETE FROM attendences', (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'attendences deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'attendences not found' });
        }
    });
});

module.exports = attendences;