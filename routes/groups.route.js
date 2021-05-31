const express = require("express");
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const group_controller = require("../controller/groups.controller");
const authenticateJWT = require("../helper/auth");

router.route("/getGroups/:bookingId")
    .get(authenticateJWT, group_controller.getGroup)
router.route("/getGroups")
    .post(authenticateJWT, group_controller.getGroup)
router.route("/addUpdateUserInfo")
    .post(authenticateJWT, group_controller.addUpdateUserInfo)
router.route("/addRemoveUsersToBookings")
    .post(authenticateJWT, group_controller.addRemoveUsersToBookings)

module.exports = router;
