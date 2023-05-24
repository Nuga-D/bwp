const mysql = require('mysql2/promise');

const dbConfig = {
  host: "localhost",
  port: 3304,
  user: "root",
  password: "Timidade01.",
  database: "bwp",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;