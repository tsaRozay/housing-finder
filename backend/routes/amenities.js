const express = require("express");
const router = express.Router();
const { Spot, SpotAmenity, Amenity } = require("../db/models");

// Get all amenities
router.get("/", async (req, res) => {
    try {
        const amenities = await Amenity.findAll();
        res.json(amenities);
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

// Add an amenity to a spot
router.post("/:spotId/amenities", async (req, res) => {
    try {
        const { amenityId } = req.body;
        const spot = await Spot.findByPk(req.params.spotId);

        if (spot) {
            const spotAmenity = await SpotAmenity.create({
                spotId: spot.id,
                amenityId,
            });
            res.status(201).json(spotAmenity);
        } else {
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

module.exports = router;
