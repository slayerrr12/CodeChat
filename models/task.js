var mongoose = require('mongoose');

//write a create a task schema


var taskSchema = new mongoose.Schema({
  content: String
});

module.exports = mongoose.model('Task', taskSchema);
