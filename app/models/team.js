// // Example model

 var mongoose = require('mongoose'),
   Schema = mongoose.Schema;

 var TeamSchema = new Schema({
   name: String,
   sport: String,
 });

// ArticleSchema.virtual('date')
//   .get(function(){
//     return this._id.getTimestamp();
//   });

 mongoose.model('Team', TeamSchema);
