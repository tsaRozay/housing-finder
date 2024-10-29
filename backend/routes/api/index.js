// backend/routes/api/index.js
const router = require('express').Router();
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User, Spot, Review, SpotImage, ReviewImage } = require('../../db/models');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewRouter = require('./reviews.js');


// GET /api/restore-user
const { restoreUser } = require('../../utils/auth.js');
const spotimage = require('../../db/models/spotimage.js');
const { where } = require('sequelize');
router.use(restoreUser);

router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);

// GET /api/require-auth

router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);

//Delete a Spot Image
router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const image = await SpotImage.findByPk(imageId, {
    include: {
      model: Spot,
      attributes: ['ownerId']
    }
  });

  if (!image) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  };

  if (image.Spot.ownerId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();
  return res.status(200).json({
    "message": "Successfully deleted"
  })
})

//Delete a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const image =  await ReviewImage.findOne({ 
    where: { id: imageId },
    include: { 
      model: Review,
      attributes: ['userId']
    }
  });

  if (!image) {
    return res.status(404).json({ message: "Review Image couldn't be found" });
  };

  if (image.Review.userId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();
  return res.status(200).json({
    "message": "Successfully deleted"
  })
})

router.use('/session', sessionRouter);
router.use('/users', usersRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewRouter);

router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});


module.exports = router;