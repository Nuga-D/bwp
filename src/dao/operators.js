const pool = require("../db/pool");
const idGen = require("../middleware/generateId");

module.exports = {
  async createOperator(email, password, role) {
    const sql =
      "INSERT INTO operators (id, email, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())";
    const id = await idGen.generateOperatorId();
    const values = [id, email, password, role];
    const [result] = await pool.execute(sql, values);
    return {id, email, role};
  },

  async getOperatorById(id) {
    const sql = "SELECT * FROM operators WHERE id = ?";
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
      "INSERT INTO operator_profile (operator_id, first_name, last_name, phone_number, nationality, state, lga, sex, dob, nin, user_picture, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
    const picture = "nan";
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
    ];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async addPicture(picture, operator_id) {
    const sql = "UPDATE operator_profile SET picture = ? WHERE operator_id = ?";
    const values = [picture, operator_id];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getOperatorByEmail(email) {
    const sql = "SELECT * FROM operators WHERE email = ?";
    const values = [email];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },
};
