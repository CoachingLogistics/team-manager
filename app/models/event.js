// // Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;

var EventSchema = new Schema({
  team_id: ObjectId,
  date: Date,
  time: Date,
  location: String,
  type: String
});

// do one for team_id
// EventSchema.virtual('date')
//   .get(function(){
//     //getDate
//   });

EventSchema.virtual('date')
  .get(function(){
    var date = this.date.getMonth() + '/' + this.date.getDate() + '/' + this.date.getYear();
    return date;
  });

EventSchema.virtual('time').get(function(){
	//getTime
});

EventSchema.virtual('location').get(function(){
	//location?
	return "location?";
});

EventSchema.virtual('type').get(function(){
	//type?
	return "type?";
});

mongoose.model('Event', EventSchema);
