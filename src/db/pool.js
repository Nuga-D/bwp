const mysql = require('mysql2/promise');

const dbConfig = {
  host: "localhost",
  user: "root",
  port: "3304",
  password: "Timidade01.",
  database: "bwp",
};

const pool = mysql.createPool(dbConfig);

module.exports = pool;