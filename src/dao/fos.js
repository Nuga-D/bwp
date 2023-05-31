const pool = require("../db/pool");
const idGen = require("../middleware/generateId");

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
  },

  async getFOByID(nin, bvn, gov_id) {
    const sql = "SELECT fo_id, first_name, last_name FROM fos_profile WHERE nin = ? OR bvn = ? OR gov_id = ?";
    const values = [nin, bvn, gov_id];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },

  async getFODetails() {
    const sql = 'SELECT phone_number, bvn, nin, gov_id FROM fos_profile';
    const [result] = await pool.execute(sql);
    return result;
  },

  async registerFO(
    firstName,
    lastName,
    phoneNumber,
    sex,
    dob,
    bvn,
    nin,
    stateId,
    lgaId,
    hub,
    GovID,
    GovIDtype,
    GovIDimage,
    operator_id
  ) {
    const foId = await idGen.generateFOsId();
    const sql =
      "INSERT INTO fos_profile (fo_id, first_name, last_name, phone_number, sex, dob, bvn, nin, state_id, lga_id, hub_id, gov_id, gov_id_type, gov_id_image, operator_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
    const values = [
      foId,
      firstName,
      lastName,
      phoneNumber,
      sex,
      dob,
      bvn,
      nin,
      stateId,
      lgaId,
      hub,
      GovID,
      GovIDtype,
      GovIDimage,
      operator_id
    ];
    const [result] = await pool.execute(sql, values);
    return {foId};
  },
};
