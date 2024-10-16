const express = require("express");
const router = express.Router();
const { Spot, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Get all reviews of the current user
router.get("/current", requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.findAll({ where: { userId } });
        res.status(200).json(reviews);
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
        res.status(200).json(reviews);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Create a review for a spot based on spots id
router.post("/spots/:spotId/reviews", requireAuth, async (req, res) => {
    try {
        const { content, stars, userId } = req.body; // Assuming stars is provided in request body
        const spot = await Spot.findByPk(req.params.spotId);

        // Error response: Couldn't find a Spot with the specified id
        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found",
                statusCode: 404
            });
        }

        // Error response: Review from the current user already exists for the Spot
        const existingReview = await Review.findOne({
            where: {
                spotId: spot.id,
                userId
            }
        });

        if (existingReview) {
            return res.status(403).json({
                message: "Review from the current user already exists for the Spot",
                statusCode: 403
            });
        }

        // Validate stars to be between 1 and 5
        if (stars < 1 || stars > 5) {
            return res.status(400).json({
                message: "Stars must be an integer from 1 to 5",
                statusCode: 400
            });
        }

        const newReview = await Review.create({
            content,
            stars,
            spotId: spot.id,
            userId
        });

        res.status(201).json(newReview);
    } catch (error) {
        res.status(500).json({ message: "Error creating review" });
    }
});


// Edit a review
router.patch("/reviews/:id", requireAuth, async (req, res) => {
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

// Add an image to a review based on the reviews id 
router.post("/reviews/:reviewId/images", requireAuth, async (req, res) => {
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
router.delete("/reviews/:id", requireAuth, async (req, res) => {
    try {
        const review = await Review.findByPk(req.params.id);
        if (review) {
            if (review.userId !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized" });
            }
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
