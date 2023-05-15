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
  },

  async registerFO(
    fo_id,
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
    GovIDtype
  ) {
    const sql =
      "INSERT INTO fos_profile (fo_id, first_name, last_name, phone_number, sex, dob, bvn, nin, state_id, lga_id, hub, gov_id, gov_id_type, gov_id_image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())";
    const picture = "nan";
    const values = [
      fo_id,
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
      picture,
    ];
    const [result] = await pool.execute(sql, values);
    return result[0];
  },
};
