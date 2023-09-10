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
      // else if(email && phoneNumber){
      //   const userExistsStrictly = await contactModule?.findContactStrictly(data);
      //   if(userExistsStrictly?.results?.length != 0){
      //     console.log(userExistsStrictly)
      //   }              
      // }else if(email){

      // }else if(phoneNumber){

      // }else{
      //   const userExistsStrictly = await contactModule?.findContactStrictly(data);
      //   if(userExistsStrictly?.results?.length != 0){
      //     const parentId = userExistsStrictly?.id;

      //     const 
      //   }
      // }

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
        if(!email || !phoneNumber){

          let id = existingContact?.linkPrecedence === "primary" 
                        ? existingContact?.id : existingContact?.linkedId;

          const results = await contactModule?.getAllRelatedContent(id)

          const secondaryResults = results?.secondaryResults;
          const secondaryEmails = secondaryResults.map((c) => c.email);
          const secondaryPhoneNumbers = secondaryResults.map((c) => c.phoneNumber);
          const secondaryContactIds = secondaryResults.map((c) => c.id);

          let allEmails = email ? [email, ...secondaryEmails] : secondaryEmails;
          allEmails = Array.from(new Set(allEmails))

          let allPhoneNumbers = phoneNumber ? [phoneNumber, ...secondaryPhoneNumbers] : secondaryPhoneNumbers;
          allPhoneNumbers = Array.from(new Set(allPhoneNumbers));
          
          return res.status(200).json({
            contact: {
              id: id,
              emails: allEmails,
              phoneNumbers: allPhoneNumbers,
              secondaryContactIds,
            },
          });

        }else{

          if (existingContact?.userExists?.linkPrecedence === "secondary") {
            
          } else {
            const newSecondaryContactId = await contactModule?.createSecondaryContact({
              email,
              phoneNumber,
              existingContact
            });

            return res.status(200).json({
              contact: {
                primaryContactId: existingContact.id,
                emails: [existingContact.email, email],
                phoneNumbers: phoneNumber,
                secondaryContactIds: [newSecondaryContactId],
              },            
            });
          }
        }

      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
