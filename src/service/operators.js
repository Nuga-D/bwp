// service/auth.js

const bcrypt = require("bcrypt");
const operatorDao = require('../dao/operators');

module.exports = {
  async createOperator(email, password, role) {
    return await operatorDao.createOperator(email, password, role);
  },
  
  async getOperatorById(id) {
    return await operatorDao.getOperatorById(id);
  },

  async registerOperator(operator_id, firstName, lastName, phoneNumber, nationality, state, lga, sex, dob, nin) {
    return await operatorDao.registerOperator(operator_id, firstName, lastName, phoneNumber, nationality, state, lga, sex, dob, nin);
  },

  async addPicture(picture, operator_id) {
    return await operatorDao.addPicture(picture, operator_id);
  },
  
  async getOperatorByEmail(email) {
    return await operatorDao.getOperatorByEmail(email);
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
};




