// // Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;

var eventSchema = new Schema({
  team_id: ObjectId,
  date: Date,
  time: String,
  location: String,
  type: String
});

eventSchema.virtual('team_id').get(function(){
	//team id?
	return "team id?";
});

eventSchema.virtual('date')
  .get(function(){
    return this._id.getTimestamp();
  });

eventSchema.virtual('time').get(function(){
	//how is time working?
	return "time?";
});

eventSchema.virtual('location').get(function(){
	//location?
	return "location?";
});

eventSchema.virtual('type').get(function(){
	//type?
	return "type?";
});

mongoose.model('Event', eventSchema);
