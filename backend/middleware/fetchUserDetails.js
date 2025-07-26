import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


// Load environment variables from .env.local file
dotenv.config({ path: './.env.local' });
const jwtSecret = process.env.JWT_SECRET

// Middleware function to fetch user details from JWT token
const fetchUserDetails = async (req, res, next) => {
    // Get the token from the request header
    const token = req.header('authToken');
    // If no token is provided, return an error
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
    try {
        // Verify the token
        const decodedToken = jwt.verify(token, jwtSecret);
        // Fetch the userID from the decoded token
        req.user = decodedToken.user;

        next();
    } catch (e) {
        // If token verification fails, return an error
        return res.status(401).json({ error: "Please authenticate using a valid token" });
    }
}


export default fetchUserDetails;