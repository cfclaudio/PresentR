const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const http = require('http');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const {User} = require('./userModel');

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/presentRDB');

const app = express();

const server = http.createServer(app);
const io = socketIO(server);

let authenticated = false;

app.set(`view engine`, `hbs`);
app.use(bodyParser.urlencoded());

app.get('/', (req, res, next) => {
  res.render('../views/login.hbs');
});

app.get('/canvas', (req, res, next) => {
  console.log('Canvas: ', res.locals.authenticated);
  if (authenticated) {
    res.render('../views/canvas.hbs');
  }
})

app.post('/loginAttempt', (req, res, next) => {

  User.findOne({'username': `${req.body.username}`}, (err, success) => {
    console.log(success);
    if (!success) {
      console.log("this username dont exist");
      res.redirect('/');
    }
    else {
      console.log(bcrypt.compareSync(`${req.body.password}`, success.password));
      if(bcrypt.compareSync(`${req.body.password}`, success.password)) {
        console.log("this tru pass");
        res.redirect('/canvas');
        authenticated = true;
      }
      else {
        console.log("this false pass");
        res.redirect('/');
      }


    }
  });
});

app.get('/registrationScreen', (req, res, next) => {
  res.render('../views/registration.hbs');
})

app.post('/register', (req, res) => {
  var hash = bcrypt.hashSync(req.body.password, saltRounds);
  console.log(hash);
  var user = new User({
    username: req.body.username,
    password: hash
  });
  user.save()
  .then((doc) => {
    res.redirect('/');
  }, (e) => {
    res.status(400).send(e);
  })
  .catch((err) => {
    console.log('Unable to save into db');
  })
});

io.on('connection', (socket) => {
  console.log('New user connected');
});

server.listen(port, () => {
  console.log("Started on port ", port);
});
