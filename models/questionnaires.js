const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const QuestionnaireSchema = new Schema({
  data: {
    type: Object
  },
});

module.exports = mongoose.model('Questionnaire', QuestionnaireSchema);