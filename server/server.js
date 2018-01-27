const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const socket = require('socket.io');

const {User} = require('./userModel');

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/presentRDB');

const app = express();

app.set(`view engine`, `hbs`);
app.use(bodyParser.urlencoded());

app.get('/', (req, res) => {
  res.render('../views/login.hbs');
});

app.get('/canvas', (req, res) => {
  res.render('../views/canvas.hbs');
})

app.post('/loginAttempt', (req, res) => {
  User.findOne({'username': req.body.username, 'password': req.body.password}, (err, success) => {
    if (err) {
      res.redirect('/');
    }
    else {
      res.redirect('/canvas');
    }
  });

});

app.get('/registrationScreen', (req, res) => {
  res.render('../views/registration.hbs');
})

app.post('/register', (req, res) => {
  console.log(req.body)
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save().then((doc) => {
    res.redirect('/');
  }, (e) => {
    res.status(400).send(e);
  });
});

// app.post('/')

app.listen(port, () => {
  console.log("Started on port ", port);
});
