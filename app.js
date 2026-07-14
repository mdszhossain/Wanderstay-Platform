// requiring packages and libraries
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const app = express();

// middlewares and setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.static(path.join(__dirname, "public/js")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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

// root endpoint
app.get("/", (req, res) => {
    res.send("Hi! I am root");
});

// Index Route
app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    }),
);

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.post(
    "/listings",
    wrapAsync(async (req, res, next) => {
        if (!req.body.listing) {
            throw new ExpressError(400, "Send Valid Data For Listing");
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }),
);

// Edit Route
app.get(
    "/listings/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    }),
);

// Update Route
app.patch(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        if (!req.body.listing) {
            throw new ExpressError(400, "Send Valid Data For Listing");
        }
        const newListing = req.body.listing;
        const result = await Listing.updateOne({ _id: id }, newListing, {
            new: true,
        });
        res.redirect(`/listings`);
    }),
);

// Delete Route
app.delete(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    }),
);

// Show Route
app.get(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing });
    }),
);

app.use((req, res, next) => {
    throw new ExpressError(404, "Page Not Found");
});

// error handler middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "Some Error" } = err;
    res.status(status).send(message);
});

// server listening
app.listen(8080, () => {
    console.log("server is running");
});
