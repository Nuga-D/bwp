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

  async getFOByID(nin, bvn, gov_id) {
    return await foDao.getFOByID(nin, bvn, gov_id);
  },

  async getFOIdsForSession() {
    return await foDao.getFOIdsForSession();
  },

  async getFODetails() {
    return await foDao.getFODetails();
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
