const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const { listingSchema, reviewSchema } = require("./schema");


module.exports.isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'you must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.redirectPage = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currentUser._id)) {
      req.flash('error', 'you are not the owner of this listing');
      return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let listing = await Review.findById(id);
    if(!review.author._id.equals(res.locals.currentUser._id)) {
      req.flash('error', 'you are not the author of this review');
      return res.redirect(`/listings/${id}`);
    }
    next();
}

// validation for schema using middleware
module.exports.validateListing = (req, res, next) => {
  req.body = req.body || {};
  let result = listingSchema.validate(req.body);
  let { error } = result;
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
    req.body = req.body || {};
    let result = reviewSchema.validate(req.body);
    let { error } = result;
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};