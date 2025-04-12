const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

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
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Welcome to WanderIn");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.get('/', (req, res) => {
    res.send("Hello! Welcome to Wanderlust");
});

app.listen(8080, () =>{
    console.log('Server is running on port 8080');
});

// app.get("/testListing",async (req, res) => {
    // let sampleListings = new Listing({
    //     title: "My new Villa",
    //     description: "A beautiful villa by the beach",
    //     price: 1500,
    //     location: "Calangate, Goa",
    //     country: "India",
    // });
    // await sampleListings.save();
//     console.log("Listing saved");
//     res.send("Successfully testing");
// });