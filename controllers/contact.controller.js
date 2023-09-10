const contactModule = require("../modules/contact.module");
const helper = require("../helper")

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
        // const userExistsStrictly = await contactModule?.findContactStrictly(data);
        // if(userExistsStrictly?.results?.length != 0){
        //   console.log(userExistsStrictly)
        // }              
      // }else if(email){

      // }else if(phoneNumber){

      // }else{
      //   const userExistsStrictly = await contactModule?.findContactStrictly(data);
      //   if(userExistsStrictly?.results?.length != 0){
      //     const parentId = userExistsStrictly?.id;

      //     const 
      //   }
      // }

      const userExistsStrictly = await contactModule?.findContactStrictly(data);
      if(userExistsStrictly?.results?.length != 0){        
        return res.status(200).json(await helper?.allUsers(email, phoneNumber, userData = userExistsStrictly?.results))
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

        if(!email || !phoneNumber){
          return res.status(200)
                  .json(await helper?.allUsers(email, phoneNumber, userData = existingContact));
        }else{

          if (existingContact?.userExists?.linkPrecedence === "secondary") {

          } else {
            await contactModule?.createSecondaryContact({
              email,
              phoneNumber,
              existingContact
            });
            
            // return res.status(200).json({
            //   contact: {
            //     primaryContactId: existingContact.id,
            //     emails: [existingContact.email, email],
            //     phoneNumbers: phoneNumber,
            //     secondaryContactIds: [newSecondaryContactId],
            //   },            
            // });            
            return res.status(200).json(
              await helper?.allUsers(email, phoneNumber, userData = existingContact[0])
            )

          }
        }

      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
