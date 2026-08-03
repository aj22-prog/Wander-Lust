const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listing");
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  await newReview.save();

  // Only push the review reference — avoids re-validating the whole listing
  // (which would fail on old listings missing a `geometry` field)
  await Listing.findByIdAndUpdate(listing._id, {
    $push: { reviews: newReview._id },
  });

  req.flash("success", "New Review Created!");
  res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });

  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted!");
  res.redirect(`/listing/${id}`);
};                                                             




