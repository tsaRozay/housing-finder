const express = require('express');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

// Helper functions
const calculateAvgRating = reviews => 
    reviews.length > 0 ? reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length : 0;

const getPreviewImage = spotImages => 
    spotImages[0] ? spotImages[0].url : null;

const mapSpotsData = spots => 
    spots.map(spot => {
        const spotData = spot.toJSON();
        return {
            ...spotData,
            avgRating: calculateAvgRating(spotData.Reviews),
            previewImage: getPreviewImage(spot.SpotImages),
        };
    });

// GET ALL SPOTS
router.get("/", async (req, res, next) => {
    try {
        const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

        const pagination = parseInt(page, 10) >= 1 && parseInt(size, 10) >= 1 && parseInt(size, 10) <= 20
            ? { limit: parseInt(size, 10), offset: (parseInt(page, 10) - 1) * parseInt(size, 10) }
            : res.status(400).json({ message: "Bad Request", errors: { page: "Page must be >= 1", size: "Size between 1 and 20" }});

        const where = {};
        if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
        if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
        if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
        if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
        if (minPrice && parseFloat(minPrice) >= 0) where.price = { [Op.gte]: parseFloat(minPrice) };
        if (maxPrice && parseFloat(maxPrice) >= 0) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

        const spots = await Spot.findAll({
            include: [
                { model: Review, attributes: ['stars'] },
                { model: SpotImage, attributes: ['url'] }
            ],
            where,
            ...pagination
        });

        res.status(200).json({ Spots: mapSpotsData(spots), page: parseInt(page, 10), size: parseInt(size, 10) });
    } catch (err) {
        next(err);
    }
});

// GET ALL SPOTS OWNED BY THE CURRENT USER
router.get('/current', requireAuth, async (req, res, next) => {
    const userId = req.user.id;

    try {
        const spots = await Spot.findAll({
            where: { ownerId: userId },
            include: [
                { model: Review, attributes: ['stars'] },
                { model: SpotImage, attributes: ['url'] }
            ]
        });

        res.json({ Spots: mapSpotsData(spots) });
    } catch (err) {
        next(err);
    }
});

// GET DETAILS OF A SPOT FROM AN ID
router.get('/:spotId', async (req, res, next) => {
    try {
        const id = req.params.spotId;
        const spot = await Spot.findByPk(id, {
            include: [
                { model: Review, attributes: ['stars'] },
                { model: SpotImage, attributes: ['id', 'url', 'preview'] },
                { model: User, as: "Owner", attributes: ['id', 'firstName', 'lastName'] }
            ]
        });

        if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

        const spotData = spot.toJSON();
        const avgStarRating = calculateAvgRating(spotData.Reviews);

        const spotDetails = {
            ...spotData,
            numReviews: spotData.Reviews.length,
            avgStarRating,
        };

        res.json(spotDetails);
    } catch (err) {
        next(err);
    }
});

// Create a Spot
const validateSpot = [
    check('address').notEmpty().withMessage('Street address is required'),
    check('city').notEmpty().withMessage('City is required'),
    check('state').notEmpty().withMessage('State is required'),
    check('country').notEmpty().withMessage('Country is required'),
    check('lat').notEmpty().isFloat({ min: -90, max: 90 }).withMessage('Latitude must be within -90 and 90'),
    check('lng').notEmpty().isFloat({ min: -180, max: 180 }).withMessage('Longitude must be within -180 and 180'),
    check('name').notEmpty().isLength({ max: 50 }).withMessage('Name must be less than 50 characters'),
    check('description').notEmpty().withMessage('Description is required'),
    check('price').notEmpty().isFloat({ gt: 0 }).withMessage('Price per day must be a positive number')
];

module.exports = router;
