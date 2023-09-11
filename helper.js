const contactModule = require("./modules/contact.module");

module.exports = {
  allUsers: async (userData) => {
    let id =
      userData?.linkPrecedence === "primary"
        ? userData?.id
        : userData?.linkedId;

    const results = await contactModule?.findAllRelatedContent(id);

    const secondaryResults = results?.secondaryResults;
    const secondaryEmails = secondaryResults.map((c) => c.email);
    const secondaryPhoneNumbers = secondaryResults.map((c) => c.phoneNumber);
    
    const secondaryContactIds =
      userData?.linkPrecedence === "primary"
        ? secondaryResults.map((c) => c.id).filter((id) => id != userData?.id)
        : secondaryResults
            .map((c) => c.id)
            .filter((id) => id != userData?.linkedId);

    let allEmails = secondaryEmails;
    allEmails = Array.from(new Set(allEmails));

    let allPhoneNumbers = secondaryPhoneNumbers;
    allPhoneNumbers = Array.from(new Set(allPhoneNumbers));

    return {
      contact: {
        primaryContactid: id,
        emails: allEmails,
        phoneNumbers: allPhoneNumbers,
        secondaryContactIds,
      },
    };
  },
};