const express = require('express');
const db = require('../db.config');

const orders = express();

orders.get('/', (req, res) => {
    db.query('SELECT order_id, userid, invoice, order_status, delivery_location, receiver_phone, payment_method, amount, order_ref, order_date FROM orders', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });

        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No orders found', data: rows });
        } else {
            res.json({status: 200, message: 'orders fetched successfully', data: rows});
        }
    });
});

orders.get('/:id', (req, res) => {
    const order_id = req.params.id;
    if(!order_id) {
        return res.status(400).json({ status: 400, message: "order_id is required" });
    }

    db.query('SELECT order_id, userid, invoice, order_status, delivery_location, receiver_phone, payment_method, amount, order_ref, order_date FROM orders WHERE order_id =?', [ order_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(200).json({ status: 200, message: "order not found" });
        } else {
            res.json({status: 200, message: 'order fetched successfully', data: rows[0] });
        }
    });
});

orders.get('/for-user/:id', (req, res) => {
    const user_id = req.params.id;
    if(!user_id) {
        return res.status(400).json({ status: 400, message: "user_id is required" });
    }

    db.query('SELECT order_id, userid, invoice, order_status, delivery_location, receiver_phone, payment_method, amount, order_ref, order_date FROM orders WHERE userid =?', [ user_id ], (err, rows) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(rows.length === 0) {
            return res.status(400).json({ status: 400, message: "No orders not found for this user" });
        } else {
            res.json({status: 200, message: "User's orders fetched successfully", data: rows });
        }
    });
});

orders.post('/press-an-order', (req, res) => {
    const { userid, delivery_location, receiver_phone, payment_method, amount } = req.body;
    const invoice = Math.floor(Math.random() * 100000);
    const order_ref = Math.floor(Math.random() * 1000000000000000);
    const order_status = 'UnPaid';
    
    if(!userid) return res.status(400).json({ status: 400, message: 'Missing required userid' });
    if(!delivery_location) return res.status(400).json({ status: 400, message: 'Missing required delivery_location' });
    if(!receiver_phone) return res.status(400).json({ status: 400, message: 'Missing required receiver_phone' });
    if(!payment_method) return res.status(400).json({ status: 400, message: 'Missing required payment_method' });
    if(!amount) return res.status(400).json({ status: 400, message: 'Missing required amount' });

    const date = new Date();
    const order_date = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('INSERT INTO orders (userid, invoice, order_status, delivery_location, receiver_phone, payment_method, amount, order_ref, order_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [ userid, invoice, order_status, delivery_location, receiver_phone, payment_method, amount, order_ref, order_date ], (err, result) => {
            if(err) return res.status(400).json({ status: 400, message: err });
            if(result.affectedRows === 1) {
                db.query("UPDATE cart SET cart_status = 'UnPaid', invoice = ? WHERE userid = ? AND cart_date = ? AND cart_status = 'Pending'", [ invoice, userid, order_date ], (err, rows) => {
                    if(err) return res.status(400).json({ status: 400, error: err });
                    if(rows.affectedRows == 1) return res.status(200).json({ status: 200, message: 'Order made successfully' });
                    else return res.status(400).json({ status: 400, error: "cart not updated successfully" });
                })
            } else {
                return res.status(400).json({ status: 400, message: 'Orders not made' });
            }
        })
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})

orders.delete('/delete-order/:id', (req, res) => {
    const order_id = req.body;

    if(!order_id) return res.status(400).json({ status: 400, message: 'Missing requried order_id' });

    db.query('DELETE FROM orders WHERE order_id =?', [ order_id ], (err, result) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(result.affectedRows == 1) res.status(200).json({ status: 200, message: 'Item in orders deleted successfully' });
    })
});

module.exports = orders;