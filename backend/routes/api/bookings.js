// backend/routes/api/bookings.js

const express = require("express");
const { requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");
const router = express.Router();

// Get all of the Current User's Bookings
router.get("/current", requireAuth, async (req, res) => {
  const userId = req.user.id;

  const bookings = await Booking.findAll({
    where: { userId: userId },
    include: [
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
            where: { preview: true },
            attributes: ["url"],
            required: false,
          },
        ],
      },
    ],
  });

  const formattedBookings = bookings.map((booking) => {
    const spot = booking.Spot;
    const previewImage =
      spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null;

    return {
      id: booking.id,
      spotId: booking.spotId,
      Spot: {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        price: spot.price,
        previewImage: previewImage,
      },
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  });

  return res.json({ Bookings: formattedBookings });
});

// Edit a Booking
router.put('/:bookingid', requireAuth, async (req, res) => {
    const { bookingid } = req.params;
    const { startDate, endDate } = req.body;

    const booking = await Booking.findByPk(bookingid);
    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Check if the booking belongs to the user
    if (booking.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    // Validation checks
    if (new Date(startDate) <= new Date()) {
        return res.status(400).json({ message: "startDate cannot be in the past" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
        return res.status(400).json({ message: "endDate cannot be on or before startDate" });
    }

    // Update booking dates
    booking.startDate = startDate;
    booking.endDate = endDate;

    await booking.save();
    return res.json(booking);
});

// Delete a Booking
router.delete('/:bookingid', requireAuth, async (req, res) => {
    const { bookingid } = req.params;

    const booking = await Booking.findByPk(bookingid);
    if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Only allow deletion if the user owns the booking or the spot
    const spot = await Spot.findByPk(booking.spotId);
    if (booking.userId !== req.user.id && spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
    }

    // Prevent deletion of past bookings
    if (new Date() >= new Date(booking.endDate)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    await booking.destroy();
    return res.json({ message: "Successfully deleted" });
});


module.exports = router;