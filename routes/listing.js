const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const multer = require("multer");
const {storage} = require('../cloudConfig');
const upload = multer({storage});
const { isLoggedin, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedin,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.createListing),
    );

    router.get("/new", isLoggedin, listingController.renderNewForm);
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .patch(
        isLoggedin,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(listingController.updateListing),
    )
    .delete(
        isLoggedin,
        isOwner,
        wrapAsync(listingController.destroyListing),
    );

// New Route

// Edit Route
router.get(
    "/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.renderEditForm),
);

module.exports = router;
