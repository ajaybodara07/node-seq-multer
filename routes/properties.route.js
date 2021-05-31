const express = require("express");
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const propertie_controller = require("../controller/properties.controller");
const authenticateJWT = require("../helper/auth");

router.route("/cronJob")
  .get(authenticateJWT, propertie_controller.cronJob)

module.exports = router;
