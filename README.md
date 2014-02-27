Team Manager
============

Helps manage team logistical information.

Software Development Project at CMU.

run 

```
npm install
```
to install modules

to test you need mocha installed on your machine, so run

```
npm install -g mocha
```

make sure you run mongod when using the application

follow these instructions for syncing a fork
https://help.github.com/articles/syncing-a-fork

start the server by running

```
grunt
```
or 
```
node app
```

to use the mailer, create a file called 'mailer.js' inside of your config folder, and model it like this:
```
var mailer_options = {
	service: "Gmail",
	user: "email here",
	pass: "password here"
};

module.exports = mailer_options;
```