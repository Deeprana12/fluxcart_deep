const connection = require("../lib/db");

const createTriggerQuery = `
  DROP TRIGGER IF EXISTS set_createdAt;
  CREATE TRIGGER set_createdAt
  BEFORE INSERT ON Contact FOR EACH ROW
  BEGIN
      SET NEW.createdAt = NOW();
      SET NEW.updatedAt = NOW();
  END;
  
  DROP TRIGGER IF EXISTS set_updatedAt;
  CREATE TRIGGER set_updatedAt
  BEFORE UPDATE ON Contact FOR EACH ROW
  BEGIN
      SET NEW.updatedAt = NOW();
  END;
`;

const createTriggers = () => {
  connection.query(createTriggerQuery, (triggerError) => {
    if (triggerError) {
      console.error("Error creating triggers:", triggerError);
    } else {
      console.log('Triggers created successfully');
    }
  });
};

module.exports = { createTriggers };
