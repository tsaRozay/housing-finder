const express = require("express");
const router = express.Router();
const { Spot, SpotImage, Review, User } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { Sequelize } = require("sequelize");

// Create a new spot
router.post("/", requireAuth, async (req, res) => {
    try {
        const { name, description, price, country, address, city, state, lat, lng } = req.body;
        const ownerId = req.user.id;

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

        const createdSpot = await Spot.findByPk(newSpot.id, {
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

        res.status(201).json({
            id: createdSpot.id,
            ownerId: createdSpot.ownerId,
            address: createdSpot.address,
            city: createdSpot.city,
            state: createdSpot.state,
            country: createdSpot.country,
            lat: createdSpot.lat,
            lng: createdSpot.lng,
            name: createdSpot.name,
            description: createdSpot.description,
            price: createdSpot.price,
            createdAt: createdSpot.createdAt,
            updatedAt: createdSpot.updatedAt,
            avgRating: parseFloat(createdSpot.get("avgRating")) || null,
            previewImage: createdSpot.SpotImages[0] ? createdSpot.SpotImages[0].url : null,
        });
    } catch (error) {
        res.status(400).json({ message: "Error creating spot", error: error.message });
    }
});

// Edit spot details
router.put("/:spotId", requireAuth, async (req, res) => {
    try {
        const spotId = req.params.spotId;
        const { name, description, price, address, city, state, country, lat, lng } = req.body;

        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to edit this spot" });
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
                    [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), "avgRating"],
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
            avgRating: parseFloat(updatedSpot.get("avgRating")) || null,
            previewImage: updatedSpot.SpotImages[0] ? updatedSpot.SpotImages[0].url : null,
        });
    } catch (error) {
        res.status(400).json({ message: "Error updating spot", error: error.message });
    }
});

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

// Delete a spot
router.delete("/:spotId", requireAuth, async (req, res) => {
    try {
        const spotId = req.params.spotId;

        // Find the spot by primary key
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({ message: "Couldn't find a Spot with the specified id" });
        }

        // Ensure the authenticated user is the owner of the spot
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "You are not allowed to delete this spot" });
        }

        // Delete the spot
        await spot.destroy();

        res.status(200).json({ message: "Spot deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
