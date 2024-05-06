const express = require('express');
const db = require('../db.config');
const email_path = require('../email.config');
const crypto = require('crypto');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const user = express();

const fileNameSingle  = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage: fileNameSingle})

user.get('/', (req, res) => {
    db.query('SELECT userid, name, email, account_token, status, avatar FROM users', (err, results) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(results.length == 0) res.status(200).json({status: 'OK', message: 'No users found', data: results});
        if(results.length > 0) res.status(200).json({status: 'OK', message: 'Users found fetched successfully', data: results});
    })
})

user.get('/get-user-by-token', (req, res) => {
    const { token } = req.body;

    if(!token) {
        return res.status(400).json({success: 400, message: "token is required"})
    }

    db.query(`SELECT userid, name, email, token, status, avatar FROM users WHERE account_token = ${token}`, (err, response) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(response.length == 0) res.status(200).json({success: 200, message: "User not found"})
        if(response.length > 0) res.status(200).json({success: 200, message: "User fetched successfully"})
    });
})

user.get('/:id', (req, res) => {
    const { user_id } = req.params.id;

    if(!user_id) {
        return res.status(400).json({success: 400, message: "user_id is required"})
    }

    db.query(`SELECT userid, name, email, account_token, status, avatar FROM users WHERE user_id = ${user_id}`, (err, results) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(results.length == 0) res.status(200).json({success: 200, message: "User not found"})
        if(results.length > 0) res.status(200).json({success: 200, message: "User fetched successfully", data: results})
    });
})

