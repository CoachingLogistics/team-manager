// required packages and models
var mongoose = require('mongoose');
var Rider = mongoose.model('Rider');
var Carpool = mongoose.model('Carpool');
var Event = mongoose.model('Event');
var requestMailer = require('../mailers/ride_request.js');

var Team = mongoose.model('Team');


/*
 * Index page used for development
 */
exports.index = function(req, res) {
  Rider.find(function(err, riders) {
    res.render('rider/index', {'user': req.user, 'riders': riders});
  });
}

/*
 * Creates a rider
 */
exports.create = function(req, res) {
  // easy access to necessary params
  var riders = req.body.riders;
  var locations = req.body.locations;
  var hours = req.body.hours;
  var minutes = req.body.minutes;
  var ampms = req.body.ampms;
  var carpool_id = req.params.carpool_id;

  // need the carpool

  Carpool.findById(carpool_id, function(err, cp) {
    if(err) {
      return res.redirect('/');
    }
    else {
      var event_id = cp.event_id;
      Event.findById(event_id, function(err, theEvent) {
        if(err) {
          return res.redirect('/');
        }
        else {
          var team_id = theEvent.team_id;

          // riders is an array of player_ids, so loop through and add them
          riders.forEach(function(rider, index) {
            // get the roster spot
            RosterSpot.getByIds(team_id, rider, function(err, rosterSpot) {
              Carpool.findById(carpool_id, function(err, theCarpool) {
                // make the date more readable
                var rosterSpotId = rosterSpot._id;
                var date = theEvent.date;
                var curHour = parseInt(hours[index]);
                var curMinute = parseInt(minutes[index]);
                var curSpecifier = ampms[index];
                if(curHour == 12 && curSpecifier == "am") {
                  curHour = 0;
                }
                else if(curHour != 12 && curSpecifier == "pm") {
                  curHour += 12;
                }
                var rideDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), curHour, curMinute);
                var newRider = new Rider({
                  roster_spot_id: rosterSpotId,
                  carpool_id: carpool_id,
                  event_id: theCarpool.event_id,
                  location: locations[index],
                  time: rideDate,
                  confirmed: true
                });
                // save them
                newRider.save(function(err, saved) {
                  if(err) {
                    return res.redirect('back');
                  }
                });
              });
            }); // here
          });
          return res.redirect('carpools/' + carpool_id);

        }
      });
    }
  });
}


exports.request = function(req, res) {
  Event.findById(req.param('event_id'), function(err, theEvent) {
    Family.getPlayersForUser(req.user._id, function(players) {
      if(err) {
        return res.redirect('back');
      }
      else {
        return res.render('rider/request', {'user': req.user, 'event': theEvent, 'players': players});
      }
    });
  });
}

/*
 * Renders the page to request a ride from someone specific
 */
exports.requestForCarpool = function(req, res) {
  Event.findById(req.param('event_id'), function(err1, theEvent) {
    Carpool.findById(req.param('carpool_id'), function(err2, theCarpool) {
      Family.getPlayersForUser(req.user._id, function(players) {
        if(err1 || err2) {
          return res.redirect('back');
        }
        else {
          return res.render('rider/requestForCarpool', {'user': req.user, 'event': theEvent, 'carpool': theCarpool, 'players': players});
        }
      });
    });
  });
}

/*
 * Creates an unconfirmed rider for a carpool as a request
 */
exports.createRequestForCarpool = function(req, res) {
  // easy access to variables
  var carpool_id = req.param('carpool_id');
  var event_id = req.param('event_id');
  var players = req.body.players;
  var location = req.body.location;
  var hour = parseInt(req.body.hour);
  var minute = parseInt(req.body.minute);
  var specifier = req.body.ampm;
  // get the event to set the date
  Event.findById(event_id, function(err, theEvent) {
    var date = theEvent.date;
    if(hour == 12 && specifier == "am") {
      hour = 0;
    } else if(hour != 12 && specifier == "pm") {
      hour += 12;
    }
    var rideDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), hour, minute);
    // need the team to get the roster spots
    Team.findById(theEvent.team_id, function(err, theTeam) {
      // create a rider for each player
      players.forEach(function(player) {
        RosterSpot.getByIds(theTeam._id, player, function(err, rs) {
          Carpool.findById(carpool_id, function(err, theCarpool) {
            var newRider = new Rider({
              roster_spot_id: rs._id,
              carpool_id: carpool_id,
              event_id: theCarpool.event_id,
              location: location,
              time: rideDate,
              confirmed: false
            });
            newRider.save(function(err, saved) {
              // hope it saved
            });
          });
        }); // here
      });
      // redirect to the carpool show page
      return res.redirect('/carpools/' + carpool_id);
    });
  });
}

/*
 * renders the page to submit a ride request
 */
exports.rideRequestForEvent = function(req, res) {
  var event_id = req.param('event_id');
  Event.findById(event_id, function(err, theEvent) {
    Family.getPlayersForUser(req.user._id, function(players) {
      if(err) {
        return res.redirect('back');
      }
      else {
        return res.render('rider/requestForEvent', { 'user':req.user, 'event':theEvent, 'players':players });
      }
    });
  });
}

/*
 * submits a ride request for an event
 */
exports.submitRideRequestForEvent = function(req, res) {
  console.log('here lol');
  var event_id = req.param('event_id');
  var players = req.body.players;
  var location = req.body.location;
  var hour = parseInt(req.body.hour);
  var minute = parseInt(req.body.minute);
  var specifier = req.body.ampm;

  Event.findById(event_id, function(err, theEvent) {
    var date = theEvent.date;
    if(hour == 12 && specifier == "am") {
      hour = 0;
    } else if(hour != 12 && specifier == "pm") {
      hour += 12;
    }
    var rideDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), hour, minute);
    players.forEach(function(player) {
      RosterSpot.getByIds(theEvent.team_id, player, function(err, theRosterSpot) {
        if(!err && theRosterSpot) {
          var newRider = new Rider({
            roster_spot_id: theRosterSpot._id,
            event_id: theEvent._id,
            location: location,
            time: rideDate,
            confirmed: false
          });
          newRider.save(function(error, saved) {
            // rider is saved
            if(error) {
              console.log('rider not saved');
            } else {
              console.log('rider saved');
            }
          });
        }
      });
    });
    //redirect to show page
    return res.redirect('/events/' + event_id);
  });
}

/*
 * confirms a rider for a carpool
 */
exports.confirmForCarpool = function(req, res) {
  var carpool_id = req.param('carpool_id');
  var player_id = req.param('player_id');
  Carpool.findById(carpool_id, function(err, theCarpool) {
    if(err) {
      return res.redirect('back');
    }
    Event.findById(theCarpool.event_id, function(err, theEvent) {
      if(err) {
        return res.redirect(back);
      }
      else {
        RosterSpot.getByIds(theEvent.team_id, player_id, function(err, theRosterSpot) {
          if(err) {
            return res.redirect('back');
          }
          Rider.getByIds(theCarpool._id, theRosterSpot._id, function(err, theRider) {
            theRider.confirmed = true;
            theRider.save(function(err, theRiderSaved) {
              return res.redirect('/carpools/' + carpool_id);
            });
          });
        });
      }
    });
  });
}

/*
 * Adds a player to a carpool from the 'players needing rides' section of event show
 */
exports.pickupPlayer = function(req, res) {
  // easy access to variables
  var event_id = req.param('event_id');
  var player_id = req.param('player_id');
  var user_id = req.user._id;
  // find the event and roster spot to get the carpool and rider
  Event.findById(event_id, function(err, theEvent) {
    if(err) { return res.redirect('back'); }
    var team_id = theEvent.team_id;
    RosterSpot.getByIds(team_id, player_id, function(err, theRosterSpot) {
      if(err) { return res.redirect('back'); }
      Carpool.getByIds(user_id, event_id, function(err, theCarpool) {
        if(err) { return res.redirect('back'); }
        Rider.getByEventAndRosterSpotId(event_id, theRosterSpot._id, function(err, theRider) {
          if(err) { return res.redirect('back'); }
          // now that we have the rider, set the carpool_id and save it
          theRider.carpool_id = theCarpool._id;
          theRider.confirmed = true;
          console.log(theRider);
          theRider.save(function(err, savedRider) {
            if(!err && savedRider) {
              console.log('rider saved');
            } else{
              console.log(err);
            }
            return res.redirect('/events/' + event_id);
          })
        });
      });
    });
  });
}

exports.removeRider = function(req, res) {
  // easy access to variables
  var carpool_id = req.param('carpool_id');
  var player_id = req.param('player_id');
  Carpool.findById(carpool_id, function(err, theCarpool) {
    if(err) { return res.redirect('back'); }
    Event.findById(theCarpool.event_id, function(err, theEvent) {
      if(err) { return res.redirect('back'); }
      var team_id = theEvent.team_id;
      RosterSpot.getByIds(team_id, player_id, function(err, theRosterSpot) {
        if(err) { return res.redirect('back'); }
        Rider.getByEventAndRosterSpotId(theEvent._id, theRosterSpot._id, function(err, theRider) {
          if(err) { return res.redirect('back'); }
          Rider.remove({_id: theRider._id}, function(err, removedRider) {
            if(err) { return res.redirect('back'); }
            return res.redirect('/carpools/' + carpool_id);
          });
        });
      });
    });
  });
}
