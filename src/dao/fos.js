const pool = require("../db/pool");


module.exports = {
  
    async getFOById(id) {
      const sql = "SELECT * FROM users WHERE id = ? AND role = 'FO'";
      const values = [id];
      const [result] = await pool.execute(sql, values);
      return result[0];
    },

    async getAllFOs() {
        const sql = "SELECT * FROM users WHERE role = 'FO'";
        const [result] = await pool.execute(sql);
        return result;
      },
  
    async getFOByEmail(email) {
      const sql = "SELECT * FROM users WHERE email = ? AND role = 'FO'";
      const values = [email];
      const [result] = await pool.execute(sql, values);
      return result[0];
    }

  };