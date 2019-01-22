const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// userRouter.get('/signup', (req, res) => {
//     res.status(200).json({hello: 'Yo'})
// });

userRouter.post('/signup', (req, res) => { 
    console.log(req.body) // we get the email and username attributes

    bcrypt.hash(req.body.password, 10, (error, hash) => {
        if (error) {
           return res.status(500).json({
                error: error
            });
        }
        else {
            const user = new User({
                email: req.body.email,
                password: hash
            });

            user.save().then((result) => {
                console.log(result);
                // res.status(200).json({
                //     success: 'New user has been created'
                // });
                res.send({ email: user.email });
            }).catch(error => {
                console.log(`second ${error}`)
                res.status(500).json({
                    error: error
                });
            });
        }
    });
});

userRouter.post('/signin', (req, res) => {
    User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
        bcrypt.compare(req.body.password, user.password, (error, result) => {
            if (error) {
                console.log('no user')
                return res.status(401).json({
                    failed: 'Unauthorized Access'
                });
            }
            if (result) {
                console.log(result)
                return res.send({ email: user.email });
            }

            return res.status(401).json({error: 'Invalid Username/Password Combination'});

            //wrong password
            // return res.status(401).json({
            //     failed: 'Unauthorized Access'
            // });
        });
    })
    .catch(error => {
        res.status(500).json({
            error: error
        });
    });
});

module.exports = userRouter;