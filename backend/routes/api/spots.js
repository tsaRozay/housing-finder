const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const { where } = require('sequelize');
const { validateReview, validateSpot } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router();

// Add Query Filters to Get All Spots
router.get('/', async (req, res) => {
    const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const pageNum = parseInt(page);
    const sizeNum = parseInt(size);

    const errors = {};
    if (isNaN(pageNum) || pageNum < 1) errors.page = "Page must be greater than or equal to 1";
    if (isNaN(sizeNum) || sizeNum < 1 || sizeNum > 20) errors.size = "Size must be between 1 and 20";
    if (maxLat !== undefined && (isNaN(parseFloat(maxLat)) || maxLat > 90)) errors.maxLat = "Maximum latitude is invalid";
    if (minLat !== undefined && (isNaN(parseFloat(minLat)) || minLat < -90)) errors.minLat = "Minimum latitude is invalid";
    if (maxLng !== undefined && (isNaN(parseFloat(maxLng)) || maxLng > 180)) errors.maxLng = "Maximum longitude is invalid";
    if (minLng !== undefined && (isNaN(parseFloat(minLng)) || minLng < -180)) errors.minLng = "Minimum longitude is invalid";
    if (minPrice !== undefined && (isNaN(parseFloat(minPrice)) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
    if (maxPrice !== undefined && (isNaN(parseFloat(maxPrice)) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            "message": "Bad Request",
            "errors": errors
        });
    }

    const where = {};
    if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
    if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
    if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
    if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
    if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

    const limit = Math.min(sizeNum, 20);
    const offset = (pageNum - 1) * limit;

    const spots = await Spot.findAll({
        where,
        limit,
        offset,
        include: [
            {
                model: SpotImage,
                as: "SpotImages",
                where: { preview: true },
                required: false,
                attributes: ["url"],
            },
            {
                model: Review,
                attributes: [],
            },
        ],
        group: ["Spot.id", "SpotImages.id"],
        subQuery: false,
    });

    const result = spots.map((spot) => {
        const numReviews = spot.Reviews ? spot.Reviews.length : 0;
        const avgRating = numReviews > 0
            ? spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews
            : 0;
        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat ? parseFloat(spot.lat) : null,
            lng: spot.lng ? parseFloat(spot.lng) : null,
            name: spot.name,
            description: spot.description,
            price: spot.price ? parseFloat(spot.price) : null,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.dataValues.avgRating
                ? parseFloat(spot.dataValues.avgRating).toFixed(1)
                : null,

            previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null,
        };
    });

    res.json({
        Spots: result,
        page: pageNum,
        size: limit,
    });
});


//Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const spots = await Spot.findAll({
        where: {
            ownerId: userId
        },
        include: [
            {
                model: SpotImage,
                attributes: ["url"],
                where: { preview: true },
                required: false,

            },
            {
                model: Review,
                attributes: [],
            },
        ],
    });

    const result = spots.map((spot) => {
        const numReviews = spot.Reviews ? spot.Reviews.length : 0;
        const avgRating = numReviews > 0
            ? spot.Reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews
            : 0;
        return {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat ? parseFloat(spot.lat) : null,
            lng: spot.lng ? parseFloat(spot.lng) : null,
            name: spot.name,
            description: spot.description,
            price: spot.price ? parseFloat(spot.price) : null,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: spot.dataValues.avgRating
                ? parseFloat(spot.dataValues.avgRating).toFixed(1)
                : null,

            previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null,
        };
    });
    return res.status(200).json({ Spots: result });
});

//Get details of a Spot from an SpotId
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId, {
        include: [
            {
                model: SpotImage,
                attributes: ['id', 'url', 'preview']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            }
        ]
    });
    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    const reviews = await Review.findAll({
        where: { spotId }
    });
    const numReviews = reviews.length;
    const avgStarRating = numReviews > 0
        ? reviews.reduce((sum, review) => sum + review.stars, 0) / numReviews
        : 0;

    const spotDetails = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        numReviews: numReviews,
        avgStarRating: avgStarRating.toFixed(1),
        SpotImages: spot.SpotImages,
        Owner: spot.User
    };

    return res.json(spotDetails);
});

//Create a Spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const ownerId = req.user.id;
    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });

    return res.status(201).json({
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat ? parseFloat(spot.lat) : null,
        lng: spot.lng ? parseFloat(spot.lng) : null,
        name: spot.name,
        description: spot.description,
        price: spot.price ? parseFloat(spot.price) : null,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
    });
});

// Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const { url, preview } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(Number(spotId));

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    const createImage = await SpotImage.create({
        spotId: spot.id,
        url,
        preview,
    })

    return res.status(201).json({
        id: createImage.id,
        url: createImage.url,
        preview: createImage.preview,
    });
});

//Edit a Spot

router.put('/:spotId', requireAuth, validateSpot, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const { spotId } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(Number(spotId));

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    const updateSpot = await spot.update({ address, city, state, country, lat, lng, name, description, price });

    return res.status(200).json(updateSpot);
});

//Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
    const { spotId } = req.params;
    const userId = req.user.id;

    const spot = await Spot.findByPk(Number(spotId));

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found" });
    };

    if (spot.ownerId !== userId) {
        return res.status(403).json({ "message": "Forbidden" });
    }

    await spot.destroy();
    return res.status(200).json({
        "message": "Successfully deleted"
    })
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const { spotId } = req.params;

    const spot = await Spot.findByPk(Number(spotId));
    if (!spot) return res.status(404).json({ "message": "Spot couldn't be found" });

    const reviews = await Review.findAll({
        where: { spotId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url'],
            }
        ]
    })
    const formattedReviews = reviews.map(review => {
        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: {
                id: review.User.id,
                firstName: review.User.firstName,
                lastName: review.User.lastName
            },
            ReviewImages: review.ReviewImages.map(image => ({
                id: image.id,
                url: image.url
            }))
        };
    });
    return res.json({ Reviews: formattedReviews });
});

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res) => {
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const userId = req.user.id;

    const spot = await Spot.findByPk(Number(spotId));
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found"
        });
    };

    const existsReview = await Review.findOne({
        where: { spotId, userId },
    });
    if (existsReview) {
        return res.status(500).json({ "message": "User already has a review for this spot" });
    };

    const newReview = await Review.create({
        userId, spotId, review, stars,
    });
    return res.status(201).json(newReview);

});

module.exports = router;