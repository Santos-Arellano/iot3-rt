require('dotenv').config();
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');

const exWs = require('express-ws');
const expressWs = exWs(express());
const app = expressWs.app;

// Socket
const aWss  = expressWs.getWss();
global.aWss = aWss; // Mala practica pero no encontre otra forma de usarlo en routes
app.ws('/', function(ws, req) {
  console.log('Socket Connected');

  ws.onmessage = function(msg) {
    console.log(msg.data);
    aWss.clients.forEach(function (client) {
      client.send(msg.data);
    });
  };
});
// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.create({
  defaultLayout: 'main',
  extname: '.hbs'
}).engine
);
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(require('./routes/index'));

// Static files
app.use(express.static(path.join(__dirname, 'public'))); 

module.exports = app;