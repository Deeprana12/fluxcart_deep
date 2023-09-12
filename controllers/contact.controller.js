const contactModule = require("../modules/contact.module");
const helper = require("../helper");
const constants = require('../constants')

module.exports = {
  addContact: async (req, res) => {
    try {
      const data = req.body;
      const { email, phoneNumber } = data;

      if (!email && !phoneNumber) {
        return res
          .status(400)
          .json({ error: constants?.REQUIRED_FIELD_ERROR });
      }

      if (email && phoneNumber) {
        const userExistsStrictly = await contactModule.findContactStrictly(
          data
        );

        if (userExistsStrictly?.results?.length !== 0) {
          const userData = userExistsStrictly?.results[0];
          return res.status(200).json(await helper.allUsers(userData));
        }

        const userExistsLoosly = await contactModule?.findContactLoosly(data);

        if (userExistsLoosly.results.length !== 0) {
          const looslyUserData = {
            email: email,
            phoneNumber: phoneNumber,
          };
          await contactModule?.convertToSecondaryContact(looslyUserData);
          const userExists = await contactModule.findContact({ email });

          return res
            .status(200)
            .json(await helper.allUsers(userExists.results[0]));
        }
      }

      const userExists = await contactModule.findContact(data);

      if (userExists?.results?.length === 0) {
        const id = await contactModule.createPrimaryContact(data);

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
        if (!email || !phoneNumber) {
          return res.status(200).json(await helper.allUsers(existingContact));
        } else {
          await contactModule.createSecondaryContact({
            email,
            phoneNumber,
            existingContact,
          });
          return res.status(200).json(await helper.allUsers(existingContact));
        }
      }
    } catch (error) {
      handleError(res, error);
    }
  },
};
