const mysql = require('mysql2/promise');

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "Timidade01.",
  database: "bwp",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;