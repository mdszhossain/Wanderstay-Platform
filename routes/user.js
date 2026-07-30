const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const review = require("../models/review");
const passport = require('passport');

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post(
    "/signup",
    wrapAsync(async (req, res) => {
        try {
            let { username, email, password } = req.body;
            const newUser = new User({ email, username });
            const registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            req.flash("success", "user registered successfully");
            res.redirect("/listings");
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    }),
);

router.get(
    "/login",
    wrapAsync(async (req, res) => {
        res.render("users/login.ejs");
    }),
);

router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    wrapAsync(async (req, res) => {
        req.flash('success', 'welcome back to wanderlust');
        res.redirect('/listings');
    }),
);

module.exports = router;
