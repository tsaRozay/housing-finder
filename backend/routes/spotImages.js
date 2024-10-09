const express = require("express");
const router = express.Router();
const { Spot, SpotImage } = require("../db/models");

// Add an image to a spot
router.post("/:spotId/images", async (req, res) => {
    const { imageUrl } = req.body;
    try {
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
        res.status(500).json({ message: "Error adding image to spot" });
    }
});

// Delete an image from a spot
router.delete("/:spotId/images/:imageId", async (req, res) => {
    try {
        const image = await SpotImage.findByPk(req.params.imageId);
        if (image) {
            await image.destroy();
            res.json({ message: "Image deleted" });
        } else {
            res.status(404).json({ message: "Image not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error deleting Image" });
    }
});

module.exports = router;
