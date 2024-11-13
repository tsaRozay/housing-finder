const express = require("express");
const {
    Spot,
    Review,
    User,
    ReviewImage,
    SpotImage,
    Sequelize,
} = require("../../db/models"); // Assuming models are in a folder named models
const router = express.Router();
const { requireAuth, restoreUser,} = require("../../utils/auth");

// Route: Add an Image to a Spot by ID
// Method: POST
// Path: /api/spots/:spotId/images
// Description: Adds a new image to a specific spot, only if the user is the owner of the spot.

router.post('/:spotId/images', restoreUser, requireAuth, async (req, res) => {
    const { spotId } = req.params; // Spot ID from URL parameters
    const { url, preview } = req.body; // URL and preview status from request body

    try {
        // 1. Fetch the spot by ID to ensure it exists
        const spot = await Spot.findByPk(spotId);

        // 2. If the spot doesn't exist, return a 404 error
        if (!spot) {
            return res.status(404).json({ message: "Spot couldn't be found" });
        }

        // 3. Authorization check: ensure the current user is the spot owner
        // Assumes `req.user.id` is available from `restoreUser` middleware
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        // 4. Create a new SpotImage for the given spot with provided URL and preview status
        const newSpotImage = await SpotImage.create({
            spotId, // Reference to the spot
            url,    // Image URL
            preview // Boolean for whether this is the preview image
        });

        // 5. Return the created image with a 201 status code
        return res.status(201).json(newSpotImage);
        
    } catch (err) {
        // 6. Error handling: return a 400 status for any issues with details from `err.errors`
        return res.status(400).json({
            message: 'Error adding image',
            errors: err.errors || err.message, // Include message for unexpected errors
        });
    }
});



// Route: Delete a Spot Image
// Method: DELETE
// Path: /api/spot-images/:imageId
// Description: Deletes a specific image of a spot. The user must be the owner of the spot.
router.delete("/:imageId", restoreUser, requireAuth, async (req, res) => {
    const { imageId } = req.params;

    try {
        // Find the spot image
        const spotImage = await SpotImage.findByPk(imageId);

        if (!spotImage) {
            return res
                .status(404)
                .json({ message: "Spot Image couldn't be found" });
        }

        // Fetch the associated spot to check ownership
        const spot = await Spot.findByPk(spotImage.spotId);

        // Placeholder for authorization check
        if (spot.ownerId !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        await spotImage.destroy();
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;