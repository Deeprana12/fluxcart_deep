const contactModule = require("../modules/contact.module");

module.exports = {
  addContact: async (req, res) => {
    try {
      const data = req.body;
      const { email, phoneNumber } = data;

      if (!email && !phoneNumber) {
        return res
          .status(400)
          .json({ error: "At least one of email or phoneNumber is required" });
      }

      const userExists = await contactModule?.findContact(data);

      if (userExists?.results?.length == 0) {
        const id = await contactModule?.addPrimaryContact(data);

        return res.status(200).json({
          contact: {
            primaryContactId: id,
            emails: [email],
            phoneNumbers: [phoneNumber],
            secondaryContactIds: [],
          },
        });
      } else {
        const existingContact = userExists?.results[0];

        // if (existingContact?.userExists?.linkPrecedence === "secondary") {

        // } else {
        // }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
