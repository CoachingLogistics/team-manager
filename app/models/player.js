// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PlayerSchema = new Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  date_of_birth: Date
});

mongoose.model('Article', PlayerSchema);
