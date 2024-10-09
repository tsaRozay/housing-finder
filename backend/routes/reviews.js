const express = require("express");
const router = express.Router();
const { Spot, Review } = require("../db/models");

// Add a review to a spot
router.post("/:spotId/reviews", async (req, res) => {
    const { content, rating, userId } = req.body;
    try {
        const spot = await Spot.findByPk(req.params.spotId);
        if (spot) {
            const newReview = await Review.create({
                content,
                rating,
                spotId: spot.id,
                userId,
            });
            res.status(201).json(newReview);
        } else {
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error adding review" });
    }
});

// Edit a review
router.patch("/:id", async (req, res) => {
    const { content, rating } = req.body;
    try {
        const review = await Review.findByPk(req.params.id);
        if (review) {
            await review.update({ content, rating });
            res.json(review);
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error editing review" });
    }
});

module.exports = router;
