import express from 'express';
import { login, register } from '../controller/userController.js';

const userRouter = express.Router();

//Routes for user registeration

userRouter.post('/register', register);
userRouter.post('/login', login);
export default userRouter; 