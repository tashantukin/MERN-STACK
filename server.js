const express = require('express');
const mongoose = require('mongoose')
const { reset } = require('nodemon');


const app = express();

//DB config

const db = require('./config/keys').mongoURI;

//Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));


app.get('/', (req, res) => res.send('hello'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));