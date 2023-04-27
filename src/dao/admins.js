const pool = require("../db/pool");
const idGen = require("../middleware/generateId");

module.exports = {
    async createAdmin(email, password, role) {
      const sql =
        "INSERT INTO admin (id, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())";
      const id = await idGen.generateAdminId();
      const values = [id, email, password, role];
      const [result] = await pool.execute(sql, values);
      return {id, email, role};
    },
  
    async getAdminById(id) {
      const sql = "SELECT * FROM admin WHERE id = ?";
      const values = [id];
      const [result] = await pool.execute(sql, values);
      return result[0];
    },
  
    async getAdminByEmail(email) {
      const sql = "SELECT * FROM admin WHERE email = ?";
      const values = [email];
      const [result] = await pool.execute(sql, values);
      return result[0];
    },

    async verifyOperator(operatorId, adminId, verified) {
      const sql = "INSERT INTO verify (operator_id, verified_by, verified, verified_at, verification_updated_at) VALUES (?, ?, ?, NOW(), NOW())";
      const values = [operatorId, adminId, verified]
      const [result] = await pool.execute(sql, values);
      return result[0];
    },

  };