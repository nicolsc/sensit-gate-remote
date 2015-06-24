'use strict';
require('./loadConfig');

const debug = require('debug')('sensit-gate-remote:app');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');

/* init */
const app = express();
const port = process.env.PORT || 34002;
const server = http.createServer(app);
const db = require('./modules/db');
const phone = require('./modules/phone');

const requestLogger = require('./middlewares/requestLogger');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.locals.moment = require('moment');



db.connect()
.then(function(){
  server.listen(port);
})
.catch(function(err){
  debug('Unable to connect to DB');
  debug(err);
  process.exit(1);
});
app.get('/', function(req, res, next){
  db.db.query('select * from sensit_calls order by date desc')
  .then(function(entries){
    res.format({
      /* JSON first */
      json: function(){
          res.json(entries);
      },
      html: function(){
          res.render('logs', {title:'Sens\'it data', entries:entries});        
      },
      default:function(){
        let err = new Error('Invalid Accept header. This method only handles html & json');
        err.status=406;
        next(err);
      }
    });
  })
  .catch(next);
});
app.post('/call', requestLogger, function(req, res, next){
  if (!req.body || !req.body.sensors || !req.body.sensors.length){
    let err = new Error();
    err.status = 400;
    err.message = 'Invalid data';
    return next(err);
  }
  //tell the backend that everything is fine
  res.json({result:'♡'});
  
  req.body.sensors.forEach(function(sensor){
    if (sensor.sensor_type === 'button'){
      
      
      phone.call()
      .then(function(data){
        debug('Phone call OK');
      })
      .catch(function(err){
        debug('Something went wrong when placing the call');
        debug(err);
      });
      
      db.insertOne('sensit_calls',{ deviceid:req.body.serial_number || req.body.id, date:new Date().toISOString()})
      .then(function(data){
        debug('Call log OK : %o', data);
      })
      .catch(function(err){
        debug('Unable to log call : %s', err.message);
      });
      
    }
  });
  
});

//twiml call
app.post('/twilio/*.twiml', function(req, res){
  res.redirect(req.path);
});
//404 handling
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.format({
    json:function(){
      return res.json({err:err});
    },
    html:function(){
      return res.render('error', {
        err: err
      });
    },
    default:function(){
      res.send();
    }
  });
});

server.on('error', function(err){
    debug('ERROR %s', err);
});
server.on('listening', function(){
 debug('Server listening on port %s', port); 
});