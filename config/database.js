const mongoose = require('mongoose');

const mongoDB = 'mongodb+srv://API_Acess:ZyNxE5CuzQZKqcSq@clusterrsa.vi7da.mongodb.net/test';

mongoose 
  .connect(mongoDB, { useNewUrlParser: true }) 
  .then(() => console.log("Connected to MongoDB...")) 
  .catch(err => console.error("Could not connect to MongoDB...")); 

mongoose.Promise = global.Promise;

module.exports = mongoose;