const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const abc = require('./userModel');
abc.x

const {User} = require('./userModel');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/presentRDB');

const app = express();

app.use(bodyParser.json());

app.get('./', (req, res) => {
  res.render('main.html');
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

app.listen(3000, () => {
  console.log("Started on port 3000");
});
