const express = require("express");
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require("../controller/users.controller");
const { singleUpload } = require("../helper/multer");
const authenticateJWT = require("../helper/auth");

router.route("/user")
    .get(authenticateJWT, user_controller.getAllUsers)
    .post(user_controller.registorUser)
    .put([authenticateJWT, singleUpload()], user_controller.updateUser);
router.route("/user/login")
    .post(user_controller.loginUser);
// router.route("/user/forgot")
//     .post(user_controller.forgotUser);
router.route("/user/:email")
    .get(user_controller.getUser)
    .delete(authenticateJWT, user_controller.deleteUser)
router.route("/user/loginHistory")
    .post(user_controller.userLoginHistory);
    router.route("/user/sendTFA_Code")
    .post(user_controller.sendTFA_OTP);

module.exports = router;
