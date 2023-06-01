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
    stateId,
    lgaId,
    sex,
    dob,
    nin
  ) {
    const sql =
      "INSERT INTO operator_profile (operator_id, first_name, last_name, phone_number, nationality, state_id, lga_id, sex, dob, nin, user_picture, created_at, updated_at, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), ?)";
    const picture = "nan";
    const isVerified = "0";
    const values = [
      operator_id,
      firstName,
      lastName,
      phoneNumber,
      nationality,
      stateId,
      lgaId,
      sex,
      dob,
      nin,
      picture,
      isVerified,
    ];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async addOperatorPicture(picture, operator_id) {
    const sql =
      "UPDATE operator_profile SET user_picture = ? WHERE operator_id = ?";
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

  async getRegisteredOperators() {
    const sql = `SELECT u.unique_id, u.email, u.role, op.nin, op.phone_number, op.is_verified
    FROM users u
    LEFT JOIN operator_profile op ON u.unique_id = op.operator_id
    WHERE u.role = 'operator';
    `;
    const [result] = await pool.execute(sql);
    return result;
  },

  async selectProduct(productId, seedTypeId, operatorId) {
    const sql =
      "INSERT INTO operator_product (product_id, seed_type_id, operator_id) VALUES (?, ?, ?)";
    const values = [productId, seedTypeId, operatorId];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getVerification(operatorId) {
    const sql =
      "SELECT is_verified FROM operator_profile WHERE operator_id = ?";
    const values = [operatorId];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getFOsByOperatorId(operatorId) {
    const sql = "SELECT * FROM operator_fo WHERE operator_id = ?";
    const [result] = await pool.execute(sql, [operatorId]);
    return result;
  },

  async getOperatorIdByFOid(foId) {
    const sql = "SELECT operator_id FROM fos_profile WHERE fo_id = ?";
    const values = [foId];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getAllProducts() {
    const sql = "SELECT * FROM products";
    const [result] = await pool.execute(sql);
    return result;
  },

  async getProductIdByName(productName) {
    const sql = "SELECT id FROM products WHERE name = ?";
    const [result] = await pool.execute(sql, [productName]);
    return result[0];
  },

  async getSeedTypes() {
    const sql = "SELECT * FROM seed_types";
    const [result] = await pool.execute(sql);
    return result;
  },

  async getSeedType(seedType) {
    const sql = "SELECT * FROM seed_types WHERE name = ?";
    const [result] = await pool.execute(sql, [seedType]);
    return result[0];
  },

  async getAllStates() {
    const sql = "SELECT * FROM states";
    const [result] = await pool.execute(sql);
    return result;
  },

  async getAllHubs() {
    const sql = "SELECT * FROM hubs";
    const [result] = await pool.execute(sql);
    return result;
  },

  async getStateIdByName(stateName) {
    const sql = "SELECT id FROM states WHERE name = ?";
    const [result] = await pool.execute(sql, [stateName]);
    return result[0];
  },

  async getHubIdByName(hubName) {
    const sql = "SELECT id FROM hubs WHERE label = ?";
    const [result] = await pool.execute(sql, [hubName]);
    return result[0];
  },

  async getLgas() {
    const sql = "SELECT * FROM lgas";
    const [result] = await pool.execute(sql);
    return result;
  },

  async getLga(lga) {
    const sql = "SELECT * FROM lgas WHERE name = ?";
    const [result] = await pool.execute(sql, [lga]);
    return result[0];
  },

  async addFOPicture(picture, fo_id) {
    const sql =
      "UPDATE fos_profile SET gov_id_image = ? WHERE fo_id = ?";
    const values = [picture, fo_id];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },
};
