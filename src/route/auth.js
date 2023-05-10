// routes/auth.js

const express = require('express');
const router = express.Router();
const userController = require('../controller/users');
const operatorController = require('../controller/operators');
const adminController = require('../controller/admin');

router.post('/users/create', userController.createUser);
router.post('/users/login', userController.login);
router.post('/operators/register', operatorController.registerOperator);
router.patch('/operators/uploadPicture', operatorController.addPicture);
router.post('/operators/selectProduct', operatorController.selectProduct);
router.post('/operators/recruit/:foId', operatorController.recruitFO);
router.get('/operators/getFOs/:operatorId', operatorController.getFOsByOperatorId);
router.post('/admins/verify/:operatorId', adminController.verifyOperator);
router.get('/admins/getOperators', adminController.getAllOperators);








module.exports = router;
