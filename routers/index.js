
import express from "express";
const router = express.Router();
import { getMailFile, getUserData, sendMail } from "../controllers/index.js";

router.route("/emailfile").post(getMailFile);
// router.route("/userfile").post(getUserData);
router.post("/userfile", getUserData, sendMail);


export { router };