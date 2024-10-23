const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const router = express.Router();
const { User } = require("../../db/models");
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { json } = require("sequelize");

// Validation middleware for signup
const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

// Sign up
router.post('/', validateSignup, async (req, res) => {
    try {
        const { firstName, lastName, email, password, username } = req.body;

        // Check if a user already exists with the email or username
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(500).json({ message: "User already exists with the specified email or username" });
        }

        // Create new user
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            hashedPassword
        });

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);

        return res.status(201).json({ user: safeUser });
        
    } catch (error) {
        // Body validation errors
        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Validation errors",
                errors: error.errors.map(err => err.message)
            });
        }

        console.error(error);
        return res.status(500).json({ message: "User creation failed", error: error.message });
    }
});


// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users" });
        console.error(error);
    }
});

// Get current user
router.get("/current", requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get a specific user by ID
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving user" });
    }
});

// Update user profile
router.patch("/:id", async (req, res) => {
    try {
        const { email, username } = req.body;
        const user = await User.findByPk(req.params.id);
        if (user) {
            await user.update({ email, username });
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
});


// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user && user.password === password) {
            res.json({ message: "Login successful", user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    }
});

// Logout user
router.post("/logout", (req, res) => {
    try {
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out" });
    }
});

module.exports = router;
