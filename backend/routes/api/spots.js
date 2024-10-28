// backend/routes/api/spots.js

const express = require("express");
const { requireAuth } = require("../../utils/auth");
const {
  handleValidationErrors,
  validateSpot,
} = require("../../utils/validation");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
  Booking,
  sequelize,
} = require("../../db/models");
const { Op } = require("sequelize");
const router = express.Router();

// Add Query Filters to Get All Spots
router.get("/", async (req, res) => {
  const {
    page = 1,
    size = 20,
    minLat,
    maxLat,
    minLng,
    maxLng,
    minPrice,
    maxPrice,
  } = req.query;

  const pageNum = parseInt(page);
  const sizeNum = parseInt(size);

  const errors = {};
  if (isNaN(pageNum) || pageNum < 1) errors.page = "Page must be greater than or equal to 1";
  if (isNaN(sizeNum) || sizeNum < 1 || sizeNum > 20) errors.size = "Size must be between 1 and 20";
  if (maxLat !== undefined && (isNaN(parseFloat(maxLat)) || maxLat > 90)) errors.maxLat = "Maximum latitude is invalid";
  if (minLat !== undefined && (isNaN(parseFloat(minLat)) || minLat < -90)) errors.minLat = "Minimum latitude is invalid";
  if (maxLng !== undefined && (isNaN(parseFloat(maxLng)) || maxLng > 180)) errors.maxLng = "Maximum longitude is invalid";
  if (minLng !== undefined && (isNaN(parseFloat(minLng)) || minLng < -180)) errors.minLng = "Minimum longitude is invalid";
  if (minPrice !== undefined && (isNaN(parseFloat(minPrice)) || minPrice < 0)) errors.minPrice = "Minimum price must be greater than or equal to 0";
  if (maxPrice !== undefined && (isNaN(parseFloat(maxPrice)) || maxPrice < 0)) errors.maxPrice = "Maximum price must be greater than or equal to 0";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Bad Request",
      errors: errors,
    });
  }

  const where = {};
  if (minLat) where.lat = { [Op.gte]: parseFloat(minLat) };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: parseFloat(maxLat) };
  if (minLng) where.lng = { [Op.gte]: parseFloat(minLng) };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: parseFloat(maxLng) };
  if (minPrice) where.price = { [Op.gte]: parseFloat(minPrice) };
  if (maxPrice)
    where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

  const limit = Math.min(sizeNum, 20);
  const offset = (pageNum - 1) * limit;

  const spots = await Spot.findAll({
    where,
    limit,
    offset,
    include: [
      {
        model: SpotImage,
        as: "SpotImages",
        where: { preview: true },
        required: false,
        attributes: ["url"],
      },
      {
        model: Review,
        attributes: [],
      },
    ],
    group: ["Spot.id", "SpotImages.id"],
    subQuery: false,
  });

  const result = spots.map((spot) => {
    const numReviews = spot.Reviews ? spot.Reviews.length : 0;
    const avgRating =
      numReviews > 0
        ? spot.Reviews.reduce((sum, review) => sum + review.stars, 0) /
          numReviews
        : 0;
    return {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat ? parseFloat(spot.lat) : null,
      lng: spot.lng ? parseFloat(spot.lng) : null,
      name: spot.name,
      description: spot.description,
      price: spot.price ? parseFloat(spot.price) : null,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      avgRating: spot.dataValues.avgRating
        ? parseFloat(spot.dataValues.avgRating).toFixed(1)
        : null,

      previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null,
    };
  });

  res.json({
    Spots: result,
    page: pageNum,
    size: limit,
  });
});

// Get all Spots owned by the Current User
router.get("/current", requireAuth, async (req, res, next) => {
  const userId = req.user.id;

  const spots = await Spot.findAll({
    where: { ownerId: userId },
    attributes: {
      include: [
        [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgStarRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [], // Exclude Review data
      },
      {
        model: SpotImage,
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
    ],
  });
  // Format the response
  const formattedSpots = spots.map((spot) => ({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    avgRating: spot.getDataValue("avgStarRating") || 0, // Default to 0 if no reviews
    previewImage: spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null, // Get the preview image URL
  }));

  return res.json({
    Spots: formattedSpots,
  });
});

// Get details of a Spot from a spotid
router.get("/:spotid", async (req, res) => {
  const { spotid } = req.params;

  const spot = await Spot.findByPk(spotid, {
    include: [
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Review,
        attributes: [],
      },
    ],
  });

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Calculate numReviews and avgStarRating
  const numReviews = await Review.count({
    where: { spotId: spotid },
  });

  const avgStarRating = await Review.findOne({
    where: { spotId: spotid },
    attributes: [
      [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
    ],
    raw: true,
  });

  return res.json({
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt,
    numReviews: numReviews,
    avgStarRating: avgStarRating.avgStarRating
      ? Math.round(parseFloat(avgStarRating.avgStarRating) * 10) / 10
      : null,
    SpotImages: spot.SpotImages,
    Owner: {
      id: spot.ownerId,
      firstName: spot.User.firstName,
      lastName: spot.User.lastName,
    },
  });
});

// Create a Spot
router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  try {
    const spot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    return res.status(201).json(spot);
  } catch (error) {
    return res.status(400).json({
      message: "Bad Request",
      errors: error.errors,
    });
  }
});

// Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const userId = req.user.id;

  const spot = await Spot.findByPk(Number(spotId));

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  const createImage = await SpotImage.create({
    spotId: spot.id,
    url,
    preview,
  });

  return res.status(201).json({
    id: createImage.id,
    url: createImage.url,
    preview: createImage.preview,
  });
});

// Edit a Spot
router.put("/:spotid", requireAuth, validateSpot, async (req, res) => {
  const { spotid } = req.params;
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  const userId = req.user.id;

  const spot = await Spot.findByPk(Number(spotid));

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  try {
    spot.set({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });
    await spot.save();

    return res.json(spot);
  } catch (error) {
    return res.status(400).json({
      message: "Bad Request",
      errors: error.errors,
    });
  }
});

// Delete a Spot
router.delete("/:spotid", requireAuth, async (req, res) => {
  const { spotid } = req.params;
  const userId = req.user.id;

  const spot = await Spot.findByPk(Number(spotid));

  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await Review.destroy({ where: { spotId: spotid } });
  await Booking.destroy({ where: { spotId: spotid } });
  await SpotImage.destroy({ where: { spotId: spotid } });

  await spot.destroy();
  return res.json({
    message: "Successfully deleted",
  });
});

// Get all Reviews by a Spot's id
router.get("/:spotid/reviews", async (req, res) => {
  const { spotid } = req.params;

  // Check if the spot exists
  const spot = await Spot.findByPk(Number(spotid));

  console.log(spot);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Get reviews for the spot
  const reviews = await Review.findAll({
    where: { spotId: spotid },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });
  // Format the response
  const formattedReviews = reviews.map((review) => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    User: {
      id: review.User.id,
      firstName: review.User.firstName,
      lastName: review.User.lastName,
    },
    ReviewImages: review.ReviewImages.map((image) => ({
      id: image.id,
      url: image.url,
    })),
  }));

  return res.json({ Reviews: formattedReviews });
});

// Create a Review for a Spot based on the Spot's id
router.post("/:spotid/reviews", requireAuth, async (req, res) => {
  const { spotid } = req.params;
  const { review, stars } = req.body;
  const userId = req.user.id;

  // Check if spot exists
  const spot = await Spot.findByPk(Number(spotid));
  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Check if user already has a review for this spot
  const existingReview = await Review.findOne({
    where: { spotId: spotid, userId: userId },
  });
  if (existingReview) {
    return res.status(500).json({
      message: "User already has a review for this spot",
    });
  }

  // Validate the review and stars
  const errors = {};
  if (!review) errors.review = "Review text is required";
  if (!stars || stars < 1 || stars > 5)
    errors.stars = "Stars must be an integer from 1 to 5";

  if (Object.keys(errors).length) {
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }

  // Create a new review
  const newReview = await Review.create({
    userId,
    spotId: spotid,
    review,
    stars,
  });

  return res.status(201).json(newReview);
});

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const { spotId } = req.params;
  const userId = req.user.id;

  // Find the spot to check if the current user is the owner
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      message: "Spot couldn't be found",
    });
  }

  // Fetch all bookings for the spot
  const bookings = await Booking.findAll({
    where: { spotId: spotId },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  });

  // Check if the current user is the owner of the spot
  if (spot.ownerId !== userId) {
    // If NOT the owner, return only spotId, startDate, and endDate
    const formattedBookings = bookings.map((booking) => ({
      spotId: booking.spotId,
      startDate: booking.startDate,
      endDate: booking.endDate,
    }));

    return res.json({ Bookings: formattedBookings });
  } else {
    // If the owner, return additional details including user info
    const formattedBookings = bookings.map((booking) => ({
      User: {
        id: booking.User.id,
        firstName: booking.User.firstName,
        lastName: booking.User.lastName,
      },
      id: booking.id,
      spotId: booking.spotId,
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    return res.json({ Bookings: formattedBookings });
  }
});

// Create a Booking from a Spot based on the Spot's id
router.post("/:spotid/booking", requireAuth, async (req, res) => {
  const { spotid } = req.params;
  const { startDate, endDate } = req.body;
  const userId = req.user.id;

  const spot = await Spot.findByPk(spotid);
  if (!spot) {
    return res.status(404).json({ message: "Spot couldn't be found" });
  }

  if (spot.ownerId === userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  // Check for conflicts with existing bookings
  const conflict = await Booking.findOne({
    where: {
      spotId: spotid,
      [Op.or]: [
        {
          startDate: {
            [Op.lte]: endDate,
            [Op.gte]: startDate,
          },
        },
        {
          endDate: {
            [Op.lte]: endDate,
            [Op.gte]: startDate,
          },
        },
      ],
    },
  });

  if (conflict) {
    return res.status(403).json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  const booking = await Booking.create({
    spotId: spotid,
    userId,
    startDate,
    endDate,
  });

  return res.status(201).json(booking);
});

module.exports = router;