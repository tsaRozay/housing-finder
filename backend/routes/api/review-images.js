const express = require('express');
const { Image, Review } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//~DELETE IMAGE FROM REVIEW
//!requires auth and ownership of review // cant use checkownership
router.delete('/:imageId', requireAuth, async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.imageId);
        if (!image) return res.status(404).json({ message: `Review Image couldn't be found` });

        //^ check ownership of review
        const review = await Review.findByPk(image.imageableId);
        if (req.user.id !== review.userId) return res.status(403).json({ error: `Forbidden` });

        image.destroy();

        res.json({ message: 'Successfully deleted' });
    } catch (error) {
        console.error('Error deleteing Image:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

module.exports = router;