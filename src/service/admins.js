// service/admins.js

const bcrypt = require("bcrypt");
const adminDao = require('../dao/admins');

module.exports = {
  async createAdmin(email, password, role) {
    return await adminDao.createAdmin(email, password, role);
  },
  
  async getAdminById(id) {
    return await adminDao.getAdminById(id);
  },
  
  async getAdminByEmail(email) {
    return await adminDao.getAdminByEmail(email);
  },

  async verifyOperator(operatorId, adminId, verified) {
    return await adminDao.verifyOperator(operatorId, adminId, verified);
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