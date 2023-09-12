const connection = require("../lib/db");
const { promisify } = require("util");
const helper = require("../helper");

const query = promisify(connection.query).bind(connection);

module.exports = {
  async findContact(data) {
    const { email, phoneNumber } = data;
    const findQuery = `
      SELECT *
      FROM Contact
      WHERE email = ? OR phoneNumber = ?      
    `;

    try {
      const results = await query(findQuery, [email, phoneNumber]);
      const rowDataPacket = { results };
      const jsonData = JSON.parse(JSON.stringify(rowDataPacket));
      return jsonData;
    } catch (error) {
      console.error("Error querying the database:", error);
      throw error;
    }
  },

  async findContactStrictly(data) {
    const { email, phoneNumber } = data;
    const findQuery = `
      SELECT *
      FROM Contact
      WHERE email = ? AND phoneNumber = ?
    `;

    try {
      const results = await query(findQuery, [email, phoneNumber]);
      const rowDataPacket = { results };
      const jsonData = JSON.parse(JSON.stringify(rowDataPacket));
      return jsonData;
    } catch (error) {
      console.error("Error querying the database:", error);
      throw error;
    }
  },

  async findContactLoosly(data) {
    const { email, phoneNumber } = data;
    const findQuery = `
      SELECT a.*
      FROM Contact a
      JOIN Contact b ON a.id <> b.id
      WHERE a.email = ? AND b.phoneNumber = ?
    `;

    try {
      const results = await query(findQuery, [email, phoneNumber]);
      const rowDataPacket = { results };
      const jsonData = JSON.parse(JSON.stringify(rowDataPacket));
      return jsonData;
    } catch (error) {
      console.error("Error querying the database:", error);
      throw error;
    }
  },

  async findPrimaryContact(data) {
    const { existingContact } = data;
    const primaryQuery = `
      SELECT *
      FROM Contact
      WHERE id = ?
    `;

    try {
      const results = await query(primaryQuery, [existingContact?.linkedId]);
      return results;
    } catch (error) {
      throw error;
    }
  },

  async findAllRelatedContent(id) {
    const secondaryQuery = `
      SELECT *
      FROM Contact
      WHERE linkedId = ? OR id = ?
    `;

    try {
      const secondaryResults = await query(secondaryQuery, [id, id]);
      const rowDataPacket = { secondaryResults };
      const jsonData = JSON.parse(JSON.stringify(rowDataPacket));
      return jsonData;
    } catch (error) {
      console.error("Error querying secondary contacts:", error);
      throw error;
    }
  },

  async createPrimaryContact(data) {
    const { email, phoneNumber } = data;
    const primaryInsertQuery = `
      INSERT INTO Contact (email, phoneNumber, linkPrecedence)
      VALUES (?, ?, "primary")
    `;

    try {
      const results = await query(primaryInsertQuery, [email, phoneNumber]);
      return results.insertId;
    } catch (error) {
      console.error("Error creating a new primary contact:", error);
      throw error;
    }
  },

  async createSecondaryContact(data) {
    const { email, phoneNumber, existingContact } = data;
    const linkedId = existingContact?.linkedId ?? existingContact?.id;
    const insertSecondaryQuery = `
      INSERT INTO Contact (email, phoneNumber, linkPrecedence, linkedId)
      VALUES (?, ?, "secondary", ?)
    `;

    try {
      const results = await query(insertSecondaryQuery, [
        email,
        phoneNumber,
        linkedId,
      ]);
      return results.insertId;
    } catch (error) {
      console.error("Error creating a new secondary contact:", error);
      throw error;
    }
  },

  async convertToSecondaryContact(data) {
    const { email, phoneNumber } = data;
    const insertSecondaryQuery = `
      UPDATE Contact AS c1
      JOIN (
        SELECT
          CASE WHEN c1.createdAt > c2.createdAt THEN c1.id ELSE c2.id END AS last_created_id,
          CASE WHEN c1.createdAt < c2.createdAt THEN c1.id ELSE c2.id END AS first_created_id
          FROM Contact AS c1
          JOIN Contact AS c2
          ON c1.id <> c2.id
          WHERE c1.email = ? AND c2.phoneNumber = ?
          GROUP BY c1.id, c2.id
          ) AS subquery
            ON c1.id = subquery.last_created_id
            SET c1.linkedId = subquery.first_created_id,            
            c1.linkPrecedence = 'secondary'        
    `;

    try {
      const insertSecondaryResults = await query(insertSecondaryQuery, [
        email,
        phoneNumber,
      ]);
      return insertSecondaryResults;
    } catch (error) {
      console.error("Error converting to secondary contact:", error);
      throw error;
    }
  },
};
