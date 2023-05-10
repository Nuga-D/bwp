const pool = require("../db/pool");


module.exports = {
   
    async getAdminById(id) {
      const sql = "SELECT * FROM users WHERE id = ? AND role = 'ADMIN'";
      const values = [id];
      const [result] = await pool.execute(sql, values);
      return result[0];
    },
  
    async getAdminByEmail(email) {
      const sql = "SELECT * FROM users WHERE email = ? AND role = 'ADMIN'";
      const values = [email];
      const [result] = await pool.execute(sql, values);
      return result[0];
    },

    async verifyOperator(verified, operatorId) {
      const sql = "UPDATE operator_profile SET is_verified = ? WHERE operator_id = ?";
      const values = [verified, operatorId]
      const [result] = await pool.execute(sql, values);
      return result[0];
    },

  };