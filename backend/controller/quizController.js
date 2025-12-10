import mongoose from "mongoose";
import Quiz from "../models/quizModel.js";

// Create a new quiz
export async function createQuiz(req, res) {
	try {
		const { title, technology, duration, level, totalQuestions, questions } = req.body;

		if (!title || !technology || !duration || !level || totalQuestions == null) {
			return res.status(400).json({ success: false, message: "Missing required fields" });
		}

		const quiz = new Quiz({
			title,
			technology,
			duration,
			level,
			totalQuestions,
			questions: Array.isArray(questions) ? questions : [],
		});

		await quiz.save();

		return res.status(201).json({ success: true, message: "Quiz created", quiz });
	} catch (error) {
		console.error("createQuiz error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
}

// Get list of quizzes (optionally filter by technology or level via query)
export async function listQuizzes(req, res) {
	try {
		const { technology, level } = req.query;
		const filter = {};
		if (technology) filter.technology = technology;
		if (level) filter.level = level;

		const quizzes = await Quiz.find(filter).lean();
		return res.status(200).json({ success: true, quizzes });
	} catch (error) {
		console.error("listQuizzes error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
}

// Get a single quiz by id
export async function getQuizById(req, res) {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ success: false, message: "Invalid id" });
		}

		const quiz = await Quiz.findById(id).lean();
		if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });

		return res.status(200).json({ success: true, quiz });
	} catch (error) {
		console.error("getQuizById error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
}

// Update a quiz by id
export async function updateQuiz(req, res) {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ success: false, message: "Invalid id" });
		}

		const updates = req.body;
		const updated = await Quiz.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).lean();
		if (!updated) return res.status(404).json({ success: false, message: "Quiz not found" });

		return res.status(200).json({ success: true, message: "Quiz updated", quiz: updated });
	} catch (error) {
		console.error("updateQuiz error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
}

// Delete a quiz by id
export async function deleteQuiz(req, res) {
	try {
		const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(400).json({ success: false, message: "Invalid id" });
		}

		const deleted = await Quiz.findByIdAndDelete(id).lean();
		if (!deleted) return res.status(404).json({ success: false, message: "Quiz not found" });

		return res.status(200).json({ success: true, message: "Quiz deleted" });
	} catch (error) {
		console.error("deleteQuiz error:", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
}
