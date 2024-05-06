const express = require('express');
const db = require('../db.config');
const multer = require('multer');

const libraries = express();

const fileNameSingle  = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage: fileNameSingle})


libraries.get('/', (req, res) => {
    db.query('SELECT book_id, title, author, dedicated_classes, ISBN, availability, book_cover FROM libraries', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No books found', data: rows });
        } else {
            res.json({status: 200, message: 'books fetched successfully', data: rows});
        }
    });
});

libraries.get('/:id', (req, res) => {
    const book_id = req.params.id;
    if(!book_id) {
        return res.status(400).json({ status: 400, message: "book_id is required" });
    }

    db.query('SELECT book_id, title, author, dedicated_classes, ISBN, availability, book_cover FROM libraries WHERE book_id =?', [ book_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(200).json({ status: 200, message: "book not found" });
        } else {
            res.json({status: 200, message: 'books fetched successfully', data: rows });
        }
    });
})

libraries.post('/add-book', upload.single('book_cover'), (req, res) => {
    const { title, author, dedicated_classes, ISBN, availability } = req.body;
    
    if(!title) return res.status(400).json({ status: 400, message: 'Missing required title' });
    if(!author) return res.status(400).json({ status: 400, message: 'Missing required author' });
    if(!dedicated_classes) return res.status(400).json({ status: 400, message: 'Missing required dedicated_classes' });
    if(!ISBN) return res.status(400).json({ status: 400, message: 'Missing required ISBN' });
    if(!availability) return res.status(400).json({ status: 400, message: 'Missing required availability' });
    // if(!book_cover) return res.status(400).json({ status: 400, message: 'Missing required book_cover' });

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    const book_cover_image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    try {
        db.query('SELECT * FROM libraries WHERE title =?', [ title ], (err, rows) => {
            if(err) return res.status(400).json({ status: 400, message: err });
            if(rows.length > 0) {
                return res.status(400).json({ status: 400, message: 'book already exists' });
            } else {
                db.query('INSERT INTO libraries (title, author, dedicated_classes, ISBN, availability, book_cover, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [ title, author, dedicated_classes, ISBN, availability, book_cover_image, createdAt, updatedAt ], (err, result) => {
                    if(err) return res.status(400).json({ status: 400, message: err });
                    if(result.affectedRows === 1) {
                        return res.status(200).json({ status: 200, message: 'book added successfully' });
                    } else {
                        return res.status(400).json({ status: 400, message: 'book not added' });
                    }
                })
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})

libraries.put('/update-book/:id', upload.single('book_cover'), (req, res) => {
    const book_id = req.params.id;
    if (!book_id) return res.status(400).json({ status: 400, error: "Missing required book_id" });
    // if(typeof book_id != 'number') return res.status(400).json({ status: 400, error: "book_id must be number" });

    const { title, author, dedicated_classes, ISBN, availability, book_cover } = req.body;
    if(!title) return res.status(400).json({ status: 400, message: 'Missing required title' });
    if(!author) return res.status(400).json({ status: 400, message: 'Missing required author' });
    if(!dedicated_classes) return res.status(400).json({ status: 400, message: 'Missing required dedicated_classes' });
    if(!ISBN) return res.status(400).json({ status: 400, message: 'Missing required ISBN' });
    if(!availability) return res.status(400).json({ status: 400, message: 'Missing required availability' });
    // if(!book_cover) return res.status(400).json({ status: 400, message: 'Missing required book_cover' });

    const date = new Date();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    const book_cover_image = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    db.query('UPDATE libraries SET title =?, author =?, dedicated_classes =?, ISBN =?, availability =?,  book_cover =?, updatedAt =? WHERE book_id =?', [ title, author, dedicated_classes, ISBN, availability, book_cover_image, updatedAt, book_id ], (err, results) =>{
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'book updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'book not found' });
        }
    });
});

libraries.delete('/delete-book/:id', (req, res) => {
    const book_id = req.params.id;
    if (!book_id) return res.status(400).json({ status: 400, error: "Missing required book_id" });
    
    db.query('DELETE FROM libraries WHERE book_id =?', [ book_id ], (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'book deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'book not found' });
        }
    });
});

libraries.delete('/delete-all-books', (req, res) => {
    db.query('DELETE FROM libraries', (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'books deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'No books found' });
        }
    });
});

module.exports = libraries;