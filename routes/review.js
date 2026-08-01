const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { isLoggedin, isReviewAuthor, validateReview } = require("../middleware");



// reviews
// POST review route
router.post(
    "/",
    isLoggedin,
    validateReview,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        let listing = await Listing.findById(id);
        console.log(listing);
        req.body = req.body || {};
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        console.log(newReview);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "New Review Created");
        res.redirect(`/listings/${id}`);
    }),
);

// Delete review route
router.delete(
    "/:reviewId",
    isLoggedin,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted");
        res.redirect(`/listings/${id}`);
    }),
);

module.exports = router;
