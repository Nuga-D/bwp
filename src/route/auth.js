// routes/auth.js

const express = require('express');
const router = express.Router();
const userController = require('../controller/users');
const operatorController = require('../controller/operators');
const adminController = require('../controller/admin');


router.post('/users/create', userController.createUser);
router.post('/users/login', userController.login);
router.post('/operators/register', operatorController.registerOperator);
router.patch('/operators/uploadOperatorPicture', operatorController.addOperatorPicture);
router.patch('/operators/uploadFOPicture/:foId', operatorController.addFOPicture);
router.post('/operators/selectProduct', operatorController.selectProduct);
router.post('/operators/registerFO', operatorController.registerFO);
router.get('/operators/getFOs/:operatorId', operatorController.getFOsByOperatorId);
router.post('/admins/verify/:operatorId', adminController.verifyOperator);
router.get('/admins/getRegisteredOperators', adminController.getRegisteredOperators);
router.get('/admins/getRecruitedFOsByOperatorId', adminController.getRecruitedFOsByOperatorId);
router.get('/admins/getRecruitedFOs', adminController.getAllRecruitedFOs);
router.get('/admins/testQuestions', adminController.getTestQuestions);
router.post('/admins/markAnswers', adminController.markAnswers);
router.post('/admins/retakeTest', adminController.retakeTest);











module.exports = router;
