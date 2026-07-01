// requiring packages and libraries
const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const app = express();

// database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderstay";
main()
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

// root endpoint
app.get("/", (req, res) => {
  res.send("Hi! I am root");
});

app.get("/testListing", async(req, res) => {
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Potenga, Chittagong",
        country: "Bangladesh",
    });
    await sampleListing.save();
    console.log("sample was saved");
    res.send("successful testing");
});

// server listening
app.listen(8080, () => {
  console.log("server is running");
});
