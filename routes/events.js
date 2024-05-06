const express = require('express');
const db = require('../db.config');

const school_events = express();


school_events.get('/', (req, res) => {
    db.query('SELECT event_id, event_name, description, event_date, location, event_status FROM school_events', (err, rows) => {
        if(err) return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0)  {
            return res.status(200).json({ status: 200, message: 'No events found', data: rows });
        } else {
            res.json({status: 200, message: 'events fetched successfully', data: rows});
        }
    });
});

school_events.get('/:id', (req, res) => {
    const event_id = req.params.id;
    if(!event_id) {
        return res.status(400).json({ status: 400, message: "event_id is required" });
    }

    db.query('SELECT event_id, event_name, description, event_date, location, event_status FROM school_events WHERE event_id =?', [ event_id ], (err, rows) => {
        if(err)  return res.status(400).json({ status: 400, message: err });
        if(rows.length === 0) {
            return res.status(200).json({ status: 200, message: "event not found" });
        } else {
            res.json({status: 200, message: 'event fetched successfully', data: rows });
        }
    });
})

school_events.post('/add-school-event', (req, res) => {
    const { event_name, description, event_date, location, event_status } = req.body;
    
    if(!event_name) return res.status(400).json({ status: 400, message: 'Missing required event_name' });
    if(!description) return res.status(400).json({ status: 400, message: 'Missing required description' });
    if(!event_date) return res.status(400).json({ status: 400, message: 'Missing required event_date' });
    if(!location) return res.status(400).json({ status: 400, message: 'Missing required location' });
    if(!event_status) return res.status(400).json({ status: 400, message: 'Missing required event_status' });

    if(event_status !== "Pending") {
        return res.status(400).json({ status: 400, message: 'event_status should be Pending' });
    };

    const date = new Date();
    const createdAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    try {
        db.query('SELECT * FROM school_events WHERE event_name =?', [ event_name ], (err, rows) => {
            if(err) return res.status(400).json({ status: 400, message: err });
            if(rows.length > 0) {
                return res.status(400).json({ status: 400, message: 'event already exists' });
            } else {
                db.query('INSERT INTO school_events (event_name, description, event_date, location, event_status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)', [ event_name, description, event_date, location, event_status, createdAt, updatedAt ], (err, result) => {
                    if(err) return res.status(400).json({ status: 400, message: err });
                    if(result.affectedRows === 1) {
                        return res.status(200).json({ status: 200, message: 'event added successfully' });
                    } else {
                        return res.status(400).json({ status: 400, message: 'event not added' });
                    }
                })
            }
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
})

school_events.put('/update-school-event/:id', (req, res) => {
    const event_id = req.params.id;
    if (!event_id) return res.status(400).json({ status: 400, error: "Missing required event_id" });

    const { event_name, description, event_date, location, event_status } = req.body;
    if(!event_name) return res.status(400).json({ status: 400, message: 'Missing required event_name' });
    if(!description) return res.status(400).json({ status: 400, message: 'Missing required description' });
    if(!event_date) return res.status(400).json({ status: 400, message: 'Missing required event_date' });
    if(!location) return res.status(400).json({ status: 400, message: 'Missing required location' });
    if(!event_status) return res.status(400).json({ status: 400, message: 'Missing required event_status' });

    const date = new Date();
    const updatedAt = date.getFullYear()+'/'+date.getUTCMonth()+'/'+date.getUTCDate();

    if(event_status !== "Pending" || event_status !== "Completed" || event_status !== "Cancelled", event_status !== "Extended") {
        return res.status(400).json({ status: 400, message: 'event_status should be Pending, Completed, Cancelled or Extended nothing else' });
    };

    db.query('UPDATE school_events SET event_name =?, description =?, event_date =?, location =?, event_status =?, updatedAt =? WHERE event_id =?', [ event_name, description, event_date, location, event_status, updatedAt, event_id ], (err, results) =>{
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'event updated successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'event not found' });
        }
    });
});

school_events.delete('/delete-event/:id', (req, res) => {
    const event_id = req.params.id;
    if (!event_id) return res.status(400).json({ status: 400, error: "Missing required event_id" });
    
    db.query('DELETE FROM school_events WHERE event_id =?', [ event_id ], (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'event deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'event not found' });
        }
    });
});

school_events.delete('/delete-all-events', (req, res) => {
    db.query('DELETE FROM school_events', (err, results) => {
        if(err) return res.status(400).json({ status: 400, error: err });
        if(results.affectedRows === 1) {
            return res.status(200).json({ status: 200, message: 'events deleted successfully' });
        } else {
            return res.status(400).json({ status: 400, message: 'No events found' });
        }
    });
});

module.exports = school_events;