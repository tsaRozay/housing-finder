const express = require("express");
const routes = require('./routes')
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { environment } = require("./config");
const isProduction = environment === "production";
const { ValidationError } = require("sequelize");

const app = express();


// Logging middleware
app.use(morgan("dev"));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        },
    })
);

// Connect all the routes
app.use(routes);

// Importing routes
const favoritesRoute = require("./routes/api/favorites");
const countriesRoutes = require("./api/countries");
const amenitiesRoutes = require("./api/amenities");
const bookingsRoute = require("./api/bookings");
const reviewsRoute = require("./api/reviews");
const spotImagesRoute = require("./api/spotImages");
const spotsRoute = require("./api/spots");
const usersRoute = require("./api/users");


//Using routes
app.use("/favorites", favoritesRoute);
app.use("/countries", countriesRoutes);
app.use("/amenities", amenitiesRoutes);
app.use("/bookings", bookingsRoute);
app.use("/reviews", reviewsRoute);
app.use("/spotImages", spotImagesRoute);
app.use("/spots", spotsRoute);
app.use("/users", usersRoute);

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = { message: "The requested resource couldn't be found." };
    err.status = 404;
    next(err);
});

// Process sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        let errors = {};
        for (let error of err.errors) {
            errors[error.path] = error.message;
        }
        err.title = "Validation error";
        err.errors = errors;
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack,
    });
});


module.exports = app;
