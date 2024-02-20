const express = require("express");
const router = express.Router();

const {getMailFile,getUserData,sendMail} = require("../controllers/index");

router.route("/emailfile").post(getMailFile);
// router.route("/userfile").post(getUserData);
router.post("/userfile", getUserData,sendMail);
module.exports = router;