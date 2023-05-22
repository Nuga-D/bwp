// controllers/auth.js

const jwt = require("jsonwebtoken");
const adminService = require("../service/admins");
const operatorService = require("../service/operators");
const config = require("../../config");

module.exports = {
  async verifyOperator(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const adminId = decodedToken.userId;
    const operatorId = req.params.operatorId;
    const role = decodedToken.role;
    const { isVerified } = req.body;

    try {
      if (role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const verify = await adminService.verifyOperator(isVerified, operatorId);
      res.status(200).json({
        message: `operator ${operatorId} verified successfully by admin ${adminId}, an email will be sent to the affected operator`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async getRegisteredOperators(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const role = decodedToken.role;
    try {
      if (role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const operators = await operatorService.getRegisteredOperators();
      res.json({ operators });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting operator" });
    }
  },

  async getRecruitedFOsByOperatorId(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const role = decodedToken.role;
    const operatorId = req.body.operatorId;
    try {
      if (role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const operator_FO = await adminService.getRecruitedFOsByOperatorId(
        operatorId
      );
      res.json({ operator_FO });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting operator" });
    }
  },

  async getAllRecruitedFOs(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const role = decodedToken.role;
    try {
      if (role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const operator_FO = await adminService.getAllRecruitedFOs();
      res.json({ operator_FO });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error getting operator" });
    }
  },

  async getTestQuestions(req, res) {
    const numQuestionsPerCategory = 5;

    adminService.generateRandomQuestions(numQuestionsPerCategory)
      .then((questions) => {
        res.json({ TestQuestions: questions });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Error generating test questions" });
      });
  },
};
