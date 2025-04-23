const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require('../models/listing');
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controller/listings.js");

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing, wrapAsync(listingController.createListing)); 

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm); 

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner,wrapAsync(listingController.destroyListing));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;