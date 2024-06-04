const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');

const app = express();

var corsoptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsoptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
    fs.readFile(path.join('./templates/home-message.html'), 'utf8', function (err, success) {
        if (err) {
            console.log(err);
            res.send(`
                Welcome to school api in Node Express js that has been designed based on the schools in Sudan and Africa at large
            `);
        } else {
            res.sendFile(path.join(__dirname, './templates/home-message.html'));
        }
    });
});

app.use('/users', require('./routes/users'));
app.use('/cart', require('./routes/cart'));
app.use('/categories', require('./routes/category'));
app.use('/packages', require('./routes/packages'));
app.use('/orders', require('./routes/orders'));


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})