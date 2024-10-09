const express = require("express");
const router = express.Router();
const { Spot, Booking } = require("../db/models");

// Get all bookings
router.get("/", async (req, res) => {
    try {
        const bookings = await Booking.findAll();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

// Create a booking for a spot
router.post("/:spotId/bookings", async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.body;
        const spot = await Spot.findByPk(req.params.spotId);

        if (spot) {
            const booking = await Booking.create({
                startDate,
                endDate,
                userId,
                spotId: spot.id,
            });
            res.status(201).json(booking);
        } else {
            res.status(404).json({ message: "Spot not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

// Edit a booking
router.patch("/:id", async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (booking) {
            const { startDate, endDate } = req.body;
            await booking.update({ startDate, endDate });
            res.json(booking);
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

// Cancel a booking
router.delete("/:id", async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.id);

        if (booking) {
            await booking.destroy();
            res.status(200).json({ message: "Booking canceled" });
        } else {
            res.status(404).json({ message: "Booking not found" });
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occurred",
            error: error.message,
        });
    }
});

module.exports = router;
