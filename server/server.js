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
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('../views/login.hbs');
});

app.post('/userTable', (req, res) => {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(port, () => {
  console.log("Started on port ", port);
});
