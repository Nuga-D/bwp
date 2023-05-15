// service/admins.js

const bcrypt = require("bcrypt");
const foDao = require("../dao/fos");

module.exports = {
  async getFOById(id) {
    return await foDao.getFOById(id);
  },

  async getAllFOs() {
    return await foDao.getAllFOs();
  },

  async getFOByEmail(email) {
    return await foDao.getFOByEmail(email);
  },

  async authenticate(email, password) {
    const fo = await foDao.getFOByEmail(email);
    if (!fo) {
      throw new Error("Field Officer not found");
    }
    const passwordMatch = await bcrypt.compare(password, fo.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    return fo;
  },
};
