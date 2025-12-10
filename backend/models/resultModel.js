import mongoose from "mongoose";
const performanceEnum = ['Excellent', 'Good', 'Average', 'Poor','Needs Work'];
import "./quizModel.js";

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quiz',
        required: true
    },
    correct: { type: Number, required: true, min: 0, default: 0 },
    wrong: { type: Number, required: true, min: 0, default: 0 },
    score: { type: Number, min: 0, max: 100, default: 0 },
    performance: { type: String, enum: performanceEnum, default: "Needs Work" },
}, { 
    timestamps: true
 });

//compute score and performance
resultSchema.pre('save', function (next){
    const total = Number(this.quiz.totalQuestions) || 0;
    const correct = Number(this.correct) || 0;

    this.score = total ? Math.round((correct / total) * 100) : 0;
    if (this.score >= 85) {
        this.performance = 'Excellent';
    }   else if (this.score >= 70) {
        this.performance = 'Good';
    } else if (this.score >= 45) {
        this.performance = 'Average';
    }
    else {
        this.performance = 'Poor';
    }
    if((this.wrong === undefined || this.wrong === null) && total){
        this.wrong = Math.max(0, total - correct);
    }
    next();
})

const Result = mongoose.models.result || mongoose.model('result', resultSchema);
export default Result;
