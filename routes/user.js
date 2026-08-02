const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const review = require("../models/review");
const passport = require("passport");
const { redirectPage } = require("../middleware");
const userController = require("../controllers/users");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(wrapAsync(userController.renderLoginForm))
    .post(
        redirectPage,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        wrapAsync(userController.login),
    );

router.get("/logout", wrapAsync(userController.logout));

module.exports = router;
