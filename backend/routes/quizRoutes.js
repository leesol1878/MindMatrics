import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  createQuiz,
  listQuizzes,
  getQuizById,
  updateQuiz,
  deleteQuiz,
} from '../controller/quizController.js';

const quizRouter = express.Router();

// Public: list and view quizzes
quizRouter.get('/', listQuizzes);
quizRouter.get('/:id', getQuizById);

// Protected: create, update, delete
quizRouter.post('/', authMiddleware, createQuiz);
quizRouter.put('/:id', authMiddleware, updateQuiz);
quizRouter.delete('/:id', authMiddleware, deleteQuiz);

export default quizRouter;
