const express = require('express');
const db = require('../db.config');
const dotenv = require('dotenv');
const email_path = require('../email.config');

const custom_functions = require('../customfunctions');

dotenv.config();

const teachers = express();


teachers.get('/', (req, res) => {
    db.query('SELECT teacher_id, name, email, contact_info, gender, class_id, subjects_taught, department, joining_date, profile_pic FROM teachers', (err, rows) => {
        if(err) throw err;
        if(rows.length == 0) res.status(200).json({status: 200, message: 'No teachers found', data: rows});
        if(rows.length > 0) res.status(200).json({status: 200, message: 'teachers fetched successfully', data: rows});
    });
});

teachers.get('/get-teacher-by-token', (req, res) => {
    const { token } = req.body;

    if(!token) {
        return res.status(400).json({success: 400, message: "token is required"})
    }

    db.query('SELECT teacher_id, name, contact_info, gender, class_id, subjects_taught, department, joining_date, profile_pic FROM teachers WHERE teacher_token =?', [ token ], (err, rows) => {
        if(err) throw err;
        if(rows.length == 0) {
            return res.status(400).json({ status: 400, message: "teacher not found" });
        } else {
            res.json({status: 200, message: 'teacher fetched successfully', data: rows});
        }
    });
});

teachers.get('/:id', (req, res) => {
    const teacher_id = req.params.id;
    db.query('SELECT teacher_id, name, contact_info, gender, class_id, subjects_taught, department, joining_date, profile_pic FROM teachers WHERE teacher_id =?', [ teacher_id ], (err, rows) => {
        if(err) throw err;
        res.json({status: 200, message: 'teacher fetched successfully', data: rows});
    });
});

teachers.post('/add-teacher', (req, res) => {
    const { name, email, contact_info, gender, subjects_taught, department, joining_date, class_id, password } = req.body;

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();


    const token = Math.floor(Math.random() * 100000);
    const account_token = Math.floor(Math.random() * 10000000000);

    const encrypt_password = custom_functions.generateEncryptedPassword(password);

    var mailOptions = {
        from: process.env.school_email,
        to: email,
        subject: 'Token verification',
        text: 'You have successfully registered with us please use this token to confirm your account: ' + token
    };

    db.query('SELECT * FROM users WHERE email = ?', [ email ], (err, rows) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(rows.length == 0){
            try {
                db.query('INSERT INTO teachers (name, email, teacher_token, contact_info, gender, class_id, subjects_taught, department, joining_date, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ name, email, account_token, contact_info, gender, class_id, subjects_taught, department, joining_date, createdAt, updatedAt ], (err, result) => {
                    if(err) return res.status(400).json({ status: 400, message: err });
                    if(result.affectedRows === 1) {
                        try {
                            db.query('insert into users (name, email, password, token, account_token, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?, ?)', [name, email, encrypt_password, token, account_token, createdAt, updatedAt], (err, result) => {
                                if (err) {
                                    return res.status(500).json({ error: 'Internal server error' });
                                }
                                res.status(200).json({ status: 200, message: 'teacher created successfully' });
                                email_path.sendMail(mailOptions, (error, info) => {
                                    if(error) throw error;
                                })
                            });
                        } catch (err) {
                            return res.status(500).json({ error: 'Internal server error' });
                        }
                    } else {
                        return res.status(400).json({ status: 400, message: '' });
                    }
                })
            } catch (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        } else {
            return res.status(400).json({ status: 400, message: 'Teacher with this email already exists' });
        }
    })
});

teachers.put('/update-teacher/:id', (req, res) => {
    const { teacher_id } = req.params.id;
    const { name, email, contact_info, gender, class_id, subjects_taught, department, joining_date, profile_pic, token } = req.body;
    
    if(!name) return res.status(400).json({ status: 400, message: "Missing required name" })
    if(!email) return res.status(400).json({ status: 400, message: "Missing required email" })
    if(!contact_info) return res.status(400).json({ status: 400, message: "Missing required contact_info" })
    if(!gender) return res.status(400).json({ status: 400, message: "Missing required gender" })
    if(!subjects_taught) return res.status(400).json({ status: 400, message: "Missing required subjects_taught" })
    if(!department) return res.status(400).json({ status: 400, message: "Missing required department" })
    if(!joining_date) return res.status(400).json({ status: 400, message: "Missing required joining_date" })
    if(!profile_pic) return res.status(400).json({ status: 400, message: "Missing required profile_pic" })
    if(!token) return res.status(400).json({ status: 400, message: "Missing required token" })
    if(!class_id) return res.status(400).json({ status: 400, message: "Missing required class_id" })
    
    // const required_values = [ name, email, contact_info, gender, subjects_taught, department, joining_date, profile_pic, teacher_token ];
    // const result_value = '';
    // required_values.forEach((value) => {
    //     if(!value) {
    //         result_value += value;
    //     }
    // })

    // console.log(result_value);

    db.query('UPDATE teachers SET name =?, email =?, contact_info =?, gender =?, class_id =?, subjects_taught =?, department =?, joining_date =? WHERE teacher_token =?', [ name, email, contact_info, gender, class_id, subjects_taught, department, joining_date, token ], (err, row) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(row.affectedRows == 1) {
            try {
                db.query('UPDATE users SET name=?, email=? WHERE account_token =?', [name, email, token], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    if(result.affectedRows == 1) {
                        res.status(200).json({ status: 200, message: 'teacher updated successfully' });
                    }
                });
            } catch (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        } else {
            return res.status(400).json({ status: 400, message: 'teacher not found' });
        }
    });
});

teachers.delete('/delete-teacher', (req, res) => {
    const { token } = req.body;
    if(!token) return res.status(400).json({ status: 400, message: 'Token required not provided' });

    try {
        db.query('DELETE * FROM teacher WHERE teacher_token =?', [ token ], (err, rows) => {
            if(err) return res.status(400).json({ status:400, error: err });
            if(rows.affectedRows == 1) {
                db.query('DELETE * FROM users WHERE access_token =?', [ token ], (err, result) => {
                    if(err) return res.status(400).json({ status:400, error: err });
                    if(result.affectedRows === 1) {
                        return res.status(200).json({ status: 200, message: 'Teacher deleted successfully' })
                    }
                })
            }
        });
    } catch(err) {
        return res.status(500).json({ status: 500, message: 'Internal server error', error: err.message });
    }
});

module.exports = teachers;