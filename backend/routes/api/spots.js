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

// Create a new spot
router.post("/", async (req, res) => {
    const { name, description, price, countryId, userId } = req.body;
    try {
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

// Get a spot by ID
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

// Update spot details
router.patch("/:id", async (req, res) => {
    const { name, description, price } = req.body;
    try {
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

module.exports = router;
