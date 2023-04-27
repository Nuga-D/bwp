// controllers/auth.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const adminDao = require("../dao/admins");
const adminService = require("../service/admins");
const operatorService = require("../service/operators");
const config = require("../../config");
const validation = require("../middleware/validation");

module.exports = {
  async createAdmin(req, res) {
    const { error, value } = validation.createUserValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, role } = value;
    const existingAdmin = await adminDao.getAdminByEmail(email);
    if (existingAdmin) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      const admin = await adminService.createAdmin(email, hashedPassword, role);
      const token = jwt.sign(
        { adminId: admin.id, role: admin.role },
        config.secretKey,
        { expiresIn: "30d" }
      );
      res.json({ admin, token });
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
      const inAdmin = await adminService.authenticate(email, password);
      const token = jwt.sign(
        { adminId: inAdmin.id, role: inAdmin.role },
        config.secretKey,
        { expiresIn: "30d" }
      );
      const admin = {
        id: inAdmin.id,
        email: inAdmin.email,
        role: inAdmin.role,
      };
      res.json({ admin, token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },

  async verifyOperator(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const adminId = decodedToken.adminId;
    const operatorId = req.params.operatorId;
    const role = decodedToken.role;
    const { verified } = req.body;

    try {
      if (role !== "admin") {
        return res.status(401).send("Unauthorized");
      }

      const verify = await adminService.verifyOperator(
        operatorId,
        adminId,
        verified
      );
      res
        .status(200)
        .send(
          `operator ${operatorId} verified successfully by admin ${adminId}, an email will be sent to the affected operator`
        );
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  },

  async getAllOperators(req, res) {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, config.secretKey);
    const role = decodedToken.role;
    try {
      if (role !== "admin") {
        return res.status(401).send("Unauthorized");
      }
      const operators = await operatorService.getAllOperators();
      res.json({operators});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating operator" });
    }

  }
};
