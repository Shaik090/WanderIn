const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const {isLoggedIn} = require("../middleware.js");

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
})); 

// New Route
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//create route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing is Created!");
    res.redirect("/listings");
}));

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing is Updated!");
    res.redirect(`/listings/${id}`);    
}));

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let {id} = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing is Deleted!");
    res.redirect("/listings");
}));

module.exports = router;