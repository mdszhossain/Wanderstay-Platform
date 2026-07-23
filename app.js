// requiring packages and libraries
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const ExpressError = require("./utils/ExpressError");
const cookieParser = require("cookie-parser");
const app = express();

const listings = require("./routes/listing");
const reviews = require("./routes/review");

// middlewares and setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(cookieParser("secretcode"));

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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "Assalamualaikum");
    res.cookie("madeIn", "Bangladesh");
    res.send("sent you some cookie");
});

app.get("/greet", (req, res) => {
    let {name = "anonymous"} = req.cookies;
    res.send(`Hi!, ${name}`);
})

app.get("/getsignedcookies", (req, res) => {
    res.cookie("name", "shazzad", {signed: true});
    res.send("signed cookies sent");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("Verified");
})

// root endpoint
app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi! I am root");
});

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
