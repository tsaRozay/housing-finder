const express = require("express");
const router = express.Router();
const { ReviewImage, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

// Delete a Review Image
router.delete("/review-images/:imageId", requireAuth, async (req, res) => {
    const reviewImage = await ReviewImage.findByPk(req.params.imageId);

    // Error response: Couldn't find a Review Image with the specified id
    if (!reviewImage) {
        return res
            .status(404)
            .json({ message: "Review Image couldn't be found" });
    }

    // Check if the user owns the review to delete the image
    const review = await Review.findByPk(reviewImage.reviewId);

    // Unauthorized if the user does not own the review
    if (!review || review.userId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    await reviewImage.destroy();

    res.status(200).json({ message: "Successfully deleted" });
});

// // Add an image to a review
// router.post("/reviews/:reviewId/images", requireAuth, async (req, res) => {
//     try {
//         const { imageUrl } = req.body;
//         const review = await Review.findByPk(req.params.reviewId);

//         if (!review) {
//             return res.status(404).json({ message: "Review not found" });
//         }

//         // To make sure the user owns the review the image is being added to
//         if (review.userId !== req.user.id) {
//             return res.status(403).json({ message: "Unauthorized" });
//         }

//         // Limits 10 images per review
//         const imageCount = await ReviewImage.count({
//             where: { reviewId: review.id },
//         });

//         if (imageCount >= 10) {
//             return res.status(400).json({
//                 message: "Cannot upload more than 10 images per review",
//             });
//         }

//         const newImage = await ReviewImage.create({
//             reviewId: review.id,
//             imageUrl,
//         });

//         res.status(201).json(newImage);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// // Get all images for a review
// router.get("/reviews/:reviewId/images", async (req, res) => {
//     try {
//         const reviewImages = await ReviewImage.findAll({
//             where: { reviewId: req.params.reviewId },
//         });

//         if (!reviewImages) {
//             return res
//                 .status(404)
//                 .json({ message: "No images found for this review" });
//         }

//         res.json(reviewImages);
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving review images" });
//     }
// });

module.exports = router;