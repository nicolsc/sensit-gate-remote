'use strict';
const debug = require('debug')('sensit-gate-remote:request-logger');
const db = require('../modules/db');
module.exports = function(req, res, next){
  
  db.insertOne('callback_logs', {date:new Date().toISOString(), method:req.method, path:req.path, data:JSON.stringify(req.body)})
  .then(function(obj){
    debug('Request log OK');
    debug(obj);
    next();
  })
  .catch(function(err){
    debug('Log err : %s', err);
    //return res.status(500).json({err:'Unable to log request', details:err.message});
    next();
  });
};