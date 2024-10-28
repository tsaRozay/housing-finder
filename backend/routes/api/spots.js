const express = require('express');
const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');
const { Spot, Booking, User, SpotImage, Review, ReviewImage } = require('../../db/models');
const { check, validationResult } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.get('/', async (req, res, next) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  page = parseInt(page);
  size = parseInt(size);
  minLat = parseFloat(minLat);
  maxLat = parseFloat(maxLat);
  minLng = parseFloat(minLng);
  maxLng = parseFloat(maxLng);
  minPrice = parseFloat(minPrice);
  maxPrice = parseFloat(maxPrice);

  if (!page || page < 1 || page > 10) page = 1;
  if (!size || size < 1 || size > 20) size = 20;
  if (minLat && (minLat < -90 || minLat > 90)) return res.status(400).json({ message: "Invalid minLat" });
  if (maxLat && (maxLat < -90 || maxLat > 90)) return res.status(400).json({ message: "Invalid maxLat" });
  if (minLng && (minLng < -180 || minLng > 180)) return res.status(400).json({ message: "Invalid minLng" });
  if (maxLng && (maxLng < -180 || maxLng > 180)) return res.status(400).json({ message: "Invalid maxLng" });
  if (minPrice && minPrice < 0) return res.status(400).json({ message: "Invalid minPrice" });
  if (maxPrice && maxPrice < 0) return res.status(400).json({ message: "Invalid maxPrice" });

  const where = {};
  if (minLat) where.lat = { [Op.gte]: minLat };
  if (maxLat) where.lat = { ...where.lat, [Op.lte]: maxLat };
  if (minLng) where.lng = { [Op.gte]: minLng };
  if (maxLng) where.lng = { ...where.lng, [Op.lte]: maxLng };
  if (minPrice) where.price = { [Op.gte]: minPrice };
  if (maxPrice) where.price = { ...where.price, [Op.lte]: maxPrice };

  const spots = await Spot.findAll({
    where,
    attributes: {
      include: [
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
      ]
    },
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false
      },
      {
        model: Review,
        attributes: []
      }
    ],
    group: ['Spot.id', 'SpotImages.id']
  });

  const formattedSpots = spots.map(spot => ({
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
    avgRating: Number(spot.dataValues.avgRating).toFixed(1),
    previewImage: spot.SpotImages[0]?.url || null
  })).slice(size * (page - 1), size * page);

  return res.status(200).json({ 
    Spots: formattedSpots,
    page,
    size
  });
});

const validateSpot = [
  check('address').exists({ checkFalsy: true }).notEmpty().withMessage('Address is required.'),
  check('city').exists({ checkFalsy: true }).notEmpty().withMessage('City is required.'),
  check('state').exists({ checkFalsy: true }).notEmpty().withMessage('State is required.'),
  check('country').exists({ checkFalsy: true }).notEmpty().withMessage('Country is required.'),
  check('lat').exists({ checkFalsy: true }).notEmpty().withMessage('Latitude is required.')
      .isFloat({ min: -90, max: 90 }).withMessage('Latitude is not valid.'),
  check('lng').exists({ checkFalsy: true }).notEmpty().withMessage('Longitude is required.')
      .isFloat({ min: -180, max: 180 }).withMessage('Longitude is not valid.'),
  check('name').exists({ checkFalsy: true }).notEmpty().isLength({ max: 50 })
      .withMessage('Name must be less than 50 characters.'),
  check('description').exists({ checkFalsy: true }).notEmpty().withMessage('Description is required.'),
  check('price').exists({ checkFalsy: true }).notEmpty().isFloat({ min: 0 })
      .withMessage('Price per day is required.'),
  handleValidationErrors
];

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const ownerId = req.user.id;

  try {
    const spot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    return res.status(201).json(spot);
  } catch (err) {
    next(err);
  }
});

router.get('/current', requireAuth, async (req, res, next) => {
  const { user } = req;

  try {
    const spots = await Spot.findAll({
      where: { ownerId: user.id },
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']
        ]
      },
      include: [
        {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false
        },
        {
          model: Review,
          attributes: []
        }
      ],
      group: ['Spot.id', 'SpotImages.id'],
    });

    const formattedSpots = spots.map(spot => ({
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
      avgRating: Number(spot.dataValues.avgRating).toFixed(1),
      previewImage: spot.SpotImages[0]?.url || null
    }));

    return res.json({ Spots: formattedSpots });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
