const QuestionnaireModel = require('../models/Questionnaires');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    create: function (req, res, next) {
        /* Handle data */

        QuestionnaireModel.create({ name: req.body.name }, function (err, result) {
            if (err) {
                next(err);
            }
            else {
                res.json({ status: "success", message: "Questionnaire added successfully!", data: null });
            }
        });
    },
}