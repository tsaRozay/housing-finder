const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

// Validation for login
const validateLogin = [
    check("credential")
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage("Please provide a valid email or username."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please provide a password."),
    handleValidationErrors,
];

// Get Current User
router.get("/", async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.json({ user: null });
        }

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        return res.json({
            user: safeUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve session",
            error: error.message,
        });
    }
});

// Get the Current User
// router.get("/current", requireAuth, async (req, res) => {
//     try {
//         if (req.user) {
//             const userId = req.user.id;
//             const user = await User.findByPk(userId);

//             if (user) {
//                 return res.status(200).json({
//                     user: {
//                         id: user.id,
//                         firstName: user.firstName,
//                         lastName: user.lastName,
//                         email: user.email,
//                         username: user.username,
//                     },
//                 });
//             }
//         }
//         res.status(200).json({ user: null });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Log In a User
router.post("/", validateLogin, async (req, res, next) => {
    try {
        const { credential, password } = req.body;

        const user = await User.unscoped().findOne({
            where: {
                [Op.or]: {
                    username: credential,
                    email: credential,
                },
            },
        });

        if (
            !user ||
            !bcrypt.compareSync(password, user.hashedPassword.toString())
        ) {
            const err = new Error("Invalid credentials");
            err.status = 401;
            err.title = "Invalid credentials";
            err.errors = {
                credential: "The provided credentials were invalid.",
            };
            return next(err);
        }

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.json({
            user: safeUser,
        });
    } catch (error) {
        return res.status(400).json({ message: "Bad request", errors: error });
    }
});

// Log In a User
// router.post("/session", async (req, res) => {
//     const { credential, password } = req.body;

//     const errors = {};
//     if (!credential) errors.credential = "Email or username is required";
//     if (!password) errors.password = "Password is required";

//     // If there are validation errors, respond with a 400 status and the error messages
//     if (Object.keys(errors).length > 0) {
//         return res.status(400).json({
//             message: "Bad Request",
//             errors,
//         });
//     }

//     // Find user by email or username
//     const user = await User.findOne({
//         where: {
//             [Op.or]: [{ email: credential }, { username: credential }],
//         },
//     });

//     // Check if user exists and password matches
//     if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
//         return res.status(401).json({
//             message: "Invalid credentials",
//         });
//     }

//     const safeUser = {
//         id: user.id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email,
//         username: user.username,
//     };

//     await setTokenCookie(res, safeUser);

//     return res.status(200).json({ user: safeUser });
// });

// Logout
// router.delete("/", (_req, res) => {
//     res.clearCookie("token");
//     return res.json({ message: "Successfully logged out" });
// });

// // Restore session user
// router.get("/", restoreUser, (req, res) => {
//     const { user } = req;
//     if (user) {
//         const safeUser = {
//             id: user.id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,
//             username: user.username,
//         };
//         return res.json({
//             user: safeUser,
//         });
//     } else return res.json({ user: null });
// });

module.exports = router;
