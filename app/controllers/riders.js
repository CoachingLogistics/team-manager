// required packages and models
var mongoose = require('mongoose');
var Rider = mongoose.model('Rider');

/*
 * Index page used for development
 */
exports.index = function(req, res) {
  Rider.find(function(err, riders) {
    res.render('rider/index', {'user': req.user, 'riders': riders});
  });
}
