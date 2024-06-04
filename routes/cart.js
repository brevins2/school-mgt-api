const express = require('express');
const db = require('../db.config');

const cart = express();

// cart_id, userid, cat_id, cd_id, package_id, cart_status, cart_qnty, cart_price, cart_total_price, cart_date, invoice
cart.get('/', (req, res) => {
    db.query('SELECT cart_id, userid, cat_id, cd_id, package_id, cart_status, cart_qnty, cart_price, cart_total_price, cart_date, invoice FROM cart', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });

        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No events found', data: rows });
        } else {
            res.json({status: 200, message: 'cart fetched successfully', data: rows});
        }
    });
});

cart.get('/:id', (req, res) => {
    const cart_id = req.params.id;
    if(!cart_id) {
        return res.status(400).json({ status: 400, message: "cart_id is required" });
    }

    db.query('SELECT cart_id, userid, cat_id, cd_id, package_id, cart_status, cart_qnty, cart_price, cart_total_price, cart_date, invoice FROM cart WHERE cart_id =?', [ cart_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(200).json({ status: 200, message: "cart not found" });
        } else {
            res.json({status: 200, message: 'cart fetched successfully', data: rows });
        }
    });
});

cart.get('/of-user/:id', (req, res) => {
    const user_id = req.params.id;
    if(!user_id) {
        return res.status(400).json({ status: 400, message: "user_id is required" });
    }

    db.query('SELECT cart_id, userid, cat_id, cd_id, package_id, cart_status, cart_qnty, cart_price, cart_total_price, cart_date, invoice FROM cart WHERE userid =?', [ user_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(200).json({ status: 200, message: "cart not found" });
        } else {
            res.json({status: 200, message: "User's cart fetched successfully", data: rows });
        }
    });
});

cart.post('/add-to-cart', (req, res) => {
    const { userid, cat_id, cd_id, package_id, cart_qnty, cart_price, cart_total_price } = req.body;
    const invoice = Math.floor(Math.random() * 100000);
    const cart_status = 'Pending';
    
    if(!userid) return res.status(400).json({ status: 400, message: 'Missing required userid' });
    if(!cat_id) return res.status(400).json({ status: 400, message: 'Missing required cat_id' });
    if(!cd_id) return res.status(400).json({ status: 400, message: 'Missing required cd_id' });
    if(!package_id) return res.status(400).json({ status: 400, message: 'Missing required package_id' });
    if(!cart_qnty) return res.status(400).json({ status: 400, message: 'Missing required cart_qnty' });
    if(!cart_price) return res.status(400).json({ status: 400, message: 'Missing required cart_price' });
    if(!cart_total_price) return res.status(400).json({ status: 400, message: 'Missing required cart_total_price' });

    const date = new Date();
    const cart_date = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('INSERT INTO cart (userid, cat_id, cd_id, package_id, cart_status, cart_qnty, cart_price, cart_total_price, cart_date, invoice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ userid, cat_id, cd_id, package_id, cart_status, cart_qnty, cart_price, cart_total_price, cart_date, invoice ], (err, result) => {
            if(err) return res.status(400).json({ status: 400, message: err });
            if(result.affectedRows === 1) {
                return res.status(200).json({ status: 200, message: 'added to cart successfully' });
            } else {
                return res.status(400).json({ status: 400, message: 'Not added to cart' });
            }
        })
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});


cart.delete('/delete-from-cart/:id', (req, res) => {
    const cart_id = req.body;

    if(!cart_id) return res.status(400).json({ status: 400, message: 'Missing requried cart_id' });

    db.query('DELETE FROM cart WHERE cart_id =?', [ cart_id ], (err, result) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(result.affectedRows == 1) res.status(200).json({ status: 200, message: 'Item in cart deleted successfully' });
    })
});

module.exports = cart;