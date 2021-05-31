const express = require("express");
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const booking_controller = require("../controller/bookings.controller");
const authenticateJWT = require("../helper/auth");

router.route("/upcomingStay/:userId")
  .get(authenticateJWT, booking_controller.getUpcomingStay)
router.route("/upcomingStayFeed/:propertyId")
  .get(authenticateJWT, booking_controller.getUpcomingStayFeed)
router.route("/upcomingStayGuideItems/:propertyId")
  .get(authenticateJWT, booking_controller.getUpcomingStayGuideItems)
router.route("/upcomingStayListItems/:marketId/:bookingId")
  .get(authenticateJWT, booking_controller.getUpcomingStayListItems)
router.route("/upcomingStayWeather/:zipCode")
  .get(authenticateJWT, booking_controller.getUpcomingStayWeather)
router.route("/createTicket")
  .post(authenticateJWT, booking_controller.createOSTicket)

module.exports = router;
