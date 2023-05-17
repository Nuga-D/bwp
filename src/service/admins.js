// service/admins.js

const bcrypt = require("bcrypt");
const adminDao = require('../dao/admins');

module.exports = {  
  async getAdminById(id) {
    return await adminDao.getAdminById(id);
  },
  
  async getAdminByEmail(email) {
    return await adminDao.getAdminByEmail(email);
  },

  async verifyOperator(verified, operatorId) {
    return await adminDao.verifyOperator(verified, operatorId);
  },

  async getRecruitedFOsByOperatorId(operatorId) {
    return await adminDao.getRecruitedFOsByOperatorId(operatorId);
  },

  async getAllRecruitedFOs() {
    return await adminDao.getAllRecruitedFOs();
  },

  async authenticate(email, password) {
    const admin = await adminDao.getAdminByEmail(email);
    if (!admin) {
      throw new Error("admin not found");
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    return admin;
  },
};