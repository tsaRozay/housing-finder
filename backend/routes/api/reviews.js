const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage } = require('../../db/models');
const { where, Model } = require('sequelize');
const { validateReview, validateSpot } = require('../../utils/validation');

const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id;

    const reviews = await Review.findAll({
        where: { userId: userId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Spot,
                include: [
                    {
                        model: SpotImage,
                        attributes: ['url'],
                        where: { preview: true },
                        required: false
                    }
                ],
                attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });
    const formattedReviews = reviews.map(review => {
        return {
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
                lastName: review.User.lastName
            },
            Spot: {
                id: review.Spot.id,
                ownerId: review.Spot.ownerId,
                address: review.Spot.address,
                city: review.Spot.city,
                state: review.Spot.state,
                country: review.Spot.country,
                lat: review.Spot.lat,
                lng: review.Spot.lng,
                name: review.Spot.name,
                price: review.Spot.price,
                previewImage: review.Spot.SpotImages.length > 0 ? review.Spot.SpotImages[0].url : null
            },
            ReviewImages: review.ReviewImages.map(image => ({
                id: image.id,
                url: image.url
            }))
        };
    });
    return res.json({ Reviews: formattedReviews });
});


router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const { url } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        return res.status(404).json({ "message": "Review couldn't be found" });
    };

    if (review.userId !== userId) { 
        return res.status(403).json({ message: "Forbidden" });
    }

    const reviewImages = await ReviewImage.findAll({
        where: { reviewId },
    });
    const numImages = reviewImages.length;
    if (numImages > 10) {
        return res.status(403).json({ "message": "Maximum number of images for this resource was reached" });
    }

    const createImage = await ReviewImage.create({
        reviewId: review.id,
        url,
    })

    return res.status(201).json({
        id: createImage.id,
        url: createImage.url,
    });
});

//Edit a Review

router.put('/:reviewId', requireAuth, validateReview, async (req, res) => {
    const { review, stars } = req.body;
    const { reviewId } = req.params;
    const userId = req.user.id;

    const existingReview = await Review.findByPk(reviewId);

    if (!existingReview) {
        return res.status(404).json({ "message": "Review couldn't be found" });
    };

    if (existingReview.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    const updateReview = await existingReview.update({ review, stars });

    return res.status(200).json({
        id: existingReview.id,
        userId: existingReview.userId,
        spotId: existingReview.spotId,
        review: existingReview.review,
        stars: existingReview.stars,
        createdAt: existingReview.createdAt,
        updatedAt: existingReview.updatedAt,
    });
});

//Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);

    if (!review) {
        return res.status(404).json({ "message": "Review couldn't be found" });
    };

    if (review.userId !== userId) {
        return res.status(403).json({ message: "Forbidden" });
    }

   await review.destroy();
    return res.status(200).json({
        "message": "Successfully deleted"
    })
})



module.exports = router;