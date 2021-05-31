const express = require("express");
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const notification_controller = require("../controller/notifications.controller");
const authenticateJWT = require("../helper/auth");

router.route("/getSMSAndPushNotifications")
    .get(authenticateJWT, notification_controller.getSMSAndPushNotifications)
router.route("/appRefreshNotifications/:propertyId/:userId")
    .get(authenticateJWT, notification_controller.getAppRefreshNotifications)
router.route("/clearAppRefreshNotifications/:propertyId/:userId")
    .get(authenticateJWT, notification_controller.getClearAppRefreshNotifications)
router.route("/getNewNotifications/:userId/:retrieveAllNotifications")
    .get(authenticateJWT, notification_controller.getNewNotifications)
router.route("/setClearNewNotifications/:userId")
    .get(authenticateJWT, notification_controller.setClearNewNotifications)
router.route("/setMarkNotificationsAsRead")
    .post(authenticateJWT, notification_controller.setMarkNotificationsAsRead)

module.exports = router;
