// service/operators.js

const bcrypt = require("bcrypt");
const operatorDao = require("../dao/operators");
const foDao = require("../dao/fos");

module.exports = {
  async getOperatorById(id) {
    return await operatorDao.getOperatorById(id);
  },

  async registerOperator(
    operator_id,
    firstName,
    lastName,
    phoneNumber,
    nationality,
    stateId,
    lgaId,
    sex,
    dob,
    nin
  ) {
    return await operatorDao.registerOperator(
      operator_id,
      firstName,
      lastName,
      phoneNumber,
      nationality,
      stateId,
      lgaId,
      sex,
      dob,
      nin
    );
  },

  async addOperatorPicture(picture, operator_id) {
    return await operatorDao.addOperatorPicture(picture, operator_id);
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

  async getFOsByOperatorId(operatorId) {
    return operatorDao.getFOsByOperatorId(operatorId);
  },

  async getOperatorIdByFOid(FOid) {
    return await operatorDao.getOperatorIdByFOid(FOid);
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

  async getAllHubs() {
    return operatorDao.getAllHubs();
  },

  async getStateIdByName(stateName) {
    return await operatorDao.getStateIdByName(stateName);
  },

  async getHubIdByName(hubName) {
    return await operatorDao.getHubIdByName(hubName);
  },

  async getLgas() {
    return await operatorDao.getLgas();
  },

  async getLga(lga) {
    return await operatorDao.getLga(lga);
  },

  async registerFO(
    firstName,
    lastName,
    phoneNumber,
    sex,
    dob,
    bvn,
    nin,
    stateId,
    lgaId,
    hub,
    GovID,
    GovIDtype,
    GovIDimage,
    operatorId
  ) {
    return await foDao.registerFO(
      firstName,
      lastName,
      phoneNumber,
      sex,
      dob,
      bvn,
      nin,
      stateId,
      lgaId,
      hub,
      GovID,
      GovIDtype,
      GovIDimage,
      operatorId
    );
  },

  async addFOPicture(picture, fo_id) {
    return await operatorDao.addFOPicture(picture, fo_id);
  },

  async getRecruitedFOs() {
    return await operatorDao.getRecruitedFOs();
  }
  
};
