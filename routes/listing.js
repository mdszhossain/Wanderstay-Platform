const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedin, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");

// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedin, listingController.renderNewForm);

// show route
router.get("/:id", wrapAsync(listingController.showListing));

router.post("/", validateListing, wrapAsync(listingController.createListing));

// Edit Route
router.get(
    "/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.renderEditForm),
);

// Update Route
router.patch(
    "/:id",
    isLoggedin,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing),
);

// Delete Route
router.delete(
    "/:id",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.destroyListing),
);

module.exports = router;
