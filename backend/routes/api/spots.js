const express = require("express");
const router = express.Router();
const { Spot, SpotImage, Review, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { Sequelize } = require("sequelize");

// Get All Spots
router.get("/", async (req, res) => {
    const {
        city,
        minPrice,
        maxPrice,
        page = 1,
        size = 10,
        minLat,
        maxLat,
        minLng,
        maxLng,
    } = req.query;

    // Ensure pagination parameters are integers
    const limit = Math.max(parseInt(size, 10) || 10, 1);
    const offset = Math.max((parseInt(page, 10) - 1) * limit, 0);

    // Set up filtering conditions
    let where = {};
    if (city) where.city = city;

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Sequelize.Op.gte] = parseFloat(minPrice);
        if (maxPrice) where.price[Sequelize.Op.lte] = parseFloat(maxPrice);
    }

    if (minLat || maxLat) {
        where.lat = {};
        if (minLat) where.lat[Sequelize.Op.gte] = parseFloat(minLat);
        if (maxLat) where.lat[Sequelize.Op.lte] = parseFloat(maxLat);
    }

    if (minLng || maxLng) {
        where.lng = {};
        if (minLng) where.lng[Sequelize.Op.gte] = parseFloat(minLng);
        if (maxLng) where.lng[Sequelize.Op.lte] = parseFloat(maxLng);
    }

    // Validate pagination parameters
    const errors = {};
    if (page < 1) errors.page = "Page must be greater than or equal to 1";
    if (size < 1) errors.size = "Size must be greater than or equal to 1";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Bad Request", errors });
    }

    // Fetch spots with associated data
    const spots = await Spot.findAll({
        where,
        include: [
            {
                model: SpotImage,
                attributes: ["url", "preview"],
                where: { preview: true },
                required: false,
            },
            {
                model: Review,
                attributes: [],
            },
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                    "avgRating",
                ],
            ],
        },
        group: ["Spot.id", "SpotImages.url", "SpotImages.preview"],
        limit,
        offset,
    });

    const formattedSpots = spots.map((spot) => {
        const previewImage = spot.SpotImages[0]
            ? spot.SpotImages[0].url
            : "image url";
        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: parseFloat(spot.lat),
            lng: parseFloat(spot.lng),
            name: spot.name,
            description: spot.description,
            price: parseFloat(spot.price),
            createdAt: spot.createdAt
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            updatedAt: spot.updatedAt
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            avgRating: parseFloat(spot.get("avgRating")) || 4.5,
            previewImage,
        };
    });

    res.status(200).json({
        Spots: formattedSpots,
        page: parseInt(page, 10),
        size: parseInt(size, 10),
    });
});

// Get All Spots Owned by the Current User
router.get("/current", requireAuth, async (req, res) => {
    const userId = req.user.id;

    const spots = await Spot.findAll({
        where: { ownerId: userId },
        include: [
            {
                model: SpotImage,
                attributes: ["url", "preview"],
                where: { preview: true },
                required: false,
            },
            {
                model: Review,
                attributes: [],
            },
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                    "avgRating",
                ],
            ],
        },
        group: ["Spot.id", "SpotImages.url", "SpotImages.preview"],
    });

    const formattedSpots = spots.map((spot) => ({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt.toISOString().slice(0, 19).replace("T", " "),
        updatedAt: spot.updatedAt.toISOString().slice(0, 19).replace("T", " "),
        avgRating: parseFloat(spot.get("avgRating")) || 4.5,
        previewImage: spot.SpotImages[0] ? spot.SpotImages[0].url : "image url",
    }));

    res.status(200).json({ Spots: formattedSpots });
});

// Get Details of a Spot from an id
router.get("/:spotId", async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId, {
        include: [
            { model: SpotImage, attributes: ["id", "url", "preview"] },
            { model: Review, attributes: [] },
            {
                model: User,
                as: "Owner",
                attributes: ["id", "firstName", "lastName"],
            },
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn("COUNT", Sequelize.col("Reviews.id")),
                    "numReviews",
                ],
                [
                    Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                    "avgStarRating",
                ],
            ],
        },
        group: ["Spot.id", "SpotImages.id", "Owner.id"],
    });

    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const spotDetails = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt.toISOString().slice(0, 19).replace("T", " "),
        updatedAt: spot.updatedAt.toISOString().slice(0, 19).replace("T", " "),
        numReviews: parseInt(spot.get("numReviews")) || 0,
        avgStarRating: parseFloat(spot.get("avgStarRating")) || null,
        SpotImages: spot.SpotImages.map((image) => ({
            id: image.id,
            url: image.url,
            preview: image.preview,
        })),
        Owner: {
            id: spot.Owner.id,
            firstName: spot.Owner.firstName,
            lastName: spot.Owner.lastName,
        },
    };

    res.status(200).json(spotDetails);
});

// Create a Spot
router.post("/", requireAuth, async (req, res) => {
    const {
        name,
        description,
        price,
        address,
        city,
        state,
        country,
        lat,
        lng,
    } = req.body;
    const ownerId = req.user.id;

    // Collect validation errors if any field is missing or invalid
    const errors = {};
    if (!name || name.length > 50)
        errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price) errors.price = "Price per day is required";
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (lat === undefined || lat === null || isNaN(lat))
        errors.lat = "Latitude is not valid";
    if (lng === undefined || lng === null || isNaN(lng))
        errors.lng = "Longitude is not valid";

    // Return 400 error if there are validation errors
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ message: "Validation errors", errors });
    }

    // Create a new spot if validation passes
    const newSpot = await Spot.create({
        ownerId,
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

    res.status(201).json({
        id: newSpot.id,
        ownerId: newSpot.ownerId,
        address: newSpot.address,
        city: newSpot.city,
        state: newSpot.state,
        country: newSpot.country,
        lat: newSpot.lat,
        lng: newSpot.lng,
        name: newSpot.name,
        description: newSpot.description,
        price: newSpot.price,
        createdAt: newSpot.createdAt,
        updatedAt: newSpot.updatedAt,
    });
});

// Add an Image to a Spot Based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { imageUrl, preview } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(spotId);

    // Check if the spot exists; return 404 if not found
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the current user is the owner of the spot; return 403 if not authorized
    if (spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    // Create a new SpotImage associated with the spot
    const newImage = await SpotImage.create({
        spotId: spot.id,
        url: imageUrl,
        preview,
    });

    res.status(201).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview,
    });
});

// Edit a Spot
router.put("/:spotId", requireAuth, async (req, res) => {
    const spotId = req.params.spotId;
    const {
        name,
        description,
        price,
        address,
        city,
        state,
        country,
        lat,
        lng,
    } = req.body;

    const spot = await Spot.findByPk(spotId);

    // Check if the spot exists; return 404 if not found
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Check if the current user is the owner of the spot; return 403 if not authorized
    if (spot.ownerId !== req.user.id) {
        return res
            .status(403)
            .json({ message: "You are not allowed to edit this spot" });
    }

    // Validate request body
    const errors = {};
    if (!address) errors.address = "Street address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat || typeof lat !== "number") errors.lat = "Latitude is not valid";
    if (!lng || typeof lng !== "number") errors.lng = "Longitude is not valid";
    if (!name || name.length > 50)
        errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price) errors.price = "Price per day is required";

    if (Object.keys(errors).length) {
        return res.status(400).json({
            message: "Bad Request",
            errors,
        });
    }

    await spot.update({
        name,
        description,
        price,
        address,
        city,
        state,
        country,
        lat,
        lng,
    });

    const updatedSpot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ["url", "preview"],
                where: { preview: true },
                required: false,
            },
            {
                model: Review,
                attributes: [],
            },
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
                    "avgRating",
                ],
            ],
        },
        group: ["Spot.id", "SpotImages.url", "SpotImages.preview"],
    });

    res.status(200).json({
        id: updatedSpot.id,
        ownerId: updatedSpot.ownerId,
        address: updatedSpot.address,
        city: updatedSpot.city,
        state: updatedSpot.state,
        country: updatedSpot.country,
        lat: updatedSpot.lat,
        lng: updatedSpot.lng,
        name: updatedSpot.name,
        description: updatedSpot.description,
        price: updatedSpot.price,
        createdAt: updatedSpot.createdAt,
        updatedAt: updatedSpot.updatedAt,
    });
});

// Delete a Spot
router.delete("/:spotId", requireAuth, async (req, res) => {
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId);

    // Check if the spot exists
    if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Ensure the authenticated user is the owner of the spot
    if (spot.ownerId !== req.user.id) {
        return res
            .status(403)
            .json({ message: "You are not allowed to delete this spot" });
    }

    await spot.destroy();

    res.status(200).json({ message: "Successfully deleted" });
});

// Get All Reviews by a Spot's id
router.get("/:spotId/reviews", async (req, res) => {
    const { spotId } = req.params;

    const reviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"],
            },
        ],
    });

    if (reviews.length === 0) {
        return res.status(404).json({ message: "Spot couldn't be found" });
    }

    return res.status(200).json({ Reviews: reviews });
});

// Create a Review for a Spot Based on Spot's id
router.post("/:spotId/reviews", requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const spot = await Spot.findByPk(req.params.spotId);

    // Error response: Couldn't find a Spot with the specified id
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
        });
    }

    // Error response: Review from the current user already exists for the Spot
    const existingReview = await Review.findOne({
        where: {
            spotId: spot.id,
            userId: req.user.id,
        },
    });

    if (existingReview) {
        return res.status(500).json({
            message: "User already has a review for this spot",
        });
    }

    // Validate stars to be between 1 and 5
    if (stars < 1 || stars > 5) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                stars: "Stars must be an integer from 1 to 5",
            },
        });
    }

    // Validate review content
    if (!review || review.trim() === "") {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                review: "Review text is required",
            },
        });
    }

    const newReview = await Review.create({
        review,
        stars,
        spotId: spot.id,
        userId: req.user.id,
    });

    return res.status(201).json(newReview);
});

// // Edit a Spot
// router.put("/:spotId", requireAuth, async (req, res) => {
//     try {
//         const spotId = req.params.spotId;
//         const {
//             name,
//             description,
//             price,
//             address,
//             city,
//             state,
//             country,
//             lat,
//             lng,
//         } = req.body;

//         const spot = await Spot.findByPk(spotId);

//         if (!spot) {
//             return res.status(404).json({ message: "Spot couldn't be found" });
//         }

//         if (spot.ownerId !== req.user.id) {
//             return res
//                 .status(403)
//                 .json({ message: "You are not allowed to edit this spot" });
//         }

//         await spot.update({
//             name,
//             description,
//             price,
//             address,
//             city,
//             state,
//             country,
//             lat,
//             lng,
//         });

//         const updatedSpot = await Spot.findByPk(spotId, {
//             include: [
//                 {
//                     model: SpotImage,
//                     attributes: ["url", "preview"],
//                     where: { preview: true },
//                     required: false,
//                 },
//                 {
//                     model: Review,
//                     attributes: [],
//                 },
//             ],
//             attributes: {
//                 include: [
//                     [
//                         Sequelize.fn("AVG", Sequelize.col("Reviews.stars")),
//                         "avgRating",
//                     ],
//                 ],
//             },
//             group: ["Spot.id", "SpotImages.url", "SpotImages.preview"],
//         });

//         res.status(200).json({
//             id: updatedSpot.id,
//             ownerId: updatedSpot.ownerId,
//             address: updatedSpot.address,
//             city: updatedSpot.city,
//             state: updatedSpot.state,
//             country: updatedSpot.country,
//             lat: updatedSpot.lat,
//             lng: updatedSpot.lng,
//             name: updatedSpot.name,
//             description: updatedSpot.description,
//             price: updatedSpot.price,
//             createdAt: updatedSpot.createdAt,
//             updatedAt: updatedSpot.updatedAt,
//             avgRating: parseFloat(updatedSpot.get("avgRating")) || null,
//             previewImage: updatedSpot.SpotImages[0]
//                 ? updatedSpot.SpotImages[0].url
//                 : null,
//         });
//     } catch (error) {
//         res.status(400).json({
//             message: "Error updating spot",
//             error: error.message,
//         });
//     }
// });

module.exports = router;
