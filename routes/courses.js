const express = require('express');
const db = require('../db.config');

const courses = express();


courses.get('/', (req, res) => {
    db.query('SELECT course_id, course_name, description, teacher_id, class_id, pass_mark FROM courses', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No subject found', data: rows });
        } else {
            res.json({status: 200, message: 'subjects fetched successfully', data: rows});
        }
    });
});

courses.get('/:id', (req, res) => {
    const subject_id = req.params.id;
    if(!class_id) {
        return res.status(400).json({ status: 400, message: "subject_id is required" });
    }

    db.query('SELECT course_id, course_name, description, teacher_id, class_id, pass_mark FROM courses WHERE course_id =?', [ class_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(200).json({ status: 200, message: "subject not found" });
        } else {
            res.json({status: 200, message: 'subjects fetched successfully', data: rows });
        }
    });
})

courses.post('/add-course', (req, res) => {
    const { class_name, syllabus, capacity } = req.body;
    if(!capacity) return res.status(400).json({ status: 400, message: 'Missing required capacity' });
    if(!class_name) return res.status(400).json({ status: 400, message: 'Missing required class_name' });
    if(!syllabus) return res.status(400).json({ status: 400, message: 'Missing required syllabus' });

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('SELECT * FROM course_id WHERE course_name =?', [ class_name ], (err, rows) => {
            if(err) return res.status(400).json({ status: 400, message: err });
            if(rows.length > 0) {
                return res.status(400).json({ status: 400, message: 'class_name already exists' });
            } else {
                db.query('INSERT INTO classes (course_name, description, teacher_id, class_id, pass_mark, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)', [ course_name, description, teacher_id, class_id, pass_mark, createdAt, updatedAt ], (err, result) => {
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
        return res.status(500).json({ error: 'Internal server error' });
    }
})

courses.put('/update-course/:id', (req, res) => {
    const course_id = req.params.id;
    if (!course_id) return res.status(400).json({ status: 400, error: "Missing required course_id" });

    const { course_name, description, teacher_id, class_id, pass_mark } = req.body;
    if(!capacity) return res.status(400).json({ status: 400, message: 'Missing required capacity' });
    if(!class_name) return res.status(400).json({ status: 400, message: 'Missing required class_name' });
    if(!syllabus) return res.status(400).json({ status: 400, message: 'Missing required syllabus' });

    const date = new Date();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    db.query('UPDATE course_id SET course_name =?, description =?, teacher_id =?, class_id =?, pass_mark =?, updatedAt =? WHERE course_id =?', [ course_name, description, teacher_id, class_id, pass_mark, updatedAt, course_id ], (err, results) =>{
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'class updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'class not found' });
        }
    });
});

courses.delete('/delete-course/:id', (req, res) => {
    const course_id = req.params.id;
    if (!course_id) return res.status(400).json({ status: 400, error: "Missing required course_id" });
    
    db.query('DELETE FROM courses WHERE course_id =?', [ course_id ], (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'course deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'course not found' });
        }
    });
});

courses.delete('/delete-all-courses', (req, res) => {
    db.query('DELETE FROM courses', (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'courses deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'No courses found' });
        }
    });
});

module.exports = classes;