// required packages and models
var mongoose = require('mongoose');
var Rider = mongoose.model('Rider');
var Carpool = mongoose.model('Carpool');
var Event = mongoose.model('Event');

/*
 * Index page used for development
 */
exports.index = function(req, res) {
  Rider.find(function(err, riders) {
    res.render('rider/index', {'user': req.user, 'riders': riders});
  });
}

/*
 * creates a rider for a carpool
 */
exports.create = function(req, res) {
  var carpool_id = req.params.carpool_id;
  var player_id = req.body.player;
  var location = req.body.location;
  var hour = req.body.hour;
  var minute = req.body.minute;
  var specifier = req.body.ampm;
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
          var date = theEvent.date;
          if(hour == 12 && specifier == "am") {
            hour = 0;
          } else if(hour != 12 && specifier == "pm") {
            hour += 12;
          }
          var rideDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), hour, minute);
          var team_id = theEvent.team_id;
          RosterSpot.getByIds(team_id, player_id, function(err, rosterSpot) {
            var rosterSpotId = rosterSpot._id;
            var newRider = new Rider({
              roster_spot_id: rosterSpotId,
              carpool_id: carpool_id,
              location: location,
              time: rideDate,
              confirmed: true
            });
            newRider.save(function(err, saved) {
              if(err) {
                return res.redirect('back');
              }
              else {
                return res.redirect('carpools/' + carpool_id);
              }
            });
          });
        }
      });
    }
  });
  res.send('carpool id is ' + carpool_id + " and player_id is " + player_id);
}
