const express = require("express");
const router = express.Router();
const {
    Review,
    ReviewImage,
    User,
    Spot,
    Booking,
    SpotImage,
} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Delete review image
router.delete("/:imageId", requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    const image = await ReviewImage.findByPk(imageId, {
        include: { model: Review, attributes: ["userId"] },
    });

    if (!image) {
        return res
            .status(404)
            .json({ message: "Review Image couldn't be found" });
    }

    // Check if current user is the owner of the review
    if (image.Review.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    await image.destroy();
    return res.json({ message: "Successfully deleted" });
});

module.exports = router;