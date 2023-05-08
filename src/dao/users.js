const pool = require("../db/pool");
const idGen = require("../middleware/generateId");

module.exports = {
  async createUser(email, password, role) {
    const sql =
      "INSERT INTO users (id, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())";
    if (toString(role) === "admin") {
      const id = await idGen.generateAdminId();
      return id;
    } else if (toString(role) === "operator") {
        const id = await idGen.generateOperatorId();
        return id;
    } else if (toString(role) === "FO") {
        const id = await idGen.generateFOsId();
        return id;
    } else if (toString(role) === "TGL") {
        const id = await idGen.generateTGLsId();
        return id;
    } else if (toString(role) === "member") {
        const id = await idGen.generateMemberId();
        return id;
    }
    const values = [id, email, password, role];
    const [result] = await pool.execute(sql, values);
    return { id, email, role };
  },

  async getUserById(id) {
    const sql = "SELECT * FROM users WHERE id = ?";
    const values = [id];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getUserByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    const values = [email];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getAllUsers() {
    const sql = "SELECT * FROM users";
    const [result] = await pool.execute(sql);
    return result;
  },
};
