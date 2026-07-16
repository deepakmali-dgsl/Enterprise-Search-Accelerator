const express = require("express");
const { handleContentfulWebhook } = require("../controllers/webhookController");

const router = express.Router();

router.post("/contentful", handleContentfulWebhook);

module.exports = router;
