const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RatioEstimationSchema = new Schema({
  data: {
    type: Object
  },
});

module.exports = mongoose.model('RatioEstimation', RatioEstimationSchema);