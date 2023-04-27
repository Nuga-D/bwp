// controllers/auth.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const operatorDao = require("../dao/operators");
const operatorService = require("../service/operators");
const config = require("../../config");
const upload = require("../middleware/multer");
const validation = require("../middleware/validation");
const states = require("../dao/states");
const seeds = require("../dao/seeds");

module.exports = {
  async createOperator(req, res) {
    const { error, value } = validation.createUserValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, role } = value;

    const existingOperator = await operatorDao.getOperatorByEmail(email);

    if (existingOperator) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const operator = await operatorService.createOperator(
        email,
        hashedPassword,
        role
      );
      const token = jwt.sign(
        { operatorId: operator.id, role: operator.role },
        config.secretKey,
        { expiresIn: "30d" }
      );
      res.json({ operator, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating operator" });
    }
  },

  async login(req, res) {
    const { error, value } = validation.loginValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;
    try {
      const inOperator = await operatorService.authenticate(email, password);
      const verified = await operatorService.getVerification(inOperator.id);
      const token = jwt.sign(
        { operatorId: inOperator.id, role: inOperator.role, verified: verified },
        config.secretKey,
        { expiresIn: "30d" }
      );
      const operator = {
        id: inOperator.id,
        email: inOperator.email,
        role: inOperator.role,
      };
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

    const { error, value } = validation.registerOperatorSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {
      firstName,
      lastName,
      phoneNumber,
      nationality,
      state,
      lga,
      sex,
      dob,
      nin,
    } = value;

    // Check if the selected LGA belongs to the selected state
    
    try {
      if (role !== "operator") {
        return res.status(401).send("Unauthorized");
      }

      if (!states[state].includes(lga)) {
        return res.status(500).send("Selected LGA does not belong to the selected state");
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

  async selectProduct(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const operatorId = decodedToken.operatorId;
    const role = decodedToken.role;
    const verified = parseInt(decodedToken.verified);

    const { error, value } = validation.selectProductSchema.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const {product, seedType} = value;

    try {
      if (role !== "operator") {
        return res.status(401).send("Unauthorized");
      }

      if (verified === 1) {
        return res.status(401).send("Request verification from admin to progress!");
      }

      if (!seeds[product].includes(seedType)) {
        return res.status(500).send("Selected ssed type does not belong to the selected product");
      }

      const productAdd = await operatorService.selectProduct(product, seedType, operatorId);

      res
        .status(200)
        .send(
          `Product ${product} with seed type ${seedType} has been slsected for operator ${operatorId}, further directions will be sent via email`
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
      upload.single("picture")(req, res, async function (err) {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal server error");
        }

        // Get the picture file from the request object
        const picture = req.file;

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
  },
};
