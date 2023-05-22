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
    const sql =
      "UPDATE operator_profile SET is_verified = ? WHERE operator_id = ?";
    const values = [verified, operatorId];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getRecruitedFOsByOperatorId(operatorId) {
    const sql = `SELECT of.fo_id, f.first_name, f.last_name, u.email
      FROM operator_fo of
      JOIN users u ON u.unique_id = of.fo_id
      LEFT JOIN fos_profile f ON f.fo_id = of.fo_id
      WHERE of.operator_id = ?`;
    const values = [operatorId];
    const [result] = await pool.execute(sql, values);
    return result;
  },

  async getAllRecruitedFOs() {
    const sql = `SELECT
    operator_fo.operator_id,
    JSON_OBJECT(
      'operator_first_name', operator_profile.first_name,
      'operator_last_name', operator_profile.last_name,
      'operator_email', operator_user.email,
      'fos', JSON_ARRAYAGG(
        JSON_OBJECT(
          'fo_id', IFNULL(operator_fo.fo_id, ''),
          'fo_first_name', IFNULL(fos_profile.first_name, ''),
          'fo_last_name', IFNULL(fos_profile.last_name, ''),
          'fo_email', IFNULL(fo_user.email, '')
        )
      )
    ) AS operator_fos
  FROM operator_fo
  LEFT JOIN fos_profile ON fos_profile.fo_id = operator_fo.fo_id
  LEFT JOIN users AS fo_user ON fo_user.unique_id = operator_fo.fo_id
  JOIN users AS operator_user ON operator_user.unique_id = operator_fo.operator_id
  LEFT JOIN operator_profile ON operator_profile.operator_id = operator_fo.operator_id
  GROUP BY operator_fo.operator_id, operator_profile.first_name, operator_profile.last_name, operator_user.email;     
    `;
    const [result] = await pool.execute(sql);
    return result;
  },

  async getTestQuestions() {
    const sql = 'SELECT * FROM questions';
    const [result] = await pool.execute(sql);
    return result;
  }
};
