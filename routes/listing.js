const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedin, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedin,
        validateListing,
        wrapAsync(listingController.createListing),
    );

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(
        isLoggedin,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing),
    )
    .delete(
        isLoggedin,
        isOwner,
        wrapAsync(listingController.destroyListing),
    );

// New Route
router.get("/new", isLoggedin, listingController.renderNewForm);

// Edit Route
router.get(
    "/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.renderEditForm),
);

module.exports = router;
