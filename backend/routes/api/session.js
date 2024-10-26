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

// Get current user
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

// Login with validation
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

// Logout
router.delete("/", (_req, res) => {
    res.clearCookie("token");
    return res.json({ message: "Successfully logged out" });
});

// Restore session user
router.get("/", restoreUser, (req, res) => {
    const { user } = req;
    if (user) {
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
    } else return res.json({ user: null });
});

module.exports = router;
