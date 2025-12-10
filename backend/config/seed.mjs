// populate quizes, users and results for testing
import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://stsionastw_db_user:Mindmatrics123@cluster0.b9pr2ni.mongodb.net/MindMatrics')
        .then(() => {console.log('DB CONNECTED');})
}
const disconnectDB = async () => {
    await mongoose.disconnect()
        .then(() => {console.log('DB DISCONNECTED');})
};
import User from "../models/userModel.js";
import Quiz from "../models/quizModel.js";
import Result from "../models/resultModel.js";
import bcrypt from "bcryptjs";
async function seed() {
  try {
    await connectDB();
    console.log("Database connected");
    // Clear existing data
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Result.deleteMany({});
    console.log("Existing data cleared");
    // Create users
    const users = [];
    const hashedPassword = await bcrypt.hash("password123", 10);
    users.push({ name: "User One", email: "user1@example.com", password: hashedPassword });
    users.push({ name: "User Two", email: "user2@example.com", password: hashedPassword });
    const createdUsers = await User.insertMany(users);
    console.log("Users created");

    // Create quizzes
    const quizzes = [
      {
        title: "HTML Level 1",
        level: "basic",
        technology: "html",
        duration: 30,
        totalQuestions: 10,
      },
      {
        title: "HTML Level 2",
        level: "intermediate",
        technology: "html",
        duration: 45,
        totalQuestions: 10,
      },
      {
        title: "HTML Level 3",
        level: "advanced",
        technology: "html",
        duration: 60,
        totalQuestions: 20,
      },
      {
        title: "CSS Level 1",
        level: "basic",
        technology: "css",
        duration: 30,
        totalQuestions: 10,
      },
      {
        title: "CSS Level 2",
        level: "intermediate",
        technology: "css",
        duration: 45,
        totalQuestions: 15,
      },
      {
        title: "CSS Level 3",
        level: "advanced",
        technology: "css",
        duration: 60,
        totalQuestions: 20,
      },
      {
        title: "JavaScript Level 1",
        level: "basic",
        technology: "js",
        duration: 30,
        totalQuestions: 10,
      },
      {
        title: "JavaScript Level 2",
        level: "intermediate",
        technology: "js",
        duration: 45,
        totalQuestions: 15,
      },
      {
        title: "JavaScript Level 3",
        level: "advanced",
        technology: "js",
        duration: 60,
        totalQuestions: 20,
      },
      {
        title: "Python Level 1",
        level: "basic",
        technology: "python",
        duration: 30,
        totalQuestions: 10,
      },
      {
        title: "Python Level 2",
        level: "intermediate",
        technology: "python",
        duration: 45,
        totalQuestions: 15,
      },
      {
        title: "Python Level 3",
        level: "advanced",
        technology: "python",
        duration: 60,
        totalQuestions: 20,
      },
    ];
    const createdQuizzes = await Quiz.insertMany(quizzes);
    console.log("Quizzes created", createdQuizzes.length);

    // Create results
    const results = [
      {
        user: createdUsers[0]._id,
        quiz: createdQuizzes[0]._id,
        score: 80,
        correct: 8,
        wrong: 2,
      },
      {
        user: createdUsers[1]._id,
        quiz: createdQuizzes[1]._id,
        score: 80,
        correct: 8,
        wrong: 2,
      },
      {
        user: createdUsers[0]._id,
        quiz: createdQuizzes[2]._id,
        score: 90,
        correct: 9,
        wrong: 1,
      }
    ];
    await Result.insertMany(results);
    console.log("Results created");
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await disconnectDB();
  }
}

// if (require.main === module) {
  // only seed if this file is run directly
  seed();
// }