const connection = require("../lib/db");

module.exports = {
  findContact: async (data) => {
    try {
      const { email, phoneNumber } = data;

      const findQuery =
        "SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?";

      const results = await new Promise((resolve, reject) => {
        connection.query(findQuery, [email, phoneNumber], (err, results) => {
          if (err) {
            console.error("Error querying the database:", err);
            reject(err);
          } else {
            const rowDataPacket = { results };
            const jsonData = JSON.parse(JSON.stringify(rowDataPacket));
            resolve(jsonData);
          }
        });
      });

      return results;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  addPrimaryContact: async (data) => {
    try {
      const { email, phoneNumber } = data;

      const primaryInsertQuery =
        'INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES (?, ?, "primary")';

      const results = await new Promise((resolve, reject) => {
        connection.query(
          primaryInsertQuery,
          [email, phoneNumber],
          (err, results) => {
            if (err) {
              console.error("Error creating a new primary contact:", err);
              reject(err);
            } else {
              const newContactId = results.insertId;
              resolve(newContactId);
            }
          }
        );
      });

      return results;
    } catch (error) {}
  },
};