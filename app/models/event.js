
// Synchronously load model dependecies, so foreign model calls can be made
var fs = require('fs');
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file);
})

 var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;
 var Team = mongoose.model('Team');

 var EventSchema = new Schema({
    team_id: {type: ObjectId, required: false},
    date: {type: Date, required: false},
    //time: {type: Date, required: false},
    location: {type: String, required: false},
    type: {type: String, required: false}
 });

 // TeamSchema.method('players').get(function(){
  
 // })


//test
EventSchema.statics.getByTeamId = function(team_id, callback) {
	this.find({team_id: team_id}, function(err, events){
		callback(err, events);
	});
};

//test this
EventSchema.methods.getTeam = function (callback) {
	Team.find({_id: this.team_id}, function(err, team){
		callback(team);
	})
};






mongoose.model('Event', EventSchema);



// Event = mongoose.model('Event', EventSchema);
// //check
// module.exports = Event;