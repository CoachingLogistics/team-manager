Team Manager
============

This is a node application to help organize team logistical information.
It allows coaches to create teams and add players and parents to the team in
the system, and use the system to track and organize attendance information.
Users can submit attendance information through emails or from the website.

In addition to attendance information, Team Manager supports carpool organization
so users can offer carpools, request rides, and join other carpools for events.

This project is part of the course 67-373 - Software Development Project, part
of the core curriculum for the Information Systems program at Carnegie Mellon University.

Contributers:
* [Alex Egan](https://github.com/AEgan)
* [Duan Wang](https://github.com/loganwatanabe)
* [Logan Watanabe ](https://github.com/duanw)
* [Delia Zhao](https://github.com/deliaz1993)

Client: Mark Schaub

Please merge your code with the [main repository's](https://github.com/CoachingLogistics/team-manager)
master branch before submitting a pull request. Follow [these instructions](https://help.github.com/articles/syncing-a-fork)
 for syncing a fork

This project uses node, express, and mongodb. Some important modules we are using include
* [mongoose](https://github.com/LearnBoost/mongoose)
* [passport](https://github.com/jaredhanson/passport)
* [nodemailer](https://github.com/andris9/Nodemailer)
* [async](https://github.com/caolan/async)
* [node-schedule](https://github.com/mattpat/node-schedule)
* [googlemaps](https://github.com/moshen/node-googlemaps)
* [should](https://github.com/visionmedia/should.js)
* [mocha](https://github.com/visionmedia/mocha)

to install these and other necessary modules, run

```
npm install
```

Because we are using mongodb, make sure you are running mongo locally when developing.

We have tested all of the methods and validations for our models.
If you would like to run these tests on your machine, first install mocha globally

```
npm install -g mocha
```

and run

```
mocha path/to/testfile.js
```

To run the server in a broswer, start your server locally by running


```
grunt
```
or
```
node app
```
