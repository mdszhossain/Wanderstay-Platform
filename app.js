// requiring express and creating express app
const express = require("express");
const app = express();
// requiring mongoose for database operations
const mongoose = require("mongoose");
// requiring method-override for convert POST to PATCH & DELETE
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// requiring path for joining views directory and public directory with index folder.
const path = require("path");
// custom error class express-error which extends express default error class
const ExpressError = require("./utils/ExpressError");
// For read data from cookie.
const cookieParser = require("cookie-parser");
// this is for storing the session information.
const session = require("express-session");
// connect flash for flash messages. work with redirect()
const flash = require("connect-flash");
// for authentication and authorization
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

// requiring router file from different router pages.
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

// middlewares and setup
// setting view engine as ejs
app.set("view engine", "ejs");
// connection views folder with index folder
app.set("views", path.join(__dirname, "views"));
// serving static file like css and js and connecting with index folder.
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
// for read the data from request body.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// for converting POST to PATCH and DELETE
app.use(methodOverride("_method"));
//
app.engine("ejs", ejsMate);
// for read data from cookie
app.use(cookieParser());
const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};
// sending session id as cookie in browser
app.use(session(sessionOptions));
app.use(flash());

// database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";
main()
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}

// implementing passport configuring strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// implementing connect-flash
app.use((req, res, next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

// pointing to different routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


app.use((req, res, next) => {
    throw new ExpressError(404, "Page Not Found");
});

// error handler middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Some Error" } = err;
    res.status(status).render("error.ejs", { err });
    // res.status(status).send(message);
});

// server listening
app.listen(8080, () => {
    console.log("server is running");
});
