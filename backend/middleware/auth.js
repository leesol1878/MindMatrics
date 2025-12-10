import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = 'your_jwt_secret_here';

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
            success: false,
            message: 'Not authorized, No token provided' 
        });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    try {
        const payload = jwt.verify(token, JWT_SECRET); 
        const user = await User.findById(payload.id).select('-password'); // Fixed variable name
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Not authorized, User not found' 
            });
        }
        // set claims
        req.user = user;
        next();
    } catch (error) {
        console.error('JWT VERIFICATION FAILED:', error); // Fixed variable name
        return res.status(401).json({ 
            success: false,
            message: 'Token invalid or expired' 
        });
    }
}