const express = require('express');
const { Spot, Image } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//~DELETE IMAGE FROM SPOT
//!requires auth and ownership of spot
router.delete('/:imageId', requireAuth, async (req, res) => {
    try {
        const image = await Image.findByPk(req.params.imageId);

        if (!image) return res.status(404).json({ message: `Spot Image couldn't be found` });

        //^ check ownership of review
        const spot = await Spot.findByPk(image.imageableId)
        if (req.user.id !== spot.ownerId) return res.status(403).json({ error: `Forbidden` });

        image.destroy();

        res.json({ message: 'Successfully deleted' });
    } catch (error) {
        console.error('Error deleteing Image:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    };
});

module.exports = router;