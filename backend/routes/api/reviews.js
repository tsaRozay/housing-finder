const express = require("express");
const router = express.Router();
const { Spot, Review } = require("../../db/models");

// Get all reviews of the current user
router.get("/current", async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.findAll({ where: { userId } });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all reviews by a spot's id
router.get("/spots/:spotId/reviews", async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { spotId: req.params.spotId },
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a review for a spot
router.post("/spots/:spotId/reviews", async (req, res) => {
    try {
        const { content, rating, userId } = req.body;
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
        res.status(500).json({ message: "Error creating review" });
    }
});

// Edit a review
router.patch("/reviews/:id", async (req, res) => {
    try {
        const { content, rating } = req.body;
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

// Add an image to a review
router.post("/reviews/:reviewId/images", async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const review = await Review.findByPk(req.params.reviewId);
        if (review) {
            const newImage = await ReviewImage.create({
                reviewId: review.id,
                imageUrl,
            });
            res.status(201).json(newImage);
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a review
router.delete("/reviews/:id", async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (review) {
            await review.destroy();
            res.status(204).json({ message: "Review deleted successfully" });
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
