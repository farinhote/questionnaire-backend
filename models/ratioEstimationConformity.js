const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RatioEstimationConformitySchema = new Schema({
  data: {
    type: Object
  },
});

module.exports = mongoose.model('RatioEstimationConformity', RatioEstimationConformitySchema);