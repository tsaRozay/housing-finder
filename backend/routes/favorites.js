const express = require("express");
const router = express.Router();
const { User, Favorite } = require("../db/models");

// Add a spot to favorites for a user
router.post("/:userId/favorites", async (req, res) => {
    try {
        const { spotId } = req.body;
        const user = await User.findByPk(req.params.userId);

        if (user) {
            const favorite = await Favorite.create({ userId: user.id, spotId });
            res.status(201).json(favorite);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

// Remove a spot from favorites
router.delete("/:userId/favorites/:spotId", async (req, res) => {
    try {
        const { userId, spotId } = req.params;
        const favorite = await Favorite.findOne({ where: { userId, spotId } });

        if (favorite) {
            await favorite.destroy();
            res.status(200).json({ message: "Favorite removed" });
        } else {
            res.status(404).json({ message: "Favorite not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

module.exports = router;
