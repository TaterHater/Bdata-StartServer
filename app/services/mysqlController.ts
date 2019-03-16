const mysql = require("mysql2");

export const connection = mysql.createConnection({
  host: "192.168.0.15",
  port: "3006",
  user: "root",
  password: "raspberry",
  database: "Beecon"
});

module.exports = connection;
