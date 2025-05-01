require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('../models/listing'); // ✅ path is correct based on your structure
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAP_TOKEN });

mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Database connected");

  const listings = await Listing.find({ geometry: { $exists: false } });

  for (let listing of listings) {
    try {
      const response = await geocoder.forwardGeocode({
        query: listing.location,
        limit: 1,
      }).send();

      if (response.body.features.length > 0) {
        listing.geometry = response.body.features[0].geometry;
        await listing.save();
        console.log(`✅ Updated: ${listing.title}`);
      } else {
        console.log(`⚠️ No location found for: ${listing.title}`);
      }
    } catch (err) {
      console.error(`❌ Error updating ${listing.title}:`, err);
    }
  }

  mongoose.connection.close();
});
