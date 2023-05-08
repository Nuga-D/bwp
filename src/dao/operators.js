const pool = require("../db/pool");

module.exports = {

  async getOperatorById(id) {
    const sql = "SELECT * FROM users WHERE id = ? AND role = 'operator'";
    const values = [id];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async registerOperator(
    operator_id,
    firstName,
    lastName,
    phoneNumber,
    nationality,
    state,
    lga,
    sex,
    dob,
    nin
  ) {
    const sql =
      "INSERT INTO operator_profile (operator_id, first_name, last_name, phone_number, nationality, state, lga, sex, dob, nin, user_picture, created_at, updated_at, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)";
    const picture = "nan";
    const isVerified = "false";
    const values = [
      operator_id,
      firstName,
      lastName,
      phoneNumber,
      nationality,
      state,
      lga,
      sex,
      dob,
      nin,
      picture,
      isVerified
    ];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async addPicture(picture, operator_id) {
    const sql = "UPDATE operator_profile SET user_picture = ? WHERE operator_id = ?";
    const values = [picture, operator_id];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getOperatorByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ? AND role = 'operator'";
    const values = [email];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getAllOperators() {
    const sql = "SELECT * FROM users WHERE role = 'operator'";
    const [result] = await pool.execute(sql);
    return result;
  },

  async selectProduct(product, seedType, operatorId) {
    const sql = "INSERT INTO product (product, seed_type, operator_id) VALUES (?, ?, ?)";
    const values = [product, seedType, operatorId];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getVerification(operatorId) {
    const sql = "SELECT is_verified FROM operator_profile WHERE operator_id = ?";
    const values = [operatorId];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async recruitFO(operatorId, foId) {
    const sql = 'INSERT INTO operator_fo (operator_id, fo_id) VALUES (?, ?)';
    const [result] = await pool.execute(sql, [operatorId, foId]);
    return result[0];
  },

  async getFOsByOperatorId(operatorId) {
    const sql = 'SELECT * FROM operator_fo WHERE operator_id = ?';
    const [result] = await pool.execute(sql, [operatorId]);
    return result;
  },
};
