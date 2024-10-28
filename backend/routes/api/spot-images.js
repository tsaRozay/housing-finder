const express = require("express");
const router = express.Router();
const { Spot, SpotImage } = require("../../db/models");

// Delete a Spot Image
router.delete("/spot-images/:imageId", async (req, res) => {
    const image = await SpotImage.findByPk(req.params.imageId);

    // Error response: Couldn't find a Spot Image with the specified id
    if (!image) {
        return res
            .status(404)
            .json({ message: "Spot Image couldn't be found" });
    }

    await image.destroy();

    res.status(200).json({ message: "Successfully deleted" });
});

module.exports = router;
