import express from 'express';
import { User } from "../models/User.js";
import { body, validationResult } from 'express-validator';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import fetchUserDetails from '../middleware/fetchUserDetails.js';

const jwtSecret = process.env.JWT_SECRET
// const jwtSecret = "uNoteSecretTokenKey"

const router = express.Router();

// ********************************************** Create User Ligic (Sign Up) ********************************************** //
// Route 1 : Create a new user using POST "/api/auth" - No login required
router.post("/",
    // Adding validation middleware
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required').custom(async (value) => {
            const user = await User.findOne({ 'email': value });
            if (user) {
                throw new Error('E-mail already in use');
            }
        }),
        body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
    ],
    async (req, res) => {
        let success = false;
        //Generate a salt for hashing the password
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the generated salt
        const cryptPassword = await bcrypt.hash(req.body.password, salt);
        // Check for validation errors
        const validationErrors = validationResult(req);
        try {
            // If there are validation errors, throw them
            if (!validationErrors.isEmpty()) {
                validationErrors.throw();
            }
            // If no errors, create a new user
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: cryptPassword
            });
            // Generate a JWT token for the user
            const jwtToken = jwt.sign({ user: { userId: user._id } }, jwtSecret,
                // { expiresIn: '7d' }
            );
            // Send the user id and token in the response
            res.json({
                success: true,
                userId: user._id,
                authToken: jwtToken
            });
        } catch (e) {
            if (e.array) {
                // If it's a validation error
                return res.json({ success: false, errors: e.array() });
            }
            // If it's some other error (e.g. DB error)
            return res.json({ success: false, error: e.message });
        }
    });
// ********************************************** ---------------- ********************************************** //


// ********************************************** Login User Logic ********************************************** //
// Route 2 : Authenticate a user using POST "/api/auth/login" - No login required
router.post('/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').exists().withMessage('Password is required')
    ],
    async (req, res) => {
        let success = false;
        // Check for validation errors
        const validationErrors = validationResult(req);
        try {
            // If there are validation errors, then throw them
            if (!validationErrors.isEmpty()) {
                validationErrors.throw();
            }
            // Destructure email and password from the request body
            const { email, password } = req.body;
            console.log(email, password)
            // Find the user by email
            const user = await User.findOne({ 'email': email });
            // If user not found, throw an error
            if (!user) {
                throw new Error("Invalid user credentials");
            }
            else {
                // Compare the provided password with the stored hashed password
                const isPasswordValid = await bcrypt.compare(password, user.password);
                // If password is invalid, throw an error
                if (!isPasswordValid) {
                    throw new Error("Invalid user credentials");
                }
            }
            // Generate a JWT token for the user
            const jwtToken = jwt.sign({ user: { userId: user._id } }, jwtSecret,
                // { expiresIn: '7d' }
            );
            // Send the user id and token in the response
            res.json({
                success: true,
                userId: user._id,
                authToken: jwtToken
            });

        } catch (e) {
            if (e.array) {
                // If it's a validation error
                return res.json({ success: false, errors: e.array() });
            }
            // If it's some other error (e.g. DB error)
            return res.json({ success: false, error: e.message });
        }
    });
// ********************************************** ---------------- ********************************************** //


// ********************************************** User details afeter login logic ********************************************** //
// Route 3 : Get loggedin user detaisl using GET "/api/auth/getuser" - Login required
router.post('/getuser', fetchUserDetails, async (req, res) => {
    let success = false;
    try {
        // Get the user ID from the request object
        const userId = req.user.userId;
        // Find the user by ID
        const user = await User.findById(userId).select("-password -__v");
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.json({ success: true, user: user });
    } catch (e) {
        if (e.array) {
            // If it's a validation error
            return res.json({ success: false, errors: e.array() });
        }
        // If it's some other error (e.g. DB error)
        return res.json({ success: false, error: e.message });
    }
});
// ********************************************** ---------------- ********************************************** //


// ********************************************** Update user details afeter login logic ********************************************** //
// Route 4 : Update loggedin user details using POST "/api/auth/updateuser" - Login required
router.post('/updateuser', fetchUserDetails,
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required').custom(async (value, { req }) => {
            // Find a user with this email
            const user = await User.findOne({ email: value });

            // If another user already has this email, block it
            if (user && user._id.toString() !== req.user.id) {
                throw new Error('E-mail already in use by another account');
            }
            return true;
        }),
        body('password').isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
    ],
    async (req, res) => {
        let success = false;
        // Check for validation errors
        const validationErrors = validationResult(req);
        try {
            // If there are validation errors, throw them
            if (!validationErrors.isEmpty()) {
                validationErrors.throw();
            }
            // Get the user ID from the request object
            const userId = req.user.userId;
            // Build update object dynamically
            const updateFields = {};
            if (req.body.name) {
                updateFields.name = req.body.name;
            }
            if (req.body.email) {
                updateFields.email = req.body.email;
            }
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                const cryptPassword = await bcrypt.hash(req.body.password, salt);
                updateFields.password = cryptPassword;
            }
            // Find and update user
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: updateFields },
                { new: true } // return updated user
            ).select('-password');  // Exclude the password field
            // Cehck user is fetched with new credentials
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
            res.json({ success: true, user: user });
        }
        catch (e) {
            if (e.array) {
                // If it's a validation error
                return res.json({ success: false, errors: e.array() });
            }
            // If it's some other error (e.g. DB error)
            return res.json({ success: false, error: e.message });
        }
    });
// ********************************************** ---------------- ********************************************** //

export { router };