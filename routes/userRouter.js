const express = require('express');
const userRouter = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');


userRouter.post('/signup', (req, res) => {
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
                res.status(200).json({
                    success: 'New user has been created'
                });
            }).catch(error => {
                res.status(500).json({
                    error: error
                });
            });
        }
    });
});

module.exports = userRouter;