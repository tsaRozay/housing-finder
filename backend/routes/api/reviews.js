    const express = require('express');
    const { Review, ReviewImage, SpotImage, Spot, User } = require('../../db/models');
    const { requireAuth } = require('../../utils/auth');
    const { check } = require('express-validator');
    const { handleValidationErrors } = require('../../utils/validation');
    const router = express.Router();
    
    const validateReview= [
        check('review').notEmpty().withMessage('Review text is required'),
        check('stars').isInt({ min: 1, max: 5 }).withMessage('Stars must be an integer from 1 to 5'),
        handleValidationErrors
    ];
    
    router.get('/current', requireAuth, async (req, res, next) => {
        try {
            const reviews = await Review.findAll({
                where: { userId: req.user.id },
                include: [
                    { model: User, attributes: ['id', 'firstName', 'lastName'] },
                    {
                        model: Spot,
                        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                        include: [{ model: SpotImage, attributes: ['url'], limit: 1 }]
                    },
                    { model: ReviewImage, attributes: ['id', 'url'] }
                ]
            });
    
            const reviewList = reviews.map(review => {
                const reviewData = review.toJSON();
                reviewData.Spot.previewImage = reviewData.Spot?.SpotImages[0]?.url || null;
                delete reviewData.Spot?.SpotImages;
                return reviewData;
            });
    
            res.status(200).json({ Reviews: reviewList });
        } catch (err) {
            next(err);
        }
    });
    
    router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const review = await Review.findOne({ where: { id: reviewId, userId: req.user.id } });
    
            if (!review) return res.status(404).json({ message: "Review couldn't be found" });
            if ((await ReviewImage.count({ where: { reviewId } })) >= 10) 
                return res.status(403).json({ message: "Maximum number of images for this resource was reached" });
    
            const newReviewImage = await ReviewImage.create({ reviewId, url: req.body.url });
            res.status(201).json(newReviewImage);
        } catch (err) {
            next(err);
        }
    });
    
    router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const review = await Review.findOne({ where: { id: reviewId, userId: req.user.id } });
    
            if (!review) return res.status(404).json({ message: "Review couldn't be found" });
    
            const { review: newReview, stars } = req.body;
            if (newReview) review.review = newReview;
            if (stars) review.stars = stars;
    
            await review.save();
            res.status(200).json(review);
        } catch (err) {
            next(err);
        }
    });
    
    router.delete("/:reviewId", requireAuth, async (req, res, next) => {
        try {
            const { reviewId } = req.params;
            const review = await Review.findOne({ where: { id: reviewId, userId: req.user.id } });
    
            if (!review) return res.status(404).json({ message: "Review couldn't be found" });
    
            await ReviewImage.destroy({ where: { reviewId } });
            await review.destroy();
    
            res.status(200).json({ message: "Successfully deleted" });
        } catch (err) {
            next(err);
        }
    });
    
    module.exports = router;