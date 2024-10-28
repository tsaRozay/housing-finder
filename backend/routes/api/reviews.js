const express = require("express");
const router = express.Router();
const { Spot, Review, ReviewImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Get All Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviews = await Review.findAll({
        where: { userId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"],
            },
            {
                model: Spot,
                attributes: [
                    "id",
                    "ownerId",
                    "address",
                    "city",
                    "state",
                    "country",
                    "lat",
                    "lng",
                    "name",
                    "price",
                ],
                include: [
                    {
                        model: SpotImage,
                        attributes: ["id", "url"],
                        where: { preview: true },
                        required: false,
                    },
                ],
            },
        ],
    });

    // Format response to include ReviewImages
    const formattedReviews = reviews.map((review) => {
        const reviewImages = review.ReviewImages || [];
        return {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            updatedAt: review.updatedAt
                .toISOString()
                .slice(0, 19)
                .replace("T", " "),
            User: review.User,
            Spot: {
                ...review.Spot,
                previewImage:
                    review.Spot.SpotImages.length > 0
                        ? review.Spot.SpotImages[0].url
                        : "image url",
            },
            ReviewImages: reviewImages.map((img) => ({
                id: img.id,
                url: img.url,
            })),
        };
    });

    res.status(200).json({ Reviews: formattedReviews });
});

// Add an Image to a Review Based on the Review's id
router.post("/:reviewId/images", requireAuth, async (req, res) => {
    const { imageUrl } = req.body;
    const review = await Review.findByPk(req.params.reviewId);

    // Error response: Couldn't find a Review with the specified id
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check how many images are already associated with the review
    const existingImages = await ReviewImage.count({
        where: {
            reviewId: review.id,
        },
    });

    // Error response: Cannot add more than 10 images per resource
    if (existingImages >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
        });
    }

    const newImage = await ReviewImage.create({
        reviewId: review.id,
        imageUrl,
    });

    res.status(201).json({
        id: newImage.id,
        url: newImage.imageUrl,
    });
});

// Edit a Review
router.put("/:reviewId", requireAuth, async (req, res) => {
    const { content, stars } = req.body;
    const review = await Review.findByPk(req.params.reviewId);

    // Error response: Couldn't find a Review with the specified id
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if the current user is the owner of the review
    if (review.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const validationErrors = {};
    if (!content || content.trim() === "") {
        validationErrors.review = "Review text is required";
    }
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
        validationErrors.stars = "Stars must be an integer from 1 to 5";
    }
    if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({
            message: "Bad Request",
            errors: validationErrors,
        });
    }

    await review.update({ content, stars });

    res.status(200).json(review);
});

// Delete a Review
router.delete("/:reviewId", requireAuth, async (req, res) => {
    const review = await Review.findByPk(req.params.reviewId);

    // Error response: Couldn't find a Review with the specified id
    if (!review) {
        return res.status(404).json({ message: "Review couldn't be found" });
    }

    // Check if the current user is the owner of the review
    if (review.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    await review.destroy();

    res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
