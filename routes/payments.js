const express = require('express');
const db = require('../db.config');

const payments = express();


payments.get('/', (req, res) => {
    db.query('SELECT paymennt_id, student_id, payment_date, amount, balance, payment_method, depositor, status FROM payments', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err.message });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No payments found', data: rows });
        } else {
            res.json({status: 200, message: 'payments fetched successfully', data: rows});
        }
    });
});

payments.get('/:id', (req, res) => {
    const paymennt_id = req.params.id;
    if(!paymennt_id) {
        return res.status(400).json({ status: 400, message: "paymennt_id is required" });
    }

    db.query('SELECT paymennt_id, student_id, payment_date, amount, balance, payment_method, depositor, status FROM payments WHERE paymennt_id =?', [ paymennt_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err.message });
        if(rows.length === 0) {
            return res.status(400).json({ status: 400, message: "payment not found" });
        } else {
            retres.json({status: 400, message: 'payment fetched successfully', data: rows });
        }
    });
})

payments.post('/add-payment', (req, res) => {
    const { student_id, payment_date, amount, balance, payment_method, depositor, status } = req.body;
    if(!student_id) return res.status(400).json({ status: 400, message: 'Missing required student_id' });
    if(!payment_date) return res.status(400).json({ status: 400, message: 'Missing required payment_date' });
    if(!amount) return res.status(400).json({ status: 400, message: 'Missing required amount' });
    if(!balance) return res.status(400).json({ status: 400, message: 'Missing required balance' });
    if(!payment_method) return res.status(400).json({ status: 400, message: 'Missing required payment_method' });
    if(!depositor) return res.status(400).json({ status: 400, message: 'Missing required depositor' });
    if(!status) return res.status(400).json({ status: 400, message: 'Missing required status' });

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('INSERT INTO payments (student_id, payment_date, amount, balance, payment_method, depositor, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [ student_id, payment_date, amount, balance, payment_method, depositor, status, createdAt, updatedAt ], (err, result) => {
            if(err) return res.status(400).json({ status: 400, error: err.message });
            if(result.affectedRows === 1) {
                return res.status(200).json({ status: 200, message: 'payment made successfully' });
            } else {
                return res.status(400).json({ status: 400, message: 'payment not made' });
            }
        })
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
})

payments.put('/update-payment/:id', (req, res) => {
    const paymennt_id = req.params.id;
    if (!paymennt_id) return res.status(400).json({ status: 400, error: "Missing required paymennt_id" });

    const { student_id, payment_date, amount, balance, payment_method, depositor, status } = req.body;
    if(!student_id) return res.status(400).json({ status: 400, message: 'Missing required student_id' });
    if(!payment_date) return res.status(400).json({ status: 400, message: 'Missing required payment_date' });
    if(!amount) return res.status(400).json({ status: 400, message: 'Missing required amount' });
    if(!balance) return res.status(400).json({ status: 400, message: 'Missing required balance' });
    if(!payment_method) return res.status(400).json({ status: 400, message: 'Missing required payment_method' });
    if(!depositor) return res.status(400).json({ status: 400, message: 'Missing required depositor' });
    if(!status) return res.status(400).json({ status: 400, message: 'Missing required status' });

    const date = new Date();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    db.query('UPDATE payments SET student_id =?, payment_date =?, amount =?, balance =?, payment_method =?, depositor =?, status =?, updatedAt =? WHERE paymennt_id =?', [ student_id, payment_date, amount, balance, payment_method, depositor, status, updatedAt, paymennt_id ], (err, results) =>{
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'payment updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'payment not found' });
        }
    });
});

payments.delete('/delete-payment/:id', (req, res) => {
    const paymennt_id = req.params.id;
    if (!paymennt_id) return res.status(400).json({ status: 400, error: "Missing required paymennt_id" });
    
    db.query('DELETE FROM payments WHERE paymennt_id =?', [ paymennt_id ], (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'payment deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'payment not found' });
        }
    });
});

payments.delete('/delete-all-payments', (req, res) => {
    db.query('DELETE FROM payments', (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'payments deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'payments not found' });
        }
    });
});

module.exports = payments;