const express = require("express");
const router = express.Router();
const {
    User,
    Spot,
    Review,
    Booking,
    SpotImage,
    ReviewImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Helper function, retrieves preview image URL
const getPreviewImage = async (spotId) => {
    const image = await SpotImage.findOne({ where: { spotId } });
    return image ? image.url : null;
};

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: { userId },
        include: [
            { model: User, attributes: ["id", "firstName", "lastName"] },
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
                        as: "SpotImages",
                        where: { preview: true },
                        attributes: ["url"],
                        required: false,
                    },
                ],
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"],
            },
        ],
    });

    if (!reviews.length) {
        return res.status(404).json({ message: "No reviews found" });
    }

    const reviewsWithDetails = await Promise.all(
        reviews.map(async (review) => {
            const spot = review.Spot;
            const previewImage = await getPreviewImage(spot.id);
            const reviewImages = await ReviewImage.findAll({
                where: { reviewId: review.id },
                attributes: ["id", "url"],
            });

            return {
                ...review.toJSON(),
                Spot: { ...spot.toJSON(), previewImage },
                ReviewImages: reviewImages,
            };
        })
    );

    return res.json({ Reviews: reviewsWithDetails });
});

// Add Image to a Review based on the Review's id
router.post("/:id/images", requireAuth, async (req, res) => {
    const { id: reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review)
        return res.status(404).json({ message: "Review couldn't be found" });
    if (review.userId !== userId)
        return res.status(403).json({ message: "Forbidden" });

    const imageCount = await ReviewImage.count({ where: { reviewId } });
    if (imageCount >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
        });
    }

    const newImage = await ReviewImage.create({ reviewId, url });
    return res.status(201).json({ id: newImage.id, url: newImage.url });
});

// Edit a Review
router.put("/:reviewId", requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const { reviewId } = req.params;
    const userId = req.user.id;

    const reviewToEdit = await Review.findByPk(reviewId);

    if (!reviewToEdit)
        return res.status(404).json({ message: "Review couldn't be found" });
    if (reviewToEdit.userId !== userId)
        return res.status(403).json({ message: "Forbidden" });

    if (!review || typeof stars !== "number" || stars < 1 || stars > 5) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
                review: "Review text is required",
                stars: "Stars must be an integer from 1 to 5",
            },
        });
    }

    reviewToEdit.set({ review, stars });
    await reviewToEdit.save();

    return res.json(reviewToEdit);
});

// Delete a Review
router.delete("/:id", requireAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(id);

    if (!review)
        return res.status(404).json({ message: "Review couldn't be found" });
    if (review.userId !== userId)
        return res.status(403).json({ message: "Forbidden" });

    await review.destroy();
    return res.json({ message: "Successfully deleted" });
});

module.exports = router;