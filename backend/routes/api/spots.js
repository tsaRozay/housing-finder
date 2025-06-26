const express = require("express");
const router = express.Router();

const {
    User,
    Spot,
    Review,
    Booking,
    SpotImage,
    ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

// Middleware for validating query parameters
const validateQueryParams = (req, res, next) => {
    const errors = {};
    const { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
        req.query;

    const validations = [
        {
            value: page,
            condition: isNaN(page) || page < 1,
            key: "page",
            message: "Page must be greater than or equal to 1",
        },
        {
            value: size,
            condition: isNaN(size) || size < 1 || size > 20,
            key: "size",
            message: "Size must be between 1 and 20",
        },
        {
            value: minLat,
            condition: minLat && (isNaN(minLat) || minLat < -90 || minLat > 90),
            key: "minLat",
            message: "Minimum latitude is invalid",
        },
        {
            value: maxLat,
            condition: maxLat && (isNaN(maxLat) || maxLat < -90 || maxLat > 90),
            key: "maxLat",
            message: "Maximum latitude is invalid",
        },
        {
            value: minLng,
            condition:
                minLng && (isNaN(minLng) || minLng < -180 || minLng > 180),
            key: "minLng",
            message: "Minimum longitude is invalid",
        },
        {
            value: maxLng,
            condition:
                maxLng && (isNaN(maxLng) || maxLng < -180 || maxLng > 180),
            key: "maxLng",
            message: "Maximum longitude is invalid",
        },
        {
            value: minPrice,
            condition: minPrice && (isNaN(minPrice) || minPrice < 0),
            key: "minPrice",
            message: "Minimum price must be greater than or equal to 0",
        },
        {
            value: maxPrice,
            condition: maxPrice && (isNaN(maxPrice) || maxPrice < 0),
            key: "maxPrice",
            message: "Maximum price must be greater than or equal to 0",
        },
    ];

    validations.forEach(({ value, condition, key, message }) => {
        if (value !== undefined && condition) errors[key] = message;
    });

    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: "Bad Request",
            errors,
        });
    }

    Object.keys(req.query).forEach((key) => {
        req.query[key] = isNaN(req.query[key])
            ? req.query[key]
            : parseFloat(req.query[key]);
    });

    next();
};

// Helper function to calculate average star rating
const calculateAvgStarRating = async (spotId) => {
    const reviews = await Review.findAll({ where: { spotId } });
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    return reviews.length
        ? parseFloat((totalStars / reviews.length).toFixed(1))
        : 0;
};

// Helper function to retrieve preview image URL
const getPreviewImage = async (spotId) => {
    const image = await SpotImage.findOne({ where: { spotId } });
    return image ? image.url : "No preview image available";
};

const enrichSpotDetails = (spot) => {
    const { Reviews, ...rest } = spot;
    const totalStars = Reviews.reduce((sum, { stars }) => sum + stars, 0);
    const reviewCount = Reviews.length;
    return {
        ...rest,
        avgStarRating: reviewCount
            ? parseFloat((totalStars / reviewCount).toFixed(1))
            : 0,
        numReviews: reviewCount,
    };
};

// Helper function to format date to "YYYY-MM-DD HH:mm:ss"
const formatDateTime = (date) => {
    const pad = (num) => (num < 10 ? `0${num}` : num);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Add Query Filters to Get All Spots
router.get("/", validateQueryParams, async (req, res) => {
    let {
        page = 1,
        size = 20,
        minLat,
        maxLat,
        minLng,
        maxLng,
        minPrice,
        maxPrice,
    } = req.query;
    const filters = {};

    if (minLat) filters.lat = { ...filters.lat, [Op.gte]: parseFloat(minLat) };
    if (maxLat) filters.lat = { ...filters.lat, [Op.lte]: parseFloat(maxLat) };
    if (minLng) filters.lng = { ...filters.lng, [Op.gte]: parseFloat(minLng) };
    if (maxLng) filters.lng = { ...filters.lng, [Op.lte]: parseFloat(maxLng) };
    if (minPrice)
        filters.price = { ...filters.price, [Op.gte]: parseFloat(minPrice) };
    if (maxPrice)
        filters.price = { ...filters.price, [Op.lte]: parseFloat(maxPrice) };

    const spots = await Spot.findAll({
        where: filters,
        limit: size,
        offset: (page - 1) * size,
        attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "description",
            "price",
            "createdAt",
            "updatedAt",
        ],
    });

    const spotsWithDetails = await Promise.all(
        spots.map(async (spot) => ({
            ...spot.toJSON(),
            avgRating: await calculateAvgStarRating(spot.id),
            previewImage: await getPreviewImage(spot.id),
            createdAt: formatDateTime(new Date(spot.createdAt)),
            updatedAt: formatDateTime(new Date(spot.updatedAt)),
        }))
    );

    return res.status(200).json({ Spots: spotsWithDetails, page, size });
});

// Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
    const spots = await Spot.findAll({ where: { ownerId: req.user.id } });
    const Spots = await Promise.all(
        spots.map(async (spot) => ({
            ...spot.toJSON(),
            avgRating: await calculateAvgStarRating(spot.id),
            previewImage: await getPreviewImage(spot.id),
            createdAt: formatDateTime(new Date(spot.createdAt)),
            updatedAt: formatDateTime(new Date(spot.updatedAt)),
        }))
    );
    res.json({ Spots });
});

// Get details of a Spot from an id
router.get("/:spotId", async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            { model: Review, attributes: ["stars"] },
            { model: SpotImage, attributes: ["id", "url", "preview"] },
            {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "lastName"],
            },
        ],
    });

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const spotDetails = enrichSpotDetails(spot.toJSON());
    spotDetails.createdAt = formatDateTime(new Date(spotDetails.createdAt));
    spotDetails.updatedAt = formatDateTime(new Date(spotDetails.updatedAt));
    res.json(spotDetails);
});

// Create a Spot
router.post("/", requireAuth, async (req, res) => {
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    } = req.body;

    if (
        !address ||
        !city ||
        !state ||
        !country ||
        !name ||
        !description ||
        !price
    ) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                address: "Street address is required",
                city: "City is required",
                state: "State is required",
                country: "Country is required",
                lat: "Latitude is not valid",
                lng: "Longitude must be within -180 and 180",
                name: "Name must be less than 50 characters",
                description: "Description is required",
                price: "Price per day must be a positive number",
            },
        });
    }

    const newSpot = await Spot.create({
        ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });

    return res.status(201).json(newSpot);
});

// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const spot = await Spot.findByPk(spotId);

    if (!spot)
        return res.status(404).json({ message: "Spot couldn't be found" });
    if (spot.ownerId !== req.user.id)
        return res.status(403).json({ message: "Forbidden" });

    const newImage = await SpotImage.create({ url, preview, spotId });
    return res.status(201).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview,
    });
});

//Edit a Spot
router.put("/:id", requireAuth, async (req, res) => {
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    } = req.body;
    const spot = await Spot.findByPk(req.params.id);

    if (!spot)
        return res.status(404).json({ message: "Spot couldn't be found" });
    if (spot.ownerId !== req.user.id)
        return res.status(403).json({
            message: "Forbidden - You are not the owner of this spot",
        });

    if (
        !address ||
        !city ||
        !state ||
        !country ||
        !name ||
        !description ||
        !price
    ) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                address: "Street address is required",
                city: "City is required",
                state: "State is required",
                country: "Country is required",
                lat: "Latitude is not valid",
                lng: "Longitude must be within -180 and 180",
                name: "Name must be less than 50 characters",
                description: "Description is required",
                price: "Price per day must be a positive number",
            },
        });
    }

    const updated = await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });

    return res.json(updated);
});

// Delete a Spot
router.delete("/:id", requireAuth, async (req, res) => {
    const spot = await Spot.findByPk(req.params.id);

    if (!spot)
        return res.status(404).json({ message: "Spot couldn't be found" });
    if (spot.ownerId !== req.user.id)
        return res.status(403).json({
            message: "Forbidden - You are not the owner of this spot",
        });

    await spot.destroy();
    return res.json({ message: "Successfully deleted" });
});

// Get all Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                { model: User, attributes: ["id", "firstName", "lastName"] },
                { model: ReviewImage, attributes: ["id", "url"] },
            ],
        });

        if (!reviews.length) {
            return res
                .status(404)
                .json({ message: "Review couldn't be found" });
        }

        res.json({ Reviews: reviews });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create a Review for a Spot based on the Spot's id
router.post("/:id/reviews", requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const { id: spotId } = req.params;
    const userId = req.user.id;

    if (!review || !stars) {
        return res.status(400).json({
            message: "Validation Error",
            errors: {
                review: "Review text is required",
                stars: "Stars must be an integer from 1 to 5",
            },
        });
    }

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const existingReview = await Review.findOne({
            where: { spotId, userId },
        });
        if (existingReview) {
            return res.status(500).json({
                message: "User already has a review for this spot",
            });
        }

        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars,
        });
        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
    const { spotId } = req.params;

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const isOwner = spot.ownerId === req.user.id;
        const bookingAttributes = isOwner
            ? [
                  "id",
                  "spotId",
                  "userId",
                  "startDate",
                  "endDate",
                  "createdAt",
                  "updatedAt",
              ]
            : ["spotId", "startDate", "endDate"];

        const bookings = await Booking.findAll({
            where: { spotId },
            attributes: bookingAttributes,
            include: isOwner
                ? [{ model: User, attributes: ["id", "firstName", "lastName"] }]
                : [],
        });

        const formattedBookings = bookings.map((booking) => {
            const formattedBooking = { ...booking.toJSON() };
            // Format the startDate and endDate to 'YYYY-MM-DD' without time
            formattedBooking.startDate = formatDateTime(
                new Date(formattedBooking.startDate)
            ).split(" ")[0];
            formattedBooking.endDate = formatDateTime(
                new Date(formattedBooking.endDate)
            ).split(" ")[0];

            // Format createdAt and updatedAt for the owner
            if (isOwner) {
                formattedBooking.createdAt = formatDateTime(
                    new Date(formattedBooking.createdAt)
                );
                formattedBooking.updatedAt = formatDateTime(
                    new Date(formattedBooking.updatedAt)
                );
            }

            return formattedBooking;
        });

        res.status(200).json({ Bookings: formattedBookings });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;
    const { startDate, endDate } = req.body;

    // Checks if both startDate and endDate are provided
    if (!startDate || !endDate) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                startDate: "Start date is required",
                endDate: "End date is required",
            },
        });
    }

    // Makes sure endDate is after startDate
    if (new Date(endDate) <= new Date(startDate)) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot be on or before startDate",
            },
        });
    }

    // Makes sure startDate is not in the past
    if (new Date(startDate) < new Date()) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                startDate: "startDate cannot be in the past",
            },
        });
    }

    try {
        const spot = await Spot.findByPk(spotId);
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId === userId) {
            return res
                .status(404)
                .json({ message: "Cannot book your own spot" });
        }

        const conflictingBooking = await Booking.findOne({
            where: {
                spotId,
                [Op.or]: [
                    {
                        startDate: { [Op.between]: [startDate, endDate] },
                    },
                    {
                        endDate: { [Op.between]: [startDate, endDate] },
                    },
                ],
            },
        });

        if (conflictingBooking) {
            return res.status(403).json({
                message:
                    "Sorry, this spot is already booked for the specified dates",
                errors: {
                    startDate: "Start date conflicts with an existing booking",
                    endDate: "End date conflicts with an existing booking",
                },
            });
        }

        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate,
        });

        // Format the response object
        res.status(201).json({
            id: newBooking.id,
            spotId: newBooking.spotId,
            userId: newBooking.userId,
            startDate: new Date(newBooking.startDate)
                .toISOString()
                .split("T")[0],
            endDate: new Date(newBooking.endDate).toISOString().split("T")[0],
            createdAt: formatDateTime(new Date(newBooking.createdAt)),
            updatedAt: formatDateTime(new Date(newBooking.updatedAt)),
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
