'use strict';
const debug = require('debug')('sensit-gate-remote:phone');
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const config = {
  to : process.env.PHONE_TO,
  from : process.env.PHONE_FROM
};


module.exports = {
  call: function(to, from){
    if (!to){
      to = config.to;
    }
    if (!from){
      from = config.from;
    }
    return new Promise(function(resolve, reject){
      twilio.makeCall({
        to:to,
        from:config.from,
        url : 'http://sensit-gate-remote.herokuapp.com/twilio/sensit.twiml'
      }, function(err, data){
        if (err){
          return reject(err);
        }
        return resolve(data);
      });
      
    });
  }
};
