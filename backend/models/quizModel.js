import mongoose from "mongoose";
const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    technology: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "html",
        "css",
        "js",
        "react",
        "node",
        "mongodb",
        "Java",
        "python",
        "cpp",
        "bootstrap",
      ],
    },
    duration: { type: Number, required: true, min: 1 }, // in minutes
    level: {
      type: String,
      required: true,
      enum: ["basic", "intermediate", "advanced"],
    },
    totalQuestions: { type: Number, required: true, min: 0 },
    // dont use questions for now
    questions: [
      {
        questionText: { type: String, required: true },
        options: [
          {
            optionText: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Quiz = mongoose.models.quiz || mongoose.model("quiz", quizSchema);
export default Quiz;
