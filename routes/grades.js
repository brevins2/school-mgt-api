const express = require('express');
const db = require('../db.config');

const grades = express();


grades.get('/', (req, res) => {
    db.query('SELECT result_id, exam_name, student_id, course_id, marks, exam_date, remarks, teacher_id FROM grades', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No grades found', data: rows });
        } else {
            res.json({status: 200, message: 'grades fetched successfully', data: rows});
        }
    });
});

grades.get('/:id', (req, res) => {
    const result_id = req.params.id;
    if(!result_id) {
        return res.status(400).json({ status: 400, message: "result_id is required" });
    }

    db.query('SELECT result_id, exam_name, student_id, course_id, marks, exam_date, remarks, teacher_id FROM grades WHERE result_id =?', [ result_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(400).json({ status: 400, message: "grade not found" });
        } else {
            retres.json({status: 400, message: 'grade fetched successfully', data: rows });
        }
    });
})

grades.post('/add-grade', (req, res) => {
    const { exam_name, student_id, course_id, marks, exam_date, remarks, teacher_id } = req.body;
    if(!exam_name) return res.status(400).json({ status: 400, message: 'Missing required exam_name' });
    if(!student_id) return res.status(400).json({ status: 400, message: 'Missing required student_id' });
    if(!course_id) return res.status(400).json({ status: 400, message: 'Missing required course_id' });
    if(!marks) return res.status(400).json({ status: 400, message: 'Missing required marks' });
    if(!exam_date) return res.status(400).json({ status: 400, message: 'Missing required exam_date' });
    if(!remarks) return res.status(400).json({ status: 400, message: 'Missing required remarks' });
    if(!teacher_id) return res.status(400).json({ status: 400, message: 'Missing required teacher_id' });

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('INSERT INTO grades (exam_name, student_id, course_id, marks, exam_date, remarks, teacher_id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [ exam_name, student_id, course_id, marks, exam_date, remarks, teacher_id, createdAt, updatedAt ], (err, result) => {
            if(err) return res.status(400).json({ status: 400, error: err.message });
            if(result.affectedRows === 1) {
                return res.status(200).json({ status: 200, message: 'grade created successfully' });
            } else {
                return res.status(400).json({ status: 400, message: 'grade not created' });
            }
        })
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

grades.put('/update-grade/:id', (req, res) => {
    const result_id = req.params.id;
    if (!result_id) return res.status(400).json({ status: 400, error: "Missing required result_id" });

    const { exam_name, student_id, course_id, marks, exam_date, remarks, teacher_id } = req.body;
    if(!exam_name) return res.status(400).json({ status: 400, message: 'Missing required exam_name' });
    if(!student_id) return res.status(400).json({ status: 400, message: 'Missing required student_id' });
    if(!course_id) return res.status(400).json({ status: 400, message: 'Missing required course_id' });
    if(!marks) return res.status(400).json({ status: 400, message: 'Missing required marks' });
    if(!exam_date) return res.status(400).json({ status: 400, message: 'Missing required exam_date' });
    if(!remarks) return res.status(400).json({ status: 400, message: 'Missing required remarks' });
    if(!teacher_id) return res.status(400).json({ status: 400, message: 'Missing required teacher_id' });

    db.query('UPDATE grades SET exam_name =?, student_id =?, course_id =?, marks =?, exam_date =?, remarks =?, teacher_id =? WHERE result_id =?', [ exam_name, student_id, course_id, marks, exam_date, remarks, teacher_id, result_id ], (err, results) =>{
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'grade updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'grade not found' });
        }
    });
});

grades.delete('/delete-grade/:id', (req, res) => {
    const result_id = req.params.id;
    if (!result_id) return res.status(400).json({ status: 400, error: "Missing required result_id" });
    
    db.query('DELETE FROM grades WHERE result_id =?', [ result_id ], (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'grade deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'grade not found' });
        }
    });
});

grades.delete('/delete-all-grades', (req, res) => {
    db.query('DELETE FROM grades', (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'grades deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'grades not found' });
        }
    });
});

module.exports = grades;