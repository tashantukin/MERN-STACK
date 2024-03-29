const express = require('express');
// const User = require('../../models/User');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../../config/keys');
const passport = require('passport');
//5th load user model

const User = require('../../models/User')
//load input validation

const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// @route GET api/posts/test
// @desc Test users route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

//5th

// @route GET api/users/register
// @desc Register user 
// @access Public


router.post('/register', (req, res) =>
{
    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }

    User.findOne({
        email: req.body.email
    })
        .then(user =>
        {
            if (user) {
                return res.status(400).json({ email: 'Email already exists' });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'pg', //rating
                    d: 'mm' //default

                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) =>
                {
                    bcrypt.hash(newUser.password, salt, (err, hash) =>
                    {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err))
                    })
                })
            }
        })
})

// @route GET api/users/login
// @desc Login user 
// @access Public

router.post('/login', (req, res) =>
{

    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }
    const email = req.body.email;
    const password = req.body.password

    //find the user by email
    User.findOne({ email }).then(user =>
    {
        if (!user) {
            errors.email = 'User not found.'
            return res.status(404).json(errors)
        }
        //check password
        bcrypt.compare(password, user.password)
            .then(isMatched =>
            {
                if (isMatched) {
                    // res.json({
                    //     msg: 'SUCCESS'
                    // });
                    //user matched
                    const payload = { id: user.id, name: user.name, avatar: user.avatar } //create jwt payload

                    //sign token
                    jwt.sign(payload,
                        keys.secretOrkey,
                        { expiresIn: 3600 }, (err, token) =>
                    {
                        res.json({ success: true, token: 'Bearer ' + token })
                    });

                } else {
                    errors.password = 'Password incorrect'
                    return res.status('400').json(errors);
                }
            })
    })
})

// @route GET api/posts/current
// @desc Return current user
// @access Private

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) =>
{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})



module.exports = router;