const express = require('express');
const router = express.Router();
const questionnaireController = require('../controllers/questionnaires');
const ratioEstimationController = require('../controllers/ratioEstimation');
const ratioEstimationConformityController = require('../controllers/ratioEstimationConformity');

router.post('/add', questionnaireController.create);
router.post('/add/ratio', ratioEstimationController.create);
router.post('/add/ratio-conformity', ratioEstimationConformityController.create);

module.exports = router;