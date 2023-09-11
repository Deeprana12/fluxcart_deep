const mysql = require("mysql");
require('dotenv').config()

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    insecureAuth : true,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE  
  });    

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS Contact (
  id INT AUTO_INCREMENT PRIMARY KEY,
  phoneNumber VARCHAR(255),
  email VARCHAR(255),
  linkedId INT,
  linkPrecedence ENUM('secondary', 'primary') NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  deletedAt TIMESTAMP
);
`;

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    throw err;
    // return;
  }

  connection.query(createTableQuery, (error) => {
    if (error) {
      console.error("Error creating table:", error);
    } else {
      console.log('Table "Contact" created successfully');
    }
  });
});

module.exports = connection;