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
    try{
    const operator = await operatorService.createOperator(email, hashedPassword, role);
    const token = jwt.sign(
      { operatorId: operator.id, role: operator.role },
      config.secretKey,
      { expiresIn: "1h" }
    );
    res.json({operator, token });} catch(error) {
      console.error(error);
      res.status(500).json({ message: "Error creating operator" });
    }
  },

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const inOperator = await operatorService.authenticate(email, password);
      const token = jwt.sign(
        { operatorId: inOperator.id, role: inOperator.role },
        config.secretKey,
        { expiresIn: "1h" }
      );
      const operator = {
        id: inOperator.id,
        email: inOperator.email,
        role: inOperator.role
      }
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
          `operator ${operatorId} registered successfully, an email will be sent upon verification`
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
  
    try {
      if (role !== "operator") {
        return res.status(401).send("Unauthorized");
      }
  
      // Use multer to get the picture from the request
      upload.single('picture')(req, res, async function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal server error");
        }
  
        // Get the picture file from the request object
        const picture = req.picture;
  
        // Call the service to add the picture
        const operator = await operatorService.addPicture(picture, operatorId);
        res
          .status(200)
          .send(
            `operator ${operatorId} picture added successfully, an email will be sent upon verification`
          );
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  }
};
