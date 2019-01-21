var express = require('express');
var app = express();
const opn = require('opn');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//serve static files from /public
// app.use(express.static(__dirname + '/public')); 
app.use(express.static('/public')); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/authentication', { useNewUrlParser: true });

//include routes
const userRouter = require('./routes/userRouter.js');
app.use('/user', userRouter);

app.get('/', (req, res) => {
    res.send({good: 'job'});
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