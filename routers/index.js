const express = require("express");
const router = express.Router();

const {getMailFile,getUserData} = require("../controllers/index");

router.route("/emailfile").post(getMailFile);
// router.route("/userfile").post(getUserData);
router.post("/userfile", getUserData)
module.exports = router;