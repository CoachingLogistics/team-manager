// // Example model

 var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

 var TeamSchema = new Schema({
   name: {type: String, required: true},
   sport: {type: String, required: true}
 });

 // TeamSchema.method('players').get(function(){
 	
 // })

 mongoose.model('Team', TeamSchema);
