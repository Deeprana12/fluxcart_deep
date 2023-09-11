const connection = require("../lib/db");
const moment = require("moment");
const current_timestamp = moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {

  findContact: async (data) => {
    try {
      const { email, phoneNumber } = data;

      const findQuery =
        "SELECT * FROM Contact WHERE email = ? OR phoneNumber = ? ORDER BY 'createdAt', id ASC LIMIT 1";

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

  findContactStrictly: async (data) => {
    try {
      const { email, phoneNumber } = data;

      const findQuery =
        "SELECT * FROM Contact WHERE email = ? AND phoneNumber = ?";

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

  findContactLoosly: async (data) => {
    try {
      const { email, phoneNumber } = data;

      const findQuery =
        `SELECT a.id, a.email, b.phoneNumber
        FROM Contact a
        JOIN Contact b
        ON a.id <> b.id
        WHERE a.email = ? AND b.phoneNumber = ?`;

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

  findPrimaryContact: async (data) => {
    try {
      const { existingContact } = data;

      const primaryQuery = "SELECT * FROM Contact WHERE id = ?";

      const results = await new Promise((resolve, reject) => {
        connection.query(
          primaryQuery,
          [existingContact?.linkedId],
          (err, results) => {
            if (err) {
              console.error("Error creating a new primary contact:", err);
              reject(err);
            } else {
              resolve(results);
            }
          }
        );
      });

      return results;
    } catch (error) {
      throw error;
    }
  },

  findAllRelatedContent: async (data) => {
    try {
      const id = data;
      const secondaryQuery =
        `SELECT * FROM Contact WHERE linkedId = ? OR id = ? ORDER BY "createdAt"`;

      const results = await new Promise((resolve, reject) => {
        connection.query(
          secondaryQuery,
          [id, id],
          (secondaryErr, secondaryResults) => {
            if (secondaryErr) {
              console.error("Error querying secondary contacts:", secondaryErr);
              reject(secondaryErr);
            } else {
              const rowDataPacket = { secondaryResults };
              const jsonData = JSON.parse(JSON.stringify(rowDataPacket));
              resolve(jsonData);
            }
          }
        );
      });

      return results;
    } catch (error) {
      console.error(error);
    }
  },

  createPrimaryContact: async (data) => {
    try {
      const { email, phoneNumber } = data;
      const primaryInsertQuery =
        `INSERT INTO Contact (email, phoneNumber, linkPrecedence, createdAt) VALUES (?, ?, "primary", '${current_timestamp}')`;

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
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Interval Server error" });
    }
  },

  createSecondaryContact: async (data) => {
    try {
      const { email, phoneNumber, existingContact } = data;    
      const insertSecondaryQuery =
        `INSERT INTO Contact (email, phoneNumber, linkPrecedence, linkedId, createdAt) VALUES (?, ?, "secondary", ?, '${current_timestamp}')`;

      const results = await new Promise((resolve, reject) => {
        connection.query(
          insertSecondaryQuery,
          [email, phoneNumber, existingContact?.linkedId ?? existingContact?.id],
          (insertSecondaryErr, insertSecondaryResults) => {
            if (insertSecondaryErr) {
              console.error(
                "Error creating a new secondary contact:",
                insertSecondaryErr
              );
              reject(err);
            } else {
              const newSecondaryContactId = insertSecondaryResults.insertId;
              resolve(newSecondaryContactId);
            }
          }
        );
      });

      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  convertToSecondaryContact: async (data) => {
    try {
      const { email, phoneNumber, existingContact } = data;

      const insertSecondaryQuery =
        `INSERT IGNORE INTO Contact (email, phoneNumber, linkPrecedence, linkedId, createdAt) VALUES (?, ?, "secondary", '${current_timestamp}')`;

      const results = await new Promise((resolve, reject) => {
        connection.query(
          insertSecondaryQuery,
          [email, phoneNumber, existingContact.id],
          (insertSecondaryErr, insertSecondaryResults) => {
            if (insertSecondaryErr) {
              console.error(
                "Error creating a new secondary contact:",
                insertSecondaryErr
              );
              reject(err);
            } else {
              const newSecondaryContactId = insertSecondaryResults.insertId;
              resolve(newSecondaryContactId);
            }
          }
        );
      });

      return results;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

};