const express = require("express");
const router = express.Router();
const { User } = require("../../db/models");

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

// Create a new user (Sign Up)
router.post("/signup", async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const newUser = await User.create({ email, password, username });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
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
