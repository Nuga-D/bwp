// routes/auth.js

const express = require('express');
const router = express.Router();
const operatorController = require('../controller/operators');

router.post('/operators/create', operatorController.createOperator);
router.post('/operators/login', operatorController.login);
router.post('/operators/register', operatorController.registerOperator);
router.post('/operators/picture', operatorController.addPicture);



module.exports = router;