user.post('/add-user', (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Missing required name' });
    }
    if(!req.body.email) {
        return res.status(400).json({ error: 'Missing required email' });
    }
    if(!req.body.password){
        return res.status(400).json({ error: 'Missing required password' });
    }

    const token = Math.floor(Math.random() * 100000);
    const account_token = Math.floor(Math.random() * 10000000000);

    const { name, email, password } = req.body;
    const date = new Date();
    const createdAt = `${date.getFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;
    const updatedAt = `${date.getFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}`;

    var mailOptions = {
        from: process.env.school_email,
        to: email,
        subject: 'Token verification',
        text: 'You have successfully registered with us please use this token to confirm your account: ' + token
    };

    const encrypt_password = generateEncryptedPassword(password);

    db.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(result.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        } else {
            try {
                db.query('insert into users (name, email, password, token, account_token, createdAt, updatedAt) values(?, ?, ?, ?, ?, ?, ?)', [name, email, encrypt_password, token, account_token, createdAt, updatedAt], (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                    res.status(200).json({ success: 200, message: 'User added successfully' });
                    email_path.sendMail(mailOptions, (error, info) => {
                        if(error) throw error;
                    })
                });
            } catch (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    });
});

user.post('/login', (req, res) => {
    const { email, password } = req.body;

    if(!email) return res.status(400).json({ error: 'Missing input email required' });
    if(!password) return res.status(400).json({ error: 'Missing input password required' });
    
    const encrypt_password = generateEncryptedPassword(password);

    db.query('SELECT userid, name, email, account_token, status, avatar FROM users WHERE email =? and password =?', [ email, encrypt_password ], (err, result) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(result.length == 0) return res.status(200).json({ status: 200, error: 'No user found' });
        if(result.length > 0) {
            if(result[0].status == 'Verified') {
                res.status(200).json({ status: 200, message: 'User fetched successfully', data: result });
            } else {
                res.status(400).json({ status: 400, message: 'Account not veirfied. Verify account to login', data: result });
            }
        }
    })
})

user.post('/resend-token', (req, res) => {
    const { email } = req.body;

    if(!email) return res.status(400).json({ error: 'Missing input email required' });

    db.query('SELECT * FROM users WHERE email =?', email, (err, result) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(result.length == 0) return res.status(400).json({ status: 400, error: 'No user found' });
        if(result.length > 0) {
            const token = Math.floor(Math.random() * 100000);
            db.query('UPDATE users SET token =? WHERE email =?', [token, email], (err, result) => {
                if(err) return res.status(200).json({ status: 200, error: err });
                if(result.affectedRows == 1) {
                    var mailOptions = {
                        from: process.env.school_email,
                        to: email,
                        subject: 'Token verification',
                        text: 'Use this token to verify your account: ' + token
                    };
                    email_path.sendMail(mailOptions, (error, info) => {
                        if(error) throw error;
                    })
                    res.status(200).json({ status: 200, message: 'token sent to your email' });
                }
            })
        }
    })
})

user.post('/verify-account', (req, res) => {
    const { email, token } = req.body;

    if(!email) return res.status(400).json({ status: 400, error: 'Missing input email required' });
    if(!token) return res.status(400).json({ status: 400, error: 'Missing input token required' });

    db.query('SELECT * FROM users WHERE email =? and token =?', [email, token], (err, result) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(result.length == 0) return res.status(400).json({ status: 400, error: 'Invalid token' });
        if(result.length > 0) {
            db.query('UPDATE users SET status =? WHERE email =?', [ 'Verified', email ], (err, result) => {
                if(err) throw err;
                res.status(200).json({ status: 200, message: 'Account verified successfully' });
            })
        }
    });
})

user.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    if(!email) return res.status(400).json({ status: 400, error: 'Missing input email required' });

    db.query('SELECT * FROM users WHERE email =?', email, (err, result) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(result.length == 0) return res.status(400).json({ status: 400, error: 'No user found' });
        if(result.length > 0) {
            const token = Math.floor(Math.random() * 100000);
            db.query('UPDATE users SET token =? WHERE email =?', [token, email], (err, result) => {
                if(err) return res.status(200).json({ status: 200, error: err });
                if(result.affectedRows == 1) {
                    var mailOptions = {
                        from: process.env.school_email,
                        to: email,
                        subject: 'Forgot password verification',
                        text: 'Use this token to reset password of your account: ' + token
                    };
                    email_path.sendMail(mailOptions, (error, info) => {
                        if(error) throw error;
                    })
                    res.status(200).json({ status: 200, message: 'token sent to your email' });
                }
            })
        }
    })
})

user.post('/reset-password', (req, res) => {
    const { email, token, new_password } = req.body;
    if(!email) return res.status(400).json({ status: 400, error: 'Missing input email required' });
    if(!token) return res.status(400).json({ status: 400, error: 'Missing input token required' });
    if(!new_password) return res.status(400).json({ status: 400, error: 'Missing input new password required' });

    db.query('SELECT token FROM users WHERE email =?', [ email ], (err, result) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(result.token != token) return res.status(400).json({ status: 400, error: 'Invalid token' });
        if(result.token == token) {
            const encrypt_password = generateEncryptedPassword(new_password);
            db.query('UPDATE users SET password =? WHERE token =?', [ encrypt_password, token ], (err, result) => {
                if(err) throw err;
                if(result.affectedRows == 1) {
                    res.status(200).json({ status: 200, message: 'Password reset successfully' });
                }
            })
        }
    })
})

user.post('/change-password', (req, res) => {
    const { token, old_password, new_password } = req.body;

    if(!token) return res.status(400).json({ status: 400, error: 'Missing input token required' });
    if(!old_password) return res.status(400).json({ status: 400, error: 'Missing input old password required' });
    if(!new_password) return res.status(400).json({ status: 400, error: 'Missing input new password required' });

    db.query('SELECT * FROM users WHERE account_token =?', [ token ], (err, result) => {
        if(err) return res.status(200).json({ status: 200, error: err });
        if(result.length == 0) return res.status(400).json({ status: 400, error: 'Invalid token' });
        if(result.length > 0) {
            db.query('UPDATE users SET password =? WHERE account_token=?', [ new_password, token ], (error, result) => {
                if(error) return res.status(200).json({ status: 200, error: error });
                if(result.affectedRows == 1) {
                    res.status(200).json({ status: 200, message: 'Password changed successfully' });
                }
            });
        }
    })
})

user.put('/change-avatar', upload.single('avatar'), (req, res) => {
    const { token } = req.body;

    if (!token) return res.status(400).json({ status: 400, error: 'Missing input token required' });
    if (!req.file) return res.status(400).json({ status: 400, error: 'Missing input avatar required' });

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    db.query('UPDATE users SET avatar = ? WHERE account_token = ?', [avatarUrl, token], (err, result) => {
        if (err) return res.status(500).json({ status: 500, error: err.message });
        if (result.affectedRows === 1) {
            db.query('UPDATE teachers SET profile_pic = ? WHERE teacher_token = ?', [ avatarUrl, token ], (err, result) => {
                if(err) return res.status(400).json({ status: 400, error: err });
                if(result.affectedRows === 1)res.status(200).json({ status: 200, message: 'Avatar changed successfully', data: { avatarUrl } });
            });
        } else {
            res.status(200).json({ status: 200, error: 'Failed to update avatar' });
        }
    });
});


user.put('/deactivate-user', (req, res) => {
    const { token } = req.body;

    if(!token) return res.status(400).json({ status: 400, message: 'Missing requried token' });

    db.query('UPDATE users SET status = ? WHERE account_token =?', [ 'Deactive', token ], (err, result) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(result.affectedRows == 1) res.status(200).json({ status: 200, message: 'Account deactivated successfully' });
    })
});



// encrypt password
function generateEncryptedPassword(password) {
  const hash = crypto.createHash('sha256');
  hash.update(password)
  return hash.digest('hex');
}

module.exports = user;