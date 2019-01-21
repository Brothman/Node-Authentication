var express = require('express');
var app = express();
const opn = require('opn');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


mongoose.connect('mongodb://localhost:27017/authentication', { useNewUrlParser: true });

//include routes
const userRouter = require('./routes/userRouter.js');
app.use('/user', userRouter);

//Seems to be needed to host my static files on the server for the index.html to use
app.use('/src', express.static(__dirname + '/src'));

app.get('/', (req, res) => {
    // res.send({good: 'job'});
    // res.sendFile(path.join(__dirname + '/src/index.html'));
    res.render('index.ejs')
});

app.get('/login', (req, res) => {
    res.render('login.ejs')
});

app.get('/success', (req, res) => {
    const email = req.query.email;
    const index = email.indexOf('@');
    const name = email.slice(0, index);
    res.render('index2.ejs', {email: name});
});

//Catch 404 No Page Found and Forward to Error Handler
app.use( (req, res, next) => {
    const error = new Error('File Not Found');
    error.status = 404;
    next(error);
});

//Error Handler
//Make sure this is the last app.use Callback

app.use( (error, req, res, next) => {
    res.status(error.status || 500)
    // .json('error', {
    //     message: error.message,
    //     error: {}
    // });
    .json({
        message: error.message,
        errorStatus: error.status
    });
});

const env = process.env.NODE_ENV || 'dev';

//process.env.PORT lets the port be set by Heroku
//PORT will be undefined if run locally with nodemon server.js

app.listen(process.env.PORT || 3000, () => {
    if (env == 'dev') {
        console.log('Server listening on port 3000!');
        opn('http://localhost:3000/');
    }
});