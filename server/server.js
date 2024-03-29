const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('hbs');
const http = require('http');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const bcrypt = require('bcrypt');

const {User} = require('./userModel');

const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;

var uri = "mongodb://admin:admin@ds117858.mlab.com:17858/presentr";
mongoose.connect(uri);

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
  // console.log('Canvas: ', res.locals.authenticated);
  if (authenticated) {
    res.render('../views/canvas.hbs');
  }
  else {
    res.redirect('/failedLogin');
  }
});

app.get('/failedLogin', (req, res) => {
  res.render('../views/failedlogin.hbs')
});

app.post('/loginAttempt', (req, res, next) => {

  User.findOne({'username': `${req.body.username}`}, (err, success) => {
    // console.log(success);
    if (!success) {
      console.log("this username dont exist");
      res.redirect('/failedLogin');
    }
    else {
      // console.log(bcrypt.compareSync(`${req.body.password}`, success.password));
      if(bcrypt.compareSync(`${req.body.password}`, success.password)) {
        res.redirect('/canvas');
        authenticated = true;
      }
      else {
        // console.log("this false pass");
        res.redirect('/failedLogin');
      }


    }
  });
});

app.get('/registrationScreen', (req, res, next) => {
  res.render('../views/registration.hbs');
})

app.post('/register', (req, res) => {
  var hash = bcrypt.hashSync(req.body.password, 10);
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

io.on('connection', function(socket){

  var canv;
 socket.emit('canvas', function(canvasobj){
   // canv = canvasobj;
   // console.log('The canvas1: ', canv);
   io.sockets.emit('canvas', canv);

  });
  socket.on('canvasEmit', (canvasobj) => {
    // console.log('The canvas2: ', canvasobj);
    canv = canvasobj;
    io.sockets.emit('canvas', canvasobj);

  });
});

server.listen(port, () => {
  console.log("Started on port ", port);
});
