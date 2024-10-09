// backend/routes/index.js
const express = require("express");
const router = express.Router();
const apiRouter = require("./api"); // Import the main API router
const app = require("../app");

// Importing routes
const favoritesRoute = require("./api/favorites");
const countriesRoutes = require("./api/countries");
const amenitiesRoutes = require("./api/amenities");
const bookingsRoute = require("./api/bookings");
const reviewsRoute = require("./api/reviews");
const spotImagesRoute = require("./api/spotImages");
const spotsRoute = require("./api/spots");
const usersRoute = require("./api/users");

// Use the API router for the main API routes
router.use("/api", apiRouter);

// Sample hello/world route
router.get("/hello/world", function (req, res) {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    res.send("Hello World!");
});

// Using routes
// app.use("/favorites", favoritesRoute);
// app.use("/countries", countriesRoutes);
// app.use("/amenities", amenitiesRoutes);
// app.use("/bookings", bookingsRoute);
// app.use("/reviews", reviewsRoute);
// app.use("/spotImages", spotImagesRoute);
// app.use("/spots", spotsRoute);
// app.use("/users", usersRoute);

module.exports = router;
