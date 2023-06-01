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

  async getRegisteredFOsByOperatorId(operatorId) {
    const sql = `SELECT fo_id, first_name, last_name
      FROM fos_profile 
      WHERE operator_id = ?`;
    const values = [operatorId];
    const [result] = await pool.execute(sql, values);
    return result;
  },

  async getAllRegisteredFOs() {
    const sql = `SELECT
    fos_profile.operator_id,
    JSON_OBJECT(
      'operator_first_name', operator_profile.first_name,
      'operator_last_name', operator_profile.last_name,
      'operator_email', operator_user.email,
      'fos', JSON_ARRAYAGG(
        JSON_OBJECT(
          'fo_id', IFNULL(fos_profile.fo_id, ''),
          'fo_first_name', IFNULL(fos_profile.first_name, ''),
          'fo_last_name', IFNULL(fos_profile.last_name, ''),
          'fo_nin', IFNULL(fos_profile.nin, ''),
          'fo_bvn', IFNULL(fos_profile.bvn, ''),
          'fo_gov_id', IFNULL(fos_profile.gov_id, '')
        )
      )
    ) AS operator_fos
  FROM fos_profile
  JOIN users AS operator_user ON operator_user.unique_id = fos_profile.operator_id
  LEFT JOIN operator_profile ON operator_profile.operator_id = fos_profile.operator_id
  GROUP BY fos_profile.operator_id, operator_profile.first_name, operator_profile.last_name, operator_user.email;     
    `;
    const [result] = await pool.execute(sql);
    return result;
  },

  async getTestQuestions() {
    const sql = "SELECT * FROM questions";
    const [result] = await pool.execute(sql);
    return result;
  },

  async storeGeneratedQuestions(question) {
    const sql = "INSERT INTO generated_questions SET ?";
    const result = await pool.query(sql, [question]);
    return result.insertId;
  },

  async storeFOquestionSession(questionSession) {
    const sql = "INSERT INTO fo_question_sessions SET ?";
    const result = await pool.query(sql, [questionSession]);
    return result[0].insertId;
  },

  async getTestAnswersByIds(questionIds) {
    const placeholders = questionIds.map(() => "?").join(",");
    const sql = `SELECT id, answer FROM questions WHERE id IN (${placeholders})`;
    const [rows] = await pool.execute(sql, questionIds);
    return rows;
  },

  async verifySessionId(foId) {
    const sql =
      "SELECT session_id FROM fo_question_sessions WHERE fo_id = ?";
    const values = [foId];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async insertFOscore(score, foId) {
    const sql =
      "UPDATE fo_question_sessions SET fo_score = ? WHERE fo_id = ?";
    const values = [score, foId];
    const [result] = await pool.query(sql, values);
    return {
      foId: foId,
      score: score,
    };
  },

  async insertFoResponse(sessionId, response, questionId) {
    const sql = 'UPDATE generated_questions SET response = ? WHERE session_id = ? AND original_question_id = ?';
    const values = [response, sessionId, questionId];
    const [result] = await pool.query(sql, values);
    return result;
  },

  async deleteFOscore(FOid) {
    const sql = "DELETE FROM fo_score WHERE fo_id = ?";
    const values = [FOid];
    const [result] = await pool.execute(sql, values);
    return {
      foId: FOid,
    };
  },
};
