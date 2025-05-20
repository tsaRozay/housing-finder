const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// Validation middleware for login
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

// Log in
router.post("/", validateLogin, async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where: {
            [Op.or]: { username: credential, email: credential },
        },
    });

    if (
        !user ||
        !bcrypt.compareSync(password, user.hashedPassword.toString())
    ) {
        return next({
            status: 401,
            title: "Login failed",
            message: "Invalid credentials",
            errors: { credential: "The provided credentials were invalid." },
        });
    }

    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.status(200).json({ user: safeUser });
});

// Log out
router.delete("/", (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({ message: "success" });
});

// Restore session user
router.get("/", (req, res) => {
    const { user } = req;

    if (user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };
        return res.json({ user: safeUser });
    }

    return res.status(200).json({ user: null });
});

module.exports = router;