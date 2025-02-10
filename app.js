const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = 'mongodb://localhost:27017/wanderlust';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

// Index Route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}); 

// New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//create route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Show Route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});

// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

// Update Route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);    
});

// Delete Route
app.delete("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
})

// app.get("/testListing",async (req, res) => {
//     // let sampleListings = new Listing({
//     //     title: "My new Villa",
//     //     description: "A beautiful villa by the beach",
//     //     price: 1500,
//     //     location: "Calangute, Goa",
//     //     country: "India",
//     // });
//     // await sampleListings.save();
//     console.log("Listing saved");
//     res.send("Successfully testing");
// });

app.get('/', (req, res) => {
    res.send("Hello! Welcome to Wanderlust");
})

app.listen(8080, () =>{
    console.log('Server is running on port 8080');
});