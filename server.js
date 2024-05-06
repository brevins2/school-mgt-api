const express = require('express');
const cors = require('cors');
const db_models = require('./models/index');
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

app.use('/users', require('./routes/users'));
app.use('/classes', require('./routes/classes'));
app.use('/teachers', require('./routes/teachers'));
app.use('/books', require('./routes/library'));
app.use('/courses', require('./routes/courses'));
app.use('/school_events', require('./routes/events'));
app.use('/students', require('./routes/students'));
app.use('/grades', require('./routes/grades'));
app.use('/payments', require('./routes/payments'));
app.use('/attendences', require('./routes/attendences'));
app.use('/enrollments', require('./routes/enrollments'));


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})