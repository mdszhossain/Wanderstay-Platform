const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const review = require("../models/review");
const passport = require("passport");
const { redirectPage } = require("../middleware");
const userController = require("../controllers/users");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", wrapAsync(userController.renderLoginForm));

router.post(
    "/login",
    redirectPage,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    wrapAsync(userController.login),
);

router.get("/logout", wrapAsync(userController.logout));

module.exports = router;
