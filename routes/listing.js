const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const multer = require("multer");
const upload = multer({dest: "uploads/"})
const { isLoggedin, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single("listing[image]"), (req, res) => {
        res.send(req.file);
    })
    // .post(
    //     isLoggedin,
    //     validateListing,
    //     wrapAsync(listingController.createListing),
    // );

    router.get("/new", isLoggedin, listingController.renderNewForm);
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

// Edit Route
router.get(
    "/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.renderEditForm),
);

module.exports = router;
