const express = require('express');
const mongoose = require('mongoose')
const { reset } = require('nodemon');
//5th

const bodyParser = require('body-parser');
const passport = require('passport');

//2nd 
//DB config

const db = require('./config/keys').mongoURI;

//Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


//3rd
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

const app = express();

//5th body parser middle ware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//Passport middleware

app.use(passport.initialize());

//Passport Config
require('./config/passport')(passport);


//3rd
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);


//1st
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));