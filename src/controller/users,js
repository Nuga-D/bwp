// controllers/auth.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userService = require("../service/users");
const operatorService = require("../service/operators");
const config = require("../../config");
const validation = require("../middleware/validation");

module.exports = {
  async createUser(req, res) {
    const { error, value } = validation.createUserValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password, role } = value;

    const existingUser = await userService.getUserByEmail(email);

    if (existingUser) {
      res.status(409).json({ message: "Email already exists" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await userService.createUser(email, hashedPassword, role);
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        config.secretKey,
        { expiresIn: "30d" }
      );
      res.json({ user, token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error creating user" });
    }
  },

  async login(req, res) {
    const { error, value } = validation.loginValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = value;
    try {
      const existingUser = await userService.authenticate(email, password);
      const verified = await operatorService.getVerification(existingUser.id);

      if (toString(existingUser.role) === "operator") {
        const token = jwt.sign(
          {
            userId: existingUser.id,
            role: existingUser.role,
            isVerified: verified,
          },
          config.secretKey,
          { expiresIn: "30d" }
        );
        return token;
      } else if(toString(existingUser.role) !== "operator") {
        const token = jwt.sign(
          { userId: existingUser.id, role: existingUser.role },
          config.secretKey,
          { expiresIn: "30d" }
        );
        return token;
      }

      const user = {
        id: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
      };
      res.json({ user, token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  },
};
