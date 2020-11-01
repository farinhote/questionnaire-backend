const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaires');
const ratioEstimationController = require('../controllers/ratioEstimation');

router.post('/add', questionnaireController.create);
router.post('/add/ratio', ratioEstimationController.create);

module.exports = router;