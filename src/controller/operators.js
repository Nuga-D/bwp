// controllers/auth.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const operatorDao = require("../dao/operators");
const operatorService = require("../service/operators");
const config = require("../../config");
const upload = require('../middleware/multer');

module.exports = {
  async createOperator(req, res) {
    const { email, password, role } = req.body;
    const existingOperator = await operatorDao.getOperatorByEmail(email);
    if (existingOperator) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const operator = await operatorService.createOperator(email, hashedPassword, role);
    const token = jwt.sign(
      { operatorId: operator.id, role: operator.role },
      config.secretKey,
      { expiresIn: "1h" }
    );
    res.json({ operator, token });
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const operator = await operatorService.authenticate(email, password);
      const token = jwt.sign(
        { operatorId: operator.id, role: operator.role },
        config.secretKey,
        { expiresIn: "1h" }
      );
      res.json({ operator, token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  async registerOperator(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const operatorId = decodedToken.operatorId;
    const role = decodedToken.role;
    const {
      firstName, lastName, phoneNumber, nationality, state, lga, sex, dob, nin
    } = req.body;

    try {
      if (role !== "operator") {
        return res.status(401).send("Unauthorized");
      }

      const operator = await operatorService.registerOperator(
        operatorId,
        firstName,
        lastName,
        phoneNumber,
        nationality,
        state,
        lga,
        sex,
        dob,
        nin
      );
      res
        .status(200)
        .send(
          `operator ${operator.id} registered successfully, an email will be sent upon verification`
        );
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  },

  async addPicture(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const operatorId = decodedToken.operatorId;
    const role = decodedToken.role;
    const picture = req.picture;

    try {
      if (role !== "operator") {
        return res.status(401).send("Unauthorized");
      }

      const operator = await operatorService.addPicture(picture, operatorId);
      res
        .status(200)
        .send(
          `operator ${operator.id} picture added successfully, an email will be sent upon verification`
        );
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }

  } 
};
