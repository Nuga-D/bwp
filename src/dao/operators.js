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
    const sql = "INSERT INTO operator_product (product, seed_type, operator_id) VALUES (?, ?, ?)";
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

  async getAllProducts() {
    const sql = 'SELECT * FROM products';
    const [result] = await pool.execute(sql);
    return result;
  },

  async getProductIdByName(productName) {
    const sql = 'SELECT id FROM products WHERE productName = ?';
    const [result] = await pool.execute(sql, [productName]);
    return result;
  },

  async getSeedTypes() {
    const sql = 'SELECT * FROM seed_types';
    const [result] = await pool.execute(sql);
    return result;
  },

  async getSeedType(seedType) {
    const sql = 'SELECT * FROM seed_types WHERE name = ?';
    const [result] = await pool.execute(sql, [seedType]);
    return result;
  },

  async getAllStates() {
    const sql = 'SELECT * FROM states';
    const[result] = await pool.execute(sql);
    return result;
  },

  async getStateIdByName(stateName) {
    const sql = 'SELECT id FROM states WHERE name = ?';
    const [result] = await pool.execute(sql, [stateName]);
    return result;
  },

  async getLgas() {
    const sql = 'SELECT * FROM lgas';
    const [result] = await pool.execute(sql);
    return result;
  },

  async getLga(lga) {
    const sql = 'SELECT * FROM lgas WHERE name = ?';
    const [result] = await pool.execute(sql, [lga]);
    return result;
  }
};
