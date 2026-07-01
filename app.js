// requiring packages and libraries
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const methodOverride = require("method-override");
const path = require("path");
const app = express();

// middlewares and setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public/css")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

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
app.get("/listings", async(req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.post("/listings", async(req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route
app.get("/listings/:id/edit", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// Update Route
app.patch("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const newListing = req.body.listing;
    const result = await Listing.updateOne({_id: id}, newListing, {new: true});
    res.redirect(`/listings`);
});

// Delete Route
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

// Show Route
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// server listening
app.listen(8080, () => {
  console.log("server is running");
});
