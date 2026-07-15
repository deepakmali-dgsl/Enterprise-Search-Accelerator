const express = require("express");

const router = express.Router();

router.post("/contentful", (req, res) => {

    res.json({
        message: "Webhook received"
    });

});

module.exports = router;