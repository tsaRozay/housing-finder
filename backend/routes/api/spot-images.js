const express = require("express");
const router = express.Router();
const { Spot, SpotImage, User, Review, Booking } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Delete a spot image
router.delete("/:imageId", requireAuth, async (req, res) => {
    const { imageId } = req.params;
    const userId = req.user.id;

    // Find the image by id
    const image = await SpotImage.findByPk(imageId, {
        include: { model: Spot, attributes: ["ownerId"] },
    });

    if (!image) {
        return res
            .status(404)
            .json({ message: "Spot Image couldn't be found" });
    }

    // Check if the current user owns the spot associated with the image
    if (image.Spot.ownerId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    await image.destroy();
    return res.json({ message: "Successfully deleted" });
});

module.exports = router;