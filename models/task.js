 const mongoose = require('mongoose');
const { schema } = require('./user');
 const taskSchema = new mongoose.Schema ([

 ]);



 module.exports = mongoose.model('Task', taskSchema)