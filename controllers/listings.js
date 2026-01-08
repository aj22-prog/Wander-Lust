const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listing/index.ejs", { alllisting: allListings });

};


module.exports.renderNewForm =  (req, res) => {
  res.render("listing/new");
};


module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested does not exist !");
      res.redirect("/listing");
    }

    console.log(listing);
    res.render("listing/show.ejs", { listing });
  };

  module.exports.createListing = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(url, ".." , filename);
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url,filename};
  
      await newListing.save();
      req.flash("success", "New Listing Created !");
      res.redirect("/listing");
    };


    module.exports.renderEditForm = async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
    
        if (!listing) {
          req.flash("error", "Listing you requested does not exist!");
          return res.redirect("/listing");
        }
    
        
        res.render("listing/edit.ejs", { listing }); 
      };


      module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect(`/listing/${id}`);
  };

  module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

    req.flash("success", "Listing Deleted !");
    res.redirect("/listing");
  };