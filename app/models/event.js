// // // Example model

// var mongoose = require('mongoose'),
//   Schema = mongoose.Schema;
//   ObjectId = Schema.ObjectId;

// var EventSchema = new Schema({
//   team_id: {type: ObjectId, required: true},
//   date: Date,
//   time: Date,
//   location: String,
//   type: String
// });

// // do one for team_id
// // EventSchema.virtual('date')
// //   .get(function(){
// //     //getDate
// //   });

// //  returns an array of Event Objects
// EventSchema.statics.getByTeamId = function(team_id, callback) {
//   this.find({team_id: team_id}, function(err, events){
//     callback(err, events);
//   });
// };

// // EventSchema.virtual('date')
// //   .get(function(){
// //     var date = this.date.getMonth() + '/' + this.date.getDate() + '/' + this.date.getYear();
// //     return date;
// //   });

// // EventSchema.virtual('time').get(function(){
// // 	//getTime
// // });

// Event = mongoose.model('Event', EventSchema);
// //check
// module.exports = Event;



// // Example model

 var mongoose = require('mongoose'),
   Schema = mongoose.Schema,
   ObjectId = Schema.ObjectId;

 var EventSchema = new Schema({
    team_id: {type: ObjectId, required: false},
    date: {type: Date, required: false},
    time: {type: Date, required: false},
    location: {type: String, required: false},
    type: {type: String, required: false}
 });

 // TeamSchema.method('players').get(function(){
  
 // })

mongoose.model('Event', EventSchema);



// Event = mongoose.model('Event', EventSchema);
// //check
// module.exports = Event;