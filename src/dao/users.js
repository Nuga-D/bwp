const pool = require("../db/pool");
const idGen = require("../middleware/generateId");

module.exports = {
  async createUser(email, password, role) {
    const sql =
      "INSERT INTO users (id, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())";
    let id = "";
    if (role === "admin") {
      id = await idGen.generateAdminId();
    } else if (role === "operator") {
      id = await idGen.generateOperatorId();
    } else if (role === "FO") {
      id = await idGen.generateFOsId();
    } else if (role === "TGL") {
      id = await idGen.generateTGLsId();
    } else if (role === "member") {
      id = await idGen.generateMemberId();
    }
    const values = [id, email, password, role];
    const [result] = await pool.execute(sql, values);
    
  
    // Return the id, email, and role as a result
    return {
      id: id,
      email: email,
      role: role,
    };
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
