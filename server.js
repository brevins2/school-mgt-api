const express = require('express');
const db = require('./db.config');
const cors = require('cors');

const app = express();

var corsoptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsoptions));





app.use(express.urlencoded({ extended: true }));




app.listen(3000, () => {
    console.log('Server is running on port 3000');
})