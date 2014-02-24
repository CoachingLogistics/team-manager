// // Example model

 var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

 var TeamSchema = new Schema({
   name: String,
   sport: String,
 });

 // TeamSchema.method('players').get(function(){
 	
 // })

 mongoose.model('Team', TeamSchema);
