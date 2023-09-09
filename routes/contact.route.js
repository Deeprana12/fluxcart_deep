const router = require("express").Router();
const contactController = require("../controllers/contact.controller");

router.post("/identify", contactController.addContact);

module.exports = router;