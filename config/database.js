const mongoose = require('mongoose');

const mongoDB = 'mongodb+srv://api:PTAZjYy8wbYNz9Ss@cluster0.zxfky.mongodb.net/mate';

mongoose 
  .connect(mongoDB, { useNewUrlParser: true }) 
  .then(() => console.log("Connected to MongoDB...")) 
  .catch(err => console.error("Could not connect to MongoDB...")); 

mongoose.Promise = global.Promise;

module.exports = mongoose;