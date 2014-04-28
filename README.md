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


DEPLOYMENT

The server is currenty deployed to OpenShift, at the address [production-teammanager.rhcloud.com](production-teammanager.rhcloud.com).

Access to OpenShift:
To recieve acess to the hosting interface at OpenShift you'll need to make an account on (https://www.openshift.com/)[https://www.openshift.com/].
Next, you'll have to be added to the "teammanager" domain by an existing member, and given "can edit" or "can administer" access.

To control/update the hosted code, you'll need to do the following:

1. Clone the "production" application to your local machine using git and the url on the application page, https://www.openshift.redhat.com/app/console/application/530fcb735973cacff90003e5-production.  Note that the "git origin master" of the cloned repository is the one that the app is hosted on, so pushing to that will update the app in production.

2. Setup the upstream repo that you'll fetch from to update the app.  Our group used a github repo that we fetched and merged with the local production repo, then pushed to the origin to update the live app.  It is probably a good idea to never edit the local production repository, only to fetch and merge from the upstream, that way no conflicts arise.


To access the hosted environment (in case you want to check logs, clear the db, etc):

1. Download OpenShift's command line tool, "rhc," of which instructions can be found [here](https://www.openshift.com/developers/rhc-client-tools-install).  Note, you'll need to setup with "rhc setup" to link it to your OpenShift account.

2. Inside of the cloned directory, run "rhc ssh production" (production is the name of the app)

3. Hopefully you're inside the ssh, and you can now run "mongo" and then "use production" (or it might be a different db name, try "show collections").


To see the hosted app's console log, do:

1. In the production's local repository run "rhc tail production".


Also, the emailing, geocoordinates, and google maps generated in this app have keys that are registered to the team.manager.notification google account.
You may run into problems with the key access (we have both server and browser API keys), so you may need to add either new domains (for browser) or IP addresses (for OpenShift  or local server) via the google API. 
There may also be problems with email throttling (which is fixed by signing into gmail every so often, I think).






