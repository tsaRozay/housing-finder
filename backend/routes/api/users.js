const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const router = express.Router();

// Validation middleware for login
const validateLogin = [
    check("credential")
        .exists({ checkFalsy: true })
        .withMessage("Email or username is required"),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Password is required"),
    handleValidationErrors,
];

// Login Route
router.post("/login", validateLogin, async (req, res) => {
    const { credential, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: credential }, { username: credential }],
            },
        });

        if (
            !user ||
            !bcrypt.compareSync(password, user.hashedPassword.toString())
        ) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        await setTokenCookie(res, safeUser);
        return res.status(200).json(safeUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error logging in" });
    }
});

// Validation middleware for signup
const validateSignup = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 4 characters."),
    check("username")
        .not()
        .isEmail()
        .withMessage("Username cannot be an email."),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be 6 characters or more."),
    handleValidationErrors,
];

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

// Sign Up a User
router.post("/", validateSignup, async (req, res) => {
    const { firstName, lastName, email, password, username } = req.body;

    // Check if user with email or username already exists
    const existingUser = await User.findOne({
        where: {
            [Op.or]: [{ email }, { username }],
        },
        attributes: {
            include: ["email"],
        },
    });

    // If user exists, return a 500 error with appropriate messages
    if (existingUser) {
        const errors = {};
        if (existingUser.email === email) {
            errors.email = "User with that email already exists";
        }
        if (existingUser.username === username) {
            errors.username = "User with that username already exists";
        }
        return res.status(500).json({
            message: "User already exists",
            errors,
        });
    }

    // Validate required fields and provide specific error messages for missing fields
    const errors = {};
    if (!email) errors.email = "Invalid email";
    if (!username) errors.username = "Username is required";
    if (!firstName) errors.firstName = "First Name is required";
    if (!lastName) errors.lastName = "Last Name is required";

    // // If there are validation errors, respond with a 400 status and the error messages
    // if (Object.keys(errors).length > 0) {
    //     return res.status(400).json({
    //         message: "Bad Request",
    //         errors,
    //     });
    // }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        hashedPassword,
    });

    // Prepare the response for the newly created user
    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
    };

    // Set the cookie and return a successful response
    await setTokenCookie(res, safeUser);

    // Respond with status 201 and the new user details
    return res.status(201).json({ user: safeUser });
});

// // Get all users Route
// router.get("/", async (req, res) => {
//     try {
//         const users = await User.findAll();
//         res.json(users);
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving users" });
//         console.error(error);
//     }
// });

// // Get a specific user by ID Route
// router.get("/:id", async (req, res) => {
//     try {
//         const user = await User.findByPk(req.params.id);
//         if (user) {
//             res.json(user);
//         } else {
//             res.status(404).json({ message: "User not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving user" });
//     }
// });

// // Update user profile Route
// router.patch("/:id", async (req, res) => {
//     try {
//         const { email, username } = req.body;
//         const user = await User.findByPk(req.params.id);
//         if (user) {
//             await user.update({ email, username });
//             res.json(user);
//         } else {
//             res.status(404).json({ message: "User not found" });
//         }
//     } catch (error) {
//         res.status(500).json({ message: "Error updating user" });
//     }
// });

// // Logout user Route
// router.post("/logout", (req, res) => {
//     try {
//         res.json({ message: "Logged out successfully" });
//     } catch (error) {
//         res.status(500).json({ message: "Error logging out" });
//     }
// });

module.exports = router;
