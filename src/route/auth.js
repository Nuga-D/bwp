// routes/auth.js

const express = require('express');
const router = express.Router();
const operatorController = require('../controller/operators');
const adminController = require('../controller/admin');

router.post('/operators/create', operatorController.createOperator);
router.post('/operators/login', operatorController.login);
router.post('/operators/register', operatorController.registerOperator);
router.patch('/operators/picture', operatorController.addPicture);
router.post('/operators/product', operatorController.selectProduct);
router.post('/admins/register', adminController.createAdmin);
router.post('/admins/login', adminController.login);
router.post('/admins/verify/:operatorId', adminController.verifyOperator);
router.get('/admins/operators', adminController.getAllOperators);







module.exports = router;
