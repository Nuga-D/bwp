// service/operators.js

const bcrypt = require("bcrypt");
const operatorDao = require('../dao/operators');

module.exports = {
  async getOperatorById(id) {
    return await operatorDao.getOperatorById(id);
  },

  async registerOperator(operator_id, firstName, lastName, phoneNumber, nationality, stateId, lgaId, sex, dob, nin) {
    return await operatorDao.registerOperator(operator_id, firstName, lastName, phoneNumber, nationality, stateId, lgaId, sex, dob, nin);
  },

  async addPicture(picture, operator_id) {
    return await operatorDao.addPicture(picture, operator_id);
  },
  
  async getOperatorByEmail(email) {
    return await operatorDao.getOperatorByEmail(email);
  },

  async getRegisteredOperators() {
    return await operatorDao.getRegisteredOperators();
  },

  async selectProduct(productId, seedTypeId, operatorId) {
    return await operatorDao.selectProduct(productId, seedTypeId, operatorId);
  },

  async getVerification(operatorId) {
    return await operatorDao.getVerification(operatorId);
  },

  async recruitFO(operatorId, foId) {
    return operatorDao.recruitFO(operatorId, foId);
  },

  async getFOsByOperatorId(operatorId) {
    return operatorDao.getFOsByOperatorId(operatorId);
  },

  async authenticate(email, password) {
    const operator = await operatorDao.getOperatorByEmail(email);
    if (!operator) {
      throw new Error("operator not found");
    }
    const passwordMatch = await bcrypt.compare(password, operator.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    return operator;
  },

  async getAllProducts() {
    return operatorDao.getAllProducts();
  },

  async getProductIdByName(productName) {
    return await operatorDao.getProductIdByName(productName);
  },

  async getSeedTypes() {
    return await operatorDao.getSeedTypes();
  },

  async getSeedType(seedType) {
    return await operatorDao.getSeedType(seedType);
  },

  async getAllStates() {
    return operatorDao.getAllStates();
  },

  async getStateIdByName(stateName) {
    return await operatorDao.getStateIdByName(stateName);
  },

  async getLgas() {
    return await operatorDao.getLgas();
  },

  async getLga(lga) {
    return await operatorDao.getLga(lga);
  }
};




