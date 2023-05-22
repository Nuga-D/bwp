// service/admins.js

const bcrypt = require("bcrypt");
const adminDao = require('../dao/admins');
const {parseSpreadsheet} = require('../middleware/parseSpreadsheet');

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

  async generateRandomQuestions(numQuestionsPerCategory) {
    const questions = await adminDao.getTestQuestions();
  
    const categories = {
      A: [],
      B: [],
      C: [],
    };
  
    questions.forEach((question) => {
      const { question: questionText, category, options } = question;
      if (categories[category]) {
      categories[category].push({ question: questionText, options });
      }
      });
  
    const selectedQuestions = [];
    Object.values(categories).forEach((categoryQuestions) => {
      const shuffledQuestions = categoryQuestions.sort(() => Math.random() - 0.5);
      const selectedCategoryQuestions = shuffledQuestions.slice(0, numQuestionsPerCategory);
      selectedQuestions.push(...selectedCategoryQuestions);
    });
  
    return selectedQuestions;
  }
};