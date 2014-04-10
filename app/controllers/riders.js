// required packages and models
var mongoose = require('mongoose');
var Rider = mongoose.model('Rider');
var Carpool = mongoose.model('Carpool');
var Event = mongoose.model('Event');
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
 * Creates a carpool
 */
exports.create = function(req, res) {
  // easy access to necessary params
  var riders = req.body.riders;
  var carpool_id = req.params.carpool_id;
  var location = req.body.location;
  var hour = parseInt(req.body.hour);
  var minute = parseInt(req.body.minute);
  var specifier = req.body.ampm;
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
          // change the time from human readable to proper date format
          var date = theEvent.date;
          if(hour == 12 && specifier == "am") {
            hour = 0;
          } else if(hour != 12 && specifier == "pm") {
            hour += 12;
          }
          var rideDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), hour, minute);
          var team_id = theEvent.team_id;
          // riders is an array of player_ids, so loop through and add them
          riders.forEach(function(rider) {
            // get the roster spot
            RosterSpot.getByIds(team_id, rider, function(err, rosterSpot) {
              var rosterSpotId = rosterSpot._id;
              var newRider = new Rider({
                roster_spot_id: rosterSpotId,
                carpool_id: carpool_id,
                location: location,
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
 * we need to talk about ride requests, no way to tie them to an event if there is no carpool
 */
exports.createRequest = function(req, res) {
  res.redirect('/events/' + req.param('event_id'));
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
          var newRider = new Rider({
            roster_spot_id: rs._id,
            carpool_id: carpool_id,
            location: location,
            time: rideDate,
            confirmed: false
          });
          newRider.save(function(err, saved) {
            // hope it saved
          });
        });
      });
      // redirect to the carpool show page
      return res.redirect('/carpools/' + carpool_id);
    });
  });
}
