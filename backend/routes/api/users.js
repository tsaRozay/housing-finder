const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const router = express.Router();
const { User } = require("../../db/models");
const { json } = require("sequelize");

// Get all users
router.get("/", async (req, res) => {
    try {
        const users = await UserActivation.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users" });
    }
});

// Get current user
router.get("/current", async (req, res) => {
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

// Sign up
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, password, username } = req.body;
        const hashedPassword = bcrypt.hashSync(password);
        const user = await User.create({
            firstName,
            lastName,
            email,
            username,
            hashedPassword,
        });

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
        return (
            res.status(400) /
            json({ message: "User creation failed", errors: error })
        );
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
