const express = require("express");
const router = express.Router();
const { Country, Spot } = require("../../db/models");

// Get all countries
router.post("/", async (req, res) => {
    try {
        const countries = await Country.findAll();
        res.json(countries);
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

// Get all spots in a specific country (might need to be in the spots.js)
router.get("/:id/spots", async (req, res) => {
    try {
        const spots = await Spot.findAll({
            where: { countryId: req.params.id },
        });
        res.json(spots);
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

module.exports = router;
