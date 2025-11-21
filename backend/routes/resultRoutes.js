import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { createResults, listResults } from '../controller/resultController.js';

const resultRouter = express.Router();
resultRouter.post('/', authMiddleware, createResults);
resultRouter.get('/', authMiddleware, listResults);

export default resultRouter;