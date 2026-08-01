const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedin, isReviewAuthor, validateReview } = require("../middleware");
const reviewController = require("../controllers/reviews");

// reviews
// POST review route
router.post(
    "/",
    isLoggedin,
    validateReview,
    wrapAsync(reviewController.createReview),
);

// Delete review route
router.delete(
    "/:reviewId",
    isLoggedin,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview),
);

module.exports = router;
