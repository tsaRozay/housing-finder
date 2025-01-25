const express = require('express');
const { Spot, Image, Booking } = require('../../db/models');
const { requireAuth, checkOwnership } = require('../../utils/auth');
const { formatDate, formatDateTime } = require('./utils/date-formatter.js');
const { validateBooking } = require('../../utils/validation');

const router = express.Router();

//~GET BOOKINGS BY CURR USER
//! req auth
router.get('/current', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{
          model: Spot,
          attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
          include: [{
            model: Image,
            as: 'Images',
            attributes: ['url'],
            limit: 1,
          }],
        },
      ],
    });

    if (!bookings) return res.status(404).json({ error: `No bookings found`});

    const responseData = bookings.map( booking => {
      const { Spot, Images, startDate, endDate, createdAt, updatedAt, userId,  ...bookingData } = booking.get();

      return {
        ...bookingData,
        createdAt: formatDateTime(createdAt),
        updatedAt: formatDateTime(updatedAt),
        Spot: {
          id: Spot.id,
          ownerId: Spot.ownerId,
          address: Spot.address,
          city: Spot.city,
          state: Spot.state,
          country: Spot.country,
          lat: Spot.lat,
          lng: Spot.lng,
          name: Spot.name,
          price: Spot.price,
          previewImage: Spot.Images.length ? Spot.Images[0].url : null
        },
        userId: booking.userId,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        createdAt: formatDateTime(createdAt),
        updatedAt: formatDateTime(updatedAt),
      };
    });

    res.json({'Bookings': responseData });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
});

//~EDIT A BOOKING
//! require auth and ownership
router.put('/:bookingId', requireAuth, checkOwnership(Booking, 'bookingId', 'userId'),   // validateBooking,
async (req, res) => {
  res.status(503).json({ message: 'This route is currently under construction.' });
});

//~DELETE A BOOKING
//! req auth and ownership of booking
router.delete('/:bookingId', requireAuth, checkOwnership(Booking, 'bookingId', 'userId'),
async (req, res) => {
  try {
    //^ get curr date for checks
    const currDate = new Date();
    const booking = await Booking.findByPk(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: `Booking couildn't be found` });

    if (booking.startDate <= currDate && booking.endDate >= currDate) {
        return res.status(403).json({ message: `Bookings that have been started can't be deleted`});
    };

    booking.destroy();

    res.json({ message: 'Successfully deleted'});
  } catch (error) {
      console.error('Error deleteing booking:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  };
});

module.exports = router;