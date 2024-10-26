const express = require("express");
const router = express.Router();
const { Spot, SpotImage, Review, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { Sequelize } = require("sequelize");

// Get all spots
router.get("/", async (req, res) => {
    try {
        const { city, minPrice, maxPrice, page = 1, size = 10 } = req.query;
        const limit = parseInt(size, 10) || 10;
        const offset = (parseInt(page, 10) - 1) * limit;

        let where = {};
        if (city) where.city = city;
        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Sequelize.Op.gte] = minPrice;
            if (maxPrice) where.price[Sequelize.Op.lte] = maxPrice;
        }

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
                    [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
                ],
            },
            group: ["Spot.id", "SpotImages.url", "SpotImages.preview"],
            limit,
            offset,
        });

        const formattedSpots = spots.map((spot) => {
            const previewImage = spot.SpotImages[0] ? spot.SpotImages[0].url : null;
            return {
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
                avgRating: parseFloat(spot.get("avgRating")) || null,
                previewImage,
            };
        });

        res.status(200).json(formattedSpots);
    } catch (error) {
        res.status(400).json({ message: "Error retrieving spots" });
    }
});

// Get all spots owned by the current user
router.get("/current", requireAuth, async (req, res) => {
    try {
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
                    [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
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
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
            avgRating: parseFloat(spot.get("avgRating")) || null,
            previewImage: spot.SpotImages[0] ? spot.SpotImages[0].url : null,
        }));

        res.status(200).json(formattedSpots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get details of a spot from an id
router.get("/:spotId", async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId, {
            include: [
                { model: SpotImage, attributes: ["id", "url", "preview"] },
                { model: Review, attributes: [] },
                { model: User, as: "Owner", attributes: ["id", "firstName", "lastName"] },
            ],
            attributes: {
                include: [
                    [Sequelize.fn("COUNT", Sequelize.col("Reviews.id")), "numReviews"],
                    [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgStarRating"],
                ],
            },
            group: ["Spot.id", "SpotImages.id", "Owner.id"],
        });

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        const spotDetails = {
            ...spot.toJSON(),
            numReviews: spot.get("numReviews"),
            avgStarRating: parseFloat(spot.get("avgStarRating")) || null,
        };

        res.status(200).json(spotDetails);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving spot" });
    }
});

module.exports = router;
