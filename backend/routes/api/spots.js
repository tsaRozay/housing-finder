const express = require("express");
const router = express.Router();
const { Spot, SpotImage, Amenity, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Get all spots with query filters and pagination
router.get("/spots", async (req, res) => {
    try {
        const { city, minPrice, maxPrice, page = 1, size = 10 } = req.query;

        // Convert page and size to integers
        const limit = parseInt(size, 10) || 10; // Default page size to 10
        const offset = (parseInt(page, 10) - 1) * limit; 

        // Build the filter options based on the query parameters
        let where = {};

        if (city) {
            where.city = city;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) {
                where.price[Sequelize.Op.gte] = minPrice;
            }
            if (maxPrice) {
                where.price[Sequelize.Op.lte] = maxPrice;
            }
        }

        // pagination and filters applied
        const spots = await Spot.findAndCountAll({
            where,
            include: [SpotImage, Amenity, Review],
            limit,
            offset,
        });

        res.status(200).json({
            spots: spots.rows,
            page: parseInt(page, 10),
            size: parseInt(size, 10),
            totalItems: spots.count,
        });
    } catch (error) {
        res.status(400).json({ message: "Error retrieving spots" });
    }
});


// Get all spots owned by the current user
router.get("/spots/current", requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const spots = await Spot.findAll({ where: { ownerId: userId } });
        res.json(spots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new spot, might need to change userId to ownerId later
router.post("/spots", requireAuth, async (req, res) => {
    try {
        const {
            id,
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
            createdAt,
            updatedAt,
        } = req.body;
        const newSpot = await Spot.create({
            id,
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
            countryId,
            createdAt,
            updatedAt,
        });
        res.status(201).json(newSpot);
    } catch (error) {
        res.status(400).json({ message: "Error creating spot" });
    }
});

// Get details of a spot from an id
router.get("/:id", async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.id, {
            include: [SpotImage, Amenity],
        });
        if (spot) {
            res.status(200).json(spot);
        } else {
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Errpr retrieving spot" });
    }
});

// Edit spot details
router.put("/spots/:spotId", requireAuth, async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const spot = await Spot.findByPk(req.params.id);
        if (spot) {
            await spot.update({ name, description, price });
            res.status(200).json(spot);
        } else {
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(400).json({ message: "Error updating spot" });
    }
});

// Add an image to a spot by spot id
router.post("/spots/:spotId/images", requireAuth, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const spot = await Spot.findByPk(req.params.spotId);
        if (spot) {
            const newImage = await SpotImage.create({
                spotId: spot.id,
                imageUrl,
            });
            res.status(201).json(newImage);
        } else {
            res.status(403).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a spot image
router.delete("/images/:imageId", requireAuth, async (req, res) => {
    try {
        const spotImage = await SpotImage.findByPk(req.params.imageId);

        if (spotImage) {
            await spotImage.destroy();
            res.status(204).json({
                message: "Spot image deleted successfully",
            });
        } else {
            res.status(404).json({ message: "Spot image not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a spot
router.delete("/spots/:spotId", requireAuth, async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId);
        if (spot) {
            await spot.destroy();
            res.status(200).json({ message: "Spot deleted successfully" });
        } else {
            res.status(404).json({
                message: "Couldn't find a Spot with the specified id",
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
