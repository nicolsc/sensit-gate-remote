#Sensit Phone call trigger

Place a phone call every time the Sensit button is pressed

##Why ?


Used to open the SIGFOX headquarters parking gate using the Sensit as a remote control

Currently, you need to place a phone call to open the gate ... which is not that handy, especially when on a motorbike.


##Process

* Press the sensit button
* Callback received *here*
* Phonecall placed through Twilio


## Local Setup
###Prerequisites

* [http://iojs.org](Node)
* [http://postgresql.org/](PostgreSQL) up & running ; or a remote PostgreSQL db available


### Install

Once you cloned or copied the repository, you need to install the dependencies.   
To do that, simply run
```
$ npm install
````

The `postinstall` script will init the DB, and create the `callback_logs` & `sensit_calls` tables

###Env variables

The application need these env vars to be set to work as expected.  
These variables can be set directly in the env (`$ heroku config:set VAR=value`), or through a `config.local.js` file

* `DATABASE_URL` : URL of the PostgreSQL db
* `DEBUG` : Level of debug messages enabled in the console. Used by the [https://www.npmjs.com/package/debug](debug module)
* `PHONE_FROM`  : Default caller ID for phone calls. Example: 33600000000
* `PHONE_TO`  : Default number to call. Example: 33600000000
* `TWILIO_AUTH_TOKEN` : {token}
* `TWILIO_SID`  : {sid}


##Deploy to heroku

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/nicolsc/sensit-gate-remote/tree/master)

Or 
```
$ heroku apps:create  && git push heroku master
```

###Add the DB Url in environnement

```
$ heroku config:set DATABASE_URL=postgresql:///whatever 
```

You can use an heroku addon for this : 

```
$ heroku addons:create heroku-postgresql
```

###Init the remote db
```
$ heroku run npm install
```




##Set up your sensit callback

* Log on [http://sensit.io/account](your sens'it account)
* Activate your _developer access_ if needed
* Fill in the callback field with _http://{your domain}/call

##Enjoy

