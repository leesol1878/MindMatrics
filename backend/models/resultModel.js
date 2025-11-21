import mongoose from "mongoose";
const performanceEnum = ['Excellent', 'Good', 'Average', 'Poor'];

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },
    title: {
        type: String,
        required: true,
        trim: true
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
        "Python",
        "cpp",
        "bootstrap"
      ]
    },
    level: { type: String, required: true, enum: ["basic", "intermediate", "advanced"] },
    totalQuestions: { type: Number, required: true, min: 0 },
    correct: { type: Number, required: true, min: 0, default: 0 },
    wrong: { type: Number, required: true, min: 0, default: 0 },
    score: { type: Number, min: 0, max: 100, default: 0 },
    performance: { type: String, enum: performanceEnum, default: "Needs Work" },
}, { 
    timestamps: true
 });

//compute score and performance
resultSchema.pre('save', function (next){
    const total = Number(this.totalQuestions) || 0;
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
