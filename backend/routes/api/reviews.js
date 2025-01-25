const express = require("express");
const {
    Review,
    Spot,
    User,
    ReviewImage,
    SpotImage,
    Sequelize,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const spotimage = require("../../db/models/spotimage.js");
const { Op } = require("sequelize");

const router = express.Router();

const validateReview = [
    check("review")
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check("stars")
        .exists({ checkFalsy: true })
        .isInt({ min: 1, max: 5 })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors,
];

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
    try {
        const reviews = await Review.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Spot,
                    attributes: {
                        include: [
                            [
                                Sequelize.literal(`(SELECT "url" FROM "SpotImages" as image
                        WHERE image.preview = true LIMIT 1)`),
                                "previewImage",
                            ],
                        ],
                    },
                },
                {
                    model: User,
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: ReviewImage,
                    as: "ReviewImages",
                    attributes: ["id", "url"],
                },
            ],
        });

        res.status(200).json({ Reviews: reviews });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/:reviewId/images", requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res
                .status(404)
                .json({ message: "Review couldn't be found" });
        }

        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        const imageCount = await ReviewImage.count({ where: { reviewId } });
        if (imageCount >= 10) {
            return res.status(403).json({
                message:
                    "Maximum number of images for this resource was reached",
            });
        }

        const newImage = await ReviewImage.create({
            reviewId,
            url,
        });

        res.status(201).json(newImage);
    } catch (err) {
        res.status(500).json({ message: "Failed to add image" });
    }
});

// Edit a Review
router.put("/:reviewId", requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { review, stars } = req.body;

    try {
        const existingReview = await Review.findByPk(reviewId);
        if (!existingReview) {
            return res
                .status(404)
                .json({ message: "Review couldn't be found" });
        }

        if (existingReview.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        if (!review || !stars || stars < 1 || stars > 5) {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                    review: "Review text is required",
                    stars: "Stars must be an integer from 1 to 5",
                },
            });
        }

        existingReview.review = review;
        existingReview.stars = stars;
        await existingReview.save();

        res.status(200).json(existingReview);
    } catch (err) {
        res.status(500).json({ message: "Failed to update the review" });
    }
});

// 6. Delete a Review
//same test remove review from front of route
router.delete("/:reviewId", requireAuth, async (req, res) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res
                .status(404)
                .json({ message: "Review couldn't be found" });
        }

        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await review.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete the review" });
    }
});

module.exports = router;