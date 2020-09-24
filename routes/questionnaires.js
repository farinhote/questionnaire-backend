const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaires');

router.post('/add', questionnaireController.create);

module.exports = router;