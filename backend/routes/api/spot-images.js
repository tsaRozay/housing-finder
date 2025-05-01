const express = require("express");
const router = express.Router(); // this is the router object
const { requireAuth } = require("../../utils/auth.js");

const {
  User,
  Spot,
  SpotImage,
  ReviewImage,
  Review,
  Booking,
} = require("../../db/models/index.js");
const { check, query } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation.js");
const { Op, Model } = require("sequelize");
const { reviewValidation } = require("../../utils/validation.js");

router.delete("/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;
  try {
    const image = await SpotImage.findByPk(imageId, {
      include: {
        model: Spot,
      },
    });

    if (!image)
      return res.status(404).json({ message: "Could not find image." });

    if (!image.Spot || image.Spot.ownerId !== userId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    
    await image.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;