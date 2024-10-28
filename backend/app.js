const express = require("express");
const routes = require("./routes");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { environment } = require("./config");
const isProduction = environment === "production";
const { ValidationError } = require("sequelize");

require("dotenv").config();

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

// Root Route

app.get("/", (req, res) => {
    res.send("Welcome to the Housing Finder API!");
});

// Connect all the routes
app.use(routes);

// Importing routes
const bookingsRoute = require("./routes/api/bookings");
const reviewsRoute = require("./routes/api/reviews");
const spotImagesRoute = require("./routes/api/spot-images");
const spotsRoute = require("./routes/api/spots");
const usersRoute = require("./routes/api/users");
const sessionRoute = require("./routes/api/session");
const reviewImagesRoute = require("./routes/api/review-images");

//Using routes
app.use("/api/bookings", bookingsRoute);
app.use("/api/reviews", reviewsRoute);
app.use("/api/spot-images", spotImagesRoute);
app.use("/api/spots", spotsRoute);
app.use("/api/users", usersRoute);
app.use("/api/session", sessionRoute);
app.use("/api/review-images", reviewImagesRoute);

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
