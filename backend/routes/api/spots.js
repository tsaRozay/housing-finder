const express = require("express");
const router = express.Router();
const { Spot, SpotImage, Amenity, Review } = require("../../db/models");

// Get all spots
router.get("/", async (req, res) => {
    try {
        const spots = await Spot.findAll({
            include: [SpotImage, Amenity, Review],
        });
        res.json(spots);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving spots" });
    }
});

// Get all spots owned by the current user
router.get("/current", async (req, res) => {
    try {
        const userId = req.user.id;
        const spots = await Spot.findAll({ where: { ownerId: userId } });
        res.json(spots);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new spot, might need to change userId to ownerId later
router.post("/", async (req, res) => {
    try {
        const { name, description, price, countryId, userId } = req.body;
        const newSpot = await Spot.create({
            name,
            description,
            price,
            countryId,
            userId,
        });
        res.status(201).json(newSpot);
    } catch (error) {
        res.status(500).json({ message: "Error creating spot" });
    }
});

// Get details of a spot from an id
router.get("/:id", async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.id, {
            include: [SpotImage, Amenity],
        });
        if (spot) {
            res.json(spot);
        } else {
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Errpr retrieving spot" });
    }
});

// Edit spot details
router.patch("/:id", async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const spot = await Spot.findByPk(req.params.id);
        if (spot) {
            await spot.update({ name, description, price });
            res.json(spot);
        } else {
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating spot" });
    }
});

// Add an image to a spot
router.post("/:spotId/images", async (req, res) => {
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
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a spot
router.delete("/:id", async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.id);
        if (spot) {
            await spot.destroy();
            res.status(204).json({ message: "Spot deleted successfully" });
        } else {
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
