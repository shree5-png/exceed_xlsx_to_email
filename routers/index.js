const express = require("express");
const router = express.Router();

const {SendMail } = require("../controllers/index");

router.route("/sendmail").post(SendMail);

module.exports = router;