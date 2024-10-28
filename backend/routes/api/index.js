// backend/routes/api/index.js
const router = require("express").Router();
const { setTokenCookie } = require("../../utils/auth.js");
const {
  User,
  Spot,
  SpotImage,
  Review,
  ReviewImage,
} = require("../../db/models");
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const spotsRouter = require("./spots.js");
const reviewsRouter = require("./reviews.js");
const bookingsRouter = require("./bookings.js");
const { restoreUser } = require("../../utils/auth.js");

// GET /api/set-token-cookie
router.get("/set-token-cookie", async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({
    where: {
      username: username,
    },
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});

// GET /api/restore-user
router.use(restoreUser);

router.get("/restore-user", (req, res) => {
  return res.json(req.user);
});

// GET /api/require-auth
const { requireAuth } = require("../../utils/auth.js");
router.get("/require-auth", requireAuth, (req, res) => {
  return res.json(req.user);
});

// Delete a Spot Image
router.delete("/spot-images/:imageId", requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const image = await SpotImage.findByPk(imageId, {
    //find image by its Id
    include: {
      //// include the Spot model to find the relationship between the image and the spot
      model: Spot,
      attributes: ["ownerId"], // retrieve only the ownerId of the spot associated with the image
    },
  });

  if (!image) {
    return res.status(404).json({ message: "Spot Image couldn't be found" });
  }

  if (image.Spot.ownerId !== userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await image.destroy();
  return res.status(200).json({
    message: "Successfully deleted",
  });
});

// Delete a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  const { imageId } = req.params;
  const userId = req.user.id;

  const image =  await ReviewImage.findOne({ 
    where: { id: imageId }, //find image by its Id
    include: { //// include the Spot model to find the relationship between the image and the spot
      model: Review,
      attributes: ['userId'] // retrieve only the ownerId of the spot associated with the image
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


router.use("/session", sessionRouter);
router.use("/users", usersRouter);
router.use("/spots", spotsRouter);
router.use("/reviews", reviewsRouter);
router.use("/bookings", bookingsRouter);

router.post("/api/test", function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;