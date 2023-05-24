// controllers/auth.js

const jwt = require("jsonwebtoken");
const adminService = require("../service/admins");
const operatorService = require("../service/operators");
const foService = require("../service/fos");
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
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const role = decodedToken.role;
    const numQuestionsPerCategory = 5;

    try {
      if (role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      adminService
        .generateRandomQuestions(numQuestionsPerCategory)
        .then((questions) => {
          res.json({ TestQuestions: questions });
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error generating test questions" });
    }
  },

  async markAnswers(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const role = decodedToken.role;
    const adminId = decodedToken.userId;
    const nin = req.body.nin;
    const bvn = req.body.bvn;
    const govId = req.body.gov_id;
    const userAnswers = req.body.userAnswers; // Assuming the answers are sent in the "TestAnswers" array of the request body
    let FOid = "";
    let FOfirstName = "";
    let FOlastName = "";

    try {
      if (role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const FO = await foService.getFOByID(nin, bvn, govId);

      if (FO) {
        FOid = FO.fo_id;
        FOfirstName = FO.first_name;
        FOlastName = FO.last_name;
      } else {
        return res.status(401).json({ message: "FO not yet registered!" });
      }

      const operatorId = await operatorService.getOperatorIdByFOid(FOid);

      const questionIds = userAnswers.map((answer) => answer.id);

      const databaseAnswers = await adminService.getTestAnswersByIds(
        questionIds
      );

      let score = 0;
      const markedQuestions = userAnswers.map((userAnswer) => {
        const { id, answer } = userAnswer;
        const correctAnswer = databaseAnswers.find(
          (ans) => ans.id === id
        )?.answer;

        const isCorrect = userAnswer.answer === correctAnswer;
        if (isCorrect) {
          score++;
        }

        return { id, isCorrect };
      });

      const insertScore = await adminService.insertFOscore(
        adminId,
        FOid,
        operatorId.operator_id,
        score
      );

      if (score < 5) {
        res.json(
          `${FOfirstName} ${FOlastName}, your score is ${score}/15. Sorry this is very low, you cannot proceed`
        );
      } else {
        res.json(
          `${FOfirstName} ${FOlastName}, your score is ${score}/15. You passed the test!`
        );
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error marking answers" });
    }
  },

  async retakeTest(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const role = decodedToken.role;
    const adminId = decodedToken.userId;
    const nin = req.body.nin;
    const bvn = req.body.bvn;
    const govId = req.body.gov_id;
    const retakeTest = req.body.retakeTest;
    let FOid = "";
    let FOfirstName = "";
    let FOlastName = "";

    try {
      if (role !== "admin") {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const FO = await foService.getFOByID(nin, bvn, govId);

      if (FO) {
        FOid = FO.fo_id;
        FOfirstName = FO.first_name;
        FOlastName = FO.last_name;
      } else {
        return res.status(401).json({ message: "FO not yet registered!" });
      }

      const operatorId = await operatorService.getOperatorIdByFOid(FOid);

      if (retakeTest === 'false') {
        return res.status(201).json({ message: "Come back some other time!" });
      }

      const deletedFO = await adminService.deleteFOscore(FOid);

      res.json(`${FOfirstName} ${FOlastName}, you can now retake the test!`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing request!" });
    }
  },
};
