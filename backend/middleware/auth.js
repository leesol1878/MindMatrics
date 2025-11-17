import jsonwebtoken from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import User from '../models/UserModels.js';
const JWT_SECRET = 'your_jwt_secret_here';

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Not authorized, No token provided' });
    }

    const token = authHeader.split(' ')[1];

    verify
    try{
        const playload = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(playload.id).select('-password');
        if(!user){
            return res.status(401).json({ 
                success: false,
                message: 'Not authorized, User not found' });
            }
            req.user = user;
            next();
    }

    catch(error){
        console.error('JWT VERIFICATION FAILED:', error);
        return res.status(401).json({ 
            success: false,
            message: 'Token invalid or ecpired' });

    }


}
