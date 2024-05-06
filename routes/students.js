const express = require('express');
const db = require('../db.config');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const students = express();

const fileNameSingle  = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage: fileNameSingle})

students.get('/', (req, res) => {
    db.query('SELECT student_id, name, dob, student_age, gender, contact_info, guardian_info, house, home_status, profile_pic FROM students', (err, results) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(results.length == 0) res.status(200).json({status: 'OK', message: 'No students found', data: results});
        if(results.length > 0) res.status(200).json({status: 'OK', message: 'students found fetched successfully', data: results});
    })
})

students.get('/:id', (req, res) => {
    const { student_id } = req.params.id;

    if(!student_id) {
        return res.status(400).json({success: 400, message: "student_id is required"})
    }

    db.query(`SELECT student_id, name, dob, student_age, gender, contact_info, guardian_info, house, home_status, profile_pic FROM students WHERE student_id = ${student_id}`, (err, results) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(results.length == 0) res.status(200).json({success: 200, message: "Student not found"})
        if(results.length > 0) res.status(200).json({success: 200, message: "Student fetched successfully", data: results})
    });
})

students.post('/add-student', (req, res) => {
    const { name, dob, student_age, gender, contact_info, guardian_info, house, home_status, profile_pic } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing required name' });
    if (!dob) return res.status(400).json({ error: 'Missing required dob' });
    if (!student_age) return res.status(400).json({ error: 'Missing required student_age' });
    if (!gender) return res.status(400).json({ error: 'Missing required gender' });
    if (!contact_info) return res.status(400).json({ error: 'Missing required contact_info' });
    if (!guardian_info) return res.status(400).json({ error: 'Missing required guardian_info' });
    if (!house) return res.status(400).json({ error: 'Missing required house' });
    if (!home_status) return res.status(400).json({ error: 'Missing required home_status' });
    if (!profile_pic) return res.status(400).json({ error: 'Missing required profile_pic' });
    

    const date = new Date();
    const createdAt = `${date.getFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
    const updatedAt = `${date.getFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;

    
    try {
        db.query('insert into students (name, dob, student_age, gender, contact_info, guardian_info, house, home_status, profile_pic, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, dob, student_age, gender, contact_info, guardian_info, house, home_status, profile_pic, createdAt, updatedAt], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if(result.affectedRows === 1) res.status(200).json({ success: 200, message: 'Student added successfully' });
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

students.put('/update-student-image/:id', upload.single('profile_pic'), (req, res) => {
    const { profile_pic } = req.body;
    const { id } = req.params.id;

    if (!profile_pic) return res.status(400).json({ status: 400, error: 'Missing input profile_pic required' });

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    db.query('UPDATE students SET profile_pic = ? WHERE student_id = ?', [ imageUrl, id ], (err, result) => {
        if (err) return res.status(500).json({ status: 500, error: err.message });
        if (result.affectedRows === 1) {
            res.status(200).json({ status: 200, message: 'Student image changed successfully', data: { imageUrl } });
        } else {
            res.status(200).json({ status: 200, error: 'Failed to update student image' });
        }
    });
});

students.put('/update-student/:id', (req, res) => {
    const { id } = req.params.id;
    const { name, dob, student_age, gender, contact_info, guardian_info, house, home_status } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing required name' });
    if (!dob) return res.status(400).json({ error: 'Missing required dob' });
    if (!student_age) return res.status(400).json({ error: 'Missing required student_age' });
    if (!gender) return res.status(400).json({ error: 'Missing required gender' });
    if (!contact_info) return res.status(400).json({ error: 'Missing required contact_info' });
    if (!guardian_info) return res.status(400).json({ error: 'Missing required guardian_info' });
    if (!house) return res.status(400).json({ error: 'Missing required house' });
    if (!home_status) return res.status(400).json({ error: 'Missing required home_status' });

    db.query('UPDATE students SET name =?, dob =?, student_age =?, gender =?, contact_info =?, guardian_info =?, house =?, home_status =? WHERE student_id =?', [ name, dob, student_age, gender, contact_info, guardian_info, house, home_status, id ], (err, row) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(row.affectedRows == 1) {
            res.status(200).json({ status: 200, message: 'student updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'student not found' });
        }
    });
});

students.delete('/delete-student/:id', (req, res) => {
    const { student_id } = req.params.id;
    if(!student_id) return res.status(400).json({ status: 400, message: 'student_id required not provided' });

    try {
        db.query('DELETE * FROM students WHERE student_id =?', [ student_id ], (err, rows) => {
            if(err) return res.status(400).json({ status:400, error: err });
            if(rows.affectedRows == 1) {
                db.query('DELETE * FROM enrollements WHERE student_id =?', [ student_id ], (err, results) => {
                    if(err) return res.status(400).json({ status: 400, error: err.message });
                    if(results.affectedRows === 1) return res.status(200).json({ status: 200, message: 'Student deleted successfully' });
                    else return res.status(400).json({ status: 400, error: err });
                })
            }
        });
    } catch(err) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: err.message });
    }
});

students.put('/move-student/:id', (req, res) => {
    const { student_id } = req.params.id;
    const { class_id } = req.body;

    if(!student_id) return res.status(400).json({ status: 400, message: 'student_id required not provided' });
    if(!class_id) return res.status(400).json({ status: 400, message: 'class_id required not provided' });

    try {
        db.query('UPDATE students SET class_id =? WHERE student_id =?', [ class_id, student_id ], (err, rows) => {
            if(err) return res.status(400).json({ status:400, error: err });
            if(rows.affectedRows == 1) {
                return res.status(200).json({ status: 200, message: 'Student moved successfully' })
            }
        });
    } catch(err) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: err.message });
    }
});

module.exports = students;