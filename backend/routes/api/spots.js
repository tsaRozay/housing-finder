//^ backend/routes/api/spots.js
const express = require('express');
const { Op, fn, col } = require('sequelize');
const { Spot, Image, Review, User, Booking } = require('../../db/models');
const { requireAuth, checkOwnership } = require('../../utils/auth');
const { formatDate, formatDateTime } = require('../api/utils/date-formatter');
const { validateSpot, validateBooking, validateReview, checkBookingConflict } = require('../../utils/validation');

const router = express.Router();

//~ GET ALL SPOTS
router.get('/', async (req, res) => {
    try {
        //^extract query params and assign defaults
        const {
            page = 1,
            size = 20,
            minLat,
            minLng,
            maxLng,
            maxLat,
            minPrice,
            maxPrice
        } = req.query;

        //^ validate query params
        const errors = {};
        if (page < 1) errors.page = 'Page must be greater than or equal to 1';
        if (size < 1 || size > 20) errors.size = 'Size must be between 1 and 20';
        if (minLat && !(minLat > -90 && minLat < 90)) errors.minLat = 'Minimum latitude is invalid';
        if (maxLat && !(maxLat > -90 && maxLat < 90)) errors.maxLat = 'Maximum latitude is invalid';
        if (minLng && !(minLng > -180 && minLng < 180)) errors.minLng = 'Minimum longitude is invalid';
        if (maxLat && !(maxLat > -180 && maxLat < 180)) errors.maxLng = 'Maximum longitude is invalid';
        if (minPrice < 0) errors.minPrice = 'Minimum price must be greater than or equal to 0';
        if (maxPrice < 0) errors.maxPrice = 'Maximum price must be greater than or equal to 0';

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: 'Bad request',
                errors
            });
        };

        //^ prep filters based on params
        const filters = {
            ...(minLat && { lat: { [Op.gte]: minLat } }),
            ...(maxLat && { lat: { [Op.lte]: maxLat } }),
            ...(minLng && { lng: { [Op.gte]: minLng } }),
            ...(maxLng && { lng: { [Op.lte]: maxLng } }),
            ...(minPrice && { price: { [Op.gte]: minPrice } }),
            ...(maxPrice && { price: { [Op.lte]: maxPrice } }),
        };

        //^ get all spots including preview image data
        const spots = await Spot.findAll({
            where: filters,
            include: [{
                model: Image,
                as: 'Images',
                where: { preview: true },
                attributes: ['url'],
                limit: 1
            }],
            limit: size,
            offeset: (page - 1) * size,
        });

        //^ get all associated review star ratings and avg them
        const reviewAverages = await Review.findAll({
            attributes: ['spotId', [fn('SUM', col('stars')), 'sumStars'], [fn('COUNT', col('stars')), 'reviewCount']],
            group: ['spotId']
        });

        //^ map avg agg to spotId
        const avgRateMap = {};
        reviewAverages.forEach( reviewAverage => {
            const { spotId, sumStars, reviewCount } = reviewAverage.dataValues;
            const avgRating = sumStars / reviewCount;
            avgRateMap[spotId] = avgRating;
        });

        const responseData = spots.map(spot => {
            const spotObj = spot.get();
            delete spotObj.Images;

            return {
                ...spotObj,
                createdAt: formatDateTime(spot.createdAt),
                updatedAt: formatDateTime(spot.updatedAt),
                avgRating: avgRateMap[spot.id] || 1,
                previewImage: spot.Images[0]?.url || null
            };
        });

        return res.json({ Spots: responseData, page: parseInt(page, 10), size: parseInt(size, 10) });
    } catch (error) {
        console.error('Error fetching spots:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~GET SPOTS OWNED BY CURRENT USER
router.get('/current', requireAuth, async (req, res) => {
  try {
    const spots = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [{
            model: Image,
            as: 'Images',
            where: { preview: true },
            attributes: ['url'],
            limit: 1
        }],
    });

    const reviewAverages = await Review.findAll({
        attributes: ['spotId', [fn('SUM', col('stars')), 'sumStars'], [fn('COUNT', col('stars')), 'reviewCount']],
        group: ['spotId']
    });

    const avgRateMap = {};
    reviewAverages.forEach( reviewAverage => {
        const { spotId, sumStars, reviewCount } = reviewAverage.dataValues;
        const avgRating = sumStars / reviewCount;
        avgRateMap[spotId] = avgRating;
    });

    const responseData = spots.map(spot => {
        const spotObj = spot.get();
        delete spotObj.Images;

        return {
            ...spotObj,
            createdAt: formatDateTime(spot.createdAt),
            updatedAt: formatDateTime(spot.updatedAt),
            avgRating: avgRateMap[spot.id] || 1,
            previewImage: spot.Images[0]?.url || null
        };
    });

    res.json({ Spots: responseData });
  } catch (error) {
    console.error('Error fetching spot:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  };
});

//~ GET SPOT DETAILS BY SPOT ID
router.get('/:spotId', async (req, res) => {
    try {
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
            ]
        });

        if (!spot) {
            return res.status(404).json({ message: `Spot couldn't be found` });
        };

        const spotImages = await Image.findAll({
            where: {
                imageableType: 'spot',
                imageableId: spotId
            }
        });

        let sumStars = 1;
        let reviewCount = 0;
        try {
            const reviews = await Review.findAll({
                where: { spotId: spotId},
                attributes: ['spotId', [fn('SUM', col('stars')), 'sumStars'], [fn('COUNT', col('stars')), 'reviewCount']],
                group: ['spotId']
            });

            if (reviews.length > 0) {
                const  { sumStars: totalStars, reviewCount: totalCount } = reviews[0].dataValues;
                sumStars = totalStars;
                reviewCount = totalCount;
            };

        } catch (error) {
            console.error('Error fetching reviews:', error);
        };

        const spotData = spot.get();
        const owner = spot.User;

        delete spotData.User;

        const responseData = {
            ...spotData,
            createdAt: formatDateTime(spot.createdAt),
            updatedAt: formatDateTime(spot.updatedAt),
            numRatings: reviewCount || 0,
            avgStarRating: reviewCount ? (sumStars / reviewCount).toFixed(2) : 1,
            spotImages: spotImages.length ? spotImages.map( image => ({
                id: image.id,
                url: image.url,
                preview: image.preview
            })) : null,
            Owner: {
                id: owner.id,
                firstName: owner.firstName,
                lastName: owner.lastName
            },
        };

        return res.json(responseData);
    } catch (error) {
        console.error('Error fetching spot:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~ GET REVIEWS BY SPOTID
router.get('/:spotId/reviews', async (req, res) => {
    try {
        const spotCheck = await Spot.findByPk(req.params.spotId)
        if (!spotCheck) res.status(404).json({ message: `Spot couldn't be found` })
        const reviews = await Review.findAll({
            where: {
                spotId: req.params.spotId
            },
            include: [
                {
                    model: Image,
                    as: 'Images',
                    attributes: ['id', 'url'],
                },
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
        });

        const responseData = reviews.map(review => {
            const reviewObj = review.get();

            const reviewImages = reviewObj.Images.map( image => ({
                id: image.id,
                url: image.url,
            }));

            delete reviewObj.Images;

            return {
                ...reviewObj,
                createdAt: formatDateTime(review.createdAt),
                updatedAt: formatDateTime(review.updatedAt),
                User: reviewObj.User ? {
                    id: reviewObj.User.id,
                    firstName: reviewObj.User.firstName,
                    lastName: reviewObj.User.lastName
                } : null,
                ReviewImages: reviewImages || null
            };
        });

        res.json({ Reviews: responseData })
    } catch (error) {
        console.error('Error fetching review:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~GET BOOKINGS BY SPOT
//! req auth && diff response depending on ownership of spot
//! in route ownership check
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId);
        if (!spot) return res.status(404).json({ message: "Spot couldn't be found" });

        const bookings = await Booking.findAll({
            where: {spotId: req.params.spotId},
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        });

        if (!bookings) return res.status(404).json({ message: `Bookings couldn't be found for this spot` });

        //^check ownership
        if (spot.ownerId === req.user.id) {
            const ownedSpot = bookings.map( booking => {
                return {
                    User: { ...booking.User.dataValues },
                    id: booking.id,
                    spotId: booking.spotId,
                    userId: booking.userId,
                    startDate: formatDate(booking.startDate),
                    endDate: formatDate(booking.endDate),
                    createdAt: formatDateTime(spot.createdAt),
                    updatedAt: formatDateTime(spot.updatedAt)
                };
            });

            res.json({ 'Bookings': ownedSpot });
        } else {
            const unOwnedSpot = bookings.map( booking => {
                return {
                    spotId: booking.spotId,
                    startDate: formatDate(booking.startDate),
                    endDate: formatDate(booking.endDate)
                };
            });

            res.json({ 'Bookings': unOwnedSpot });
        };
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~ CREATE A SPOT
//! req auth
router.post('/', requireAuth, validateSpot, async (req, res) => {
    try {
        const spotData = req.body;
        const owner = await User.findByPk(req.user.id);

        //^ enforce unique address, state, city combo
        const dupeCheck = await Spot.findOne({
            where: {
                address: spotData.address,
                city: spotData.city,
                state: spotData.state
            }
        });

        if (dupeCheck) return res.status(400).json({ message: 'Spot already exhists at this adress'});

        const spot = await Spot.create({
            ownerId: owner.id,
            ...spotData
        }, { validate: true });

        const spotObj = spot.get();

        spotObj.createdAt = formatDateTime(spotObj.createdAt);
        spotObj.updatedAt = formatDateTime(spotObj.updatedAt);

        res.status(201).json(spotObj);
    } catch (error) {
        console.error('Error creating spot:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~EDIT A SPOT
//! requires auth and ownership
router.put('/:spotId', requireAuth, checkOwnership(Spot, 'spotId'), validateSpot, async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId);
        spot.set({
            ...req.body
        });

        spot.save({ validate: true });

        const spotObj = spot.get();
        spotObj.createdAt = formatDateTime(spotObj.createdAt);
        spotObj.updatedAt = formatDateTime(spotObj.updatedAt);

        res.status(200).json(spotObj);
    } catch (error) {
        console.error('Error updating spot:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~DELETE A SPOT
//! requires auth and ownership
router.delete('/:spotId', requireAuth, checkOwnership(Spot, 'spotId'), async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId);
        if (!spot) return res.status(404).json({ message: `Spot coudn't be found` });

        //^ finad all associated spots images, review images invluded to cascade delete
        const spotImages = await Image.findAll({ where: { imageableId: spot.id } });
        for (const image of spotImages) {
            await image.destroy()
        }

        spot.destroy();

        res.json({ message: 'Successfully deleted' });
    } catch (error) {
        console.error('Error deleteing spot:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~ ADD IMAGE TO SPOT BY SPOTID
//! requires auth and ownership
router.post('/:spotId/images', requireAuth, checkOwnership(Spot, 'spotId'), async (req, res) => {
    try {
        const spotData = req.body;
        const spotId = req.params.spotId;
        const spot = await Spot.findByPk(spotId);
        if(!spot) return res.status(404).json({ message: `Spot couldn't be found` });

        const newImage = await Image.create({
            ...spotData,
            imageableId: spotId,
            imageableType: 'spot'

        }, { validate: true });

        const imageObj = newImage.get();
        delete imageObj.imageableId;
        delete imageObj.imageableType;
        delete imageObj.createdAt;
        delete imageObj.updatedAt;

        return res.status(201).json(imageObj);
    } catch (error) {
        console.error('Error creating image:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~CREATE A REVIEW FOR A SPOT
//! require auth
router.post('/:spotsId/reviews', requireAuth, validateReview, async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotsId);
        const user = await req.user.id;
        const review = req.body;
        if(!spot) return res.status(404).json({ message: `Spot couldn't be found` });

        //^ enforce unique user reviews
        const dupeCheck = await Review.findOne({
            where: {
                userId: req.user.id,
                spotId: req.params.spotsId
            }
        });

        if (dupeCheck) return res.status(500).json({ message: 'User already has a review for this spot'});

        const newReview = await Review.create({
            userId: user,
            spotId: spot.id,
            ...review,
        }, { validate: true });

        newRevObj = newReview.get();
        newRevObj.createdAt = formatDateTime(newRevObj.createdAt);
        newRevObj.updatedAt = formatDateTime(newRevObj.updatedAt);

        res.status(201).json(newRevObj);
    } catch (error) {
        console.error('Error creating review:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

//~CREATE A BOOKING FOR A SPOT
//! req auth + spot may not belong to curr user
router.post('/:spotId/bookings', requireAuth, validateBooking, checkBookingConflict,  async (req, res) => {
    try {
        const spot = await Spot.findByPk(req.params.spotId);
        if (!spot) return res.status(404).json({ message: `Spot couldn't be found`});
        //^ check if user owns spot they are trying to book
        if (spot.ownerId === req.user.id) return res.status(403).json({ message: `Can't book your own spot`});

        const newBooking = await spot.createBooking({
            spotId: spot.id,
            userId: req.user.id,
            ...req.body,
        }, { validate: true });

        const responseData = newBooking.get();
        responseData.startDate = formatDate(responseData.startDate);
        responseData.endDate = formatDate(responseData.endDate);
        responseData.createdAt = formatDateTime(responseData.createdAt);
        responseData.updatedAt = formatDateTime(responseData.updatedAt);

        res.json(responseData)
    } catch (error) {
        console.error('Error creating booking:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

module.exports = router;