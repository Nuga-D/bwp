// service/admins.js

const bcrypt = require("bcrypt");
const adminDao = require("../dao/admins");
const { parseSpreadsheet } = require("../middleware/parseSpreadsheet");

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

  async getRegisteredFOsByOperatorId(operatorId) {
    return await adminDao.getRegisteredFOsByOperatorId(operatorId);
  },

  async getAllRegisteredFOs() {
    return await adminDao.getAllRegisteredFOs();
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
      const { id, question: questionText, category, options } = question;
      if (categories[category]) {
        categories[category].push({ id, question: questionText, options });
      }
    });

    const selectedQuestions = [];
    Object.values(categories).forEach((categoryQuestions) => {
      const shuffledQuestions = categoryQuestions.sort(
        () => Math.random() - 0.5
      );
      const selectedCategoryQuestions = shuffledQuestions.slice(
        0,
        numQuestionsPerCategory
      );
      selectedQuestions.push(...selectedCategoryQuestions);
    });

    return selectedQuestions.map((question) => ({
      id: question.id,
      ...question,
    }));
  },

  async storeGeneratedQuestions(question) {
    return await adminDao.storeGeneratedQuestions(question);
  },

  async storeFOquestionSession(questionSession) {
    return await adminDao.storeFOquestionSession(questionSession);
  },

  async verifySessionId(foId) {
    return await adminDao.verifySessionId(foId);
  },

  async insertFoResponse(sessionId, response, questionId) {
    return await adminDao.insertFoResponse(sessionId, response, questionId);
  },

  async getTestAnswersByIds(questionIds) {
    return await adminDao.getTestAnswersByIds(questionIds);
  },

  async insertFOscore(score, foId) {
    return await adminDao.insertFOscore(score, foId);
  },

  async deleteFOscore(FOid) {
    return await adminDao.deleteFOscore(FOid);
  },
};
