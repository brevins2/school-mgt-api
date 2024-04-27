const express = require('express');
const cors = require('cors');
const db_models = require('./models/index');

const fs = require('fs');
const path = require('path');

const app = express();

var corsoptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

app.use(cors(corsoptions));


db_models.sequelize.sync().then(() => {}).catch(err => {
  console.error('Error syncing database tables:', err);
});


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

app.use('/users', require('./routes/users'))


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})