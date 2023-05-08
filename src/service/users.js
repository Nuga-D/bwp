// service/users.js

const bcrypt = require("bcrypt");
const userDao = require('../dao/users');

module.exports = {
  async createUser(email, password, role) {
    return await userDao.createUser(email, password, role);
  },
  
  async getUserById(id) {
    return await userDao.getAdminById(id);
  },
  
  async getUserByEmail(email) {
    return await userDao.getUserByEmail(email);
  },

  async authenticate(email, password) {
    const user = await userDao.getUserByEmail(email);
    if (!user) {
      throw new Error("user not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    return user;
  },
};