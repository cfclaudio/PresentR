const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const http = require('http');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

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
  // next();
});

app.get('/canvas', (req, res, next) => {
  console.log('Canvas: ', res.locals.authenticated);
  if (authenticated) {
    res.render('../views/canvas.hbs');
  }
  else {
    res.redirect('/')
  }

})

app.post('/loginAttempt', (req, res, next) => {

  User.findOne({'username': `${req.body.username}`, 'password': `${req.body.password}`}, (err, success) => {
    if (!success) {
      res.redirect('/');
    }
    else {
      authenticated = true;
      res.redirect('/canvas');
    }
  });

});

// app.get('/loginAttempt', (req, res, next) => {
//
// })

app.get('/registrationScreen', (req, res, next) => {
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

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('New user disconnected');
  })
});

server.listen(port, () => {
  console.log("Started on port ", port);
});
