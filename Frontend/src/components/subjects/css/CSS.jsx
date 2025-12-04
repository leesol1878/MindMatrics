import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import questionsData from '../../../assets/dummydata.js'
//import {QuizSelection} from '../../QuizSelection.jsx';
function CSSQuiz() {
  const { level } = useParams();
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Get questions based on level
  const questions = questionsData?.css?.[level] || [];
  
  // Set timer based on level
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      const timerDuration = level === 'basic' ? 900 : level === 'intermediate' ? 1500 : 2100; // seconds
      setTimeLeft(timerDuration);
    }
  }, [quizStarted, level, quizCompleted]);
  
  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizCompleted || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, timeLeft]);
  
  const startQuiz = () => {
    setQuizStarted(true);
    setAnswers(new Array(questions.length).fill(null));
  };
  
  const handleAnswerSelect = (answerIndex) => {
    if (quizCompleted) return;
    setSelectedAnswer(answerIndex);
  };
  
  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    
    // Check if answer is correct
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      handleQuizComplete();
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[prev - 1]);
    }
  };
  
  const handleQuizComplete = () => {
    setQuizCompleted(true);
    // Add final answer if selected
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
  };
  
  const handleShowResults = () => {
    setShowResults(true);
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setScore(0);
    setTimeLeft(0);
    setQuizCompleted(false);
    setShowResults(false);
    setQuizStarted(false);
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const calculatePercentage = () => {
    return Math.round((score / questions.length) * 100);
  };
  
  const getPassingScore = () => {
    return level === 'basic' ? 60 : level === 'intermediate' ? 70 : 80;
  };
  
  const passedQuiz = () => {
    return calculatePercentage() >= getPassingScore();
  };
  
  // If no questions found
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No questions found for this level</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  // Start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-6">
                <span className="text-3xl">🎨</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">CSS {level.charAt(0).toUpperCase() + level.slice(1)} Quiz</h1>
              <p className="text-gray-600 text-lg mb-2">Test your CSS knowledge at the {level} level</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">📋 Quiz Details</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex justify-between">
                    <span>Total Questions:</span>
                    <span className="font-semibold">{questions.length}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Time Limit:</span>
                    <span className="font-semibold">
                      {level === 'basic' ? '15 minutes' : level === 'intermediate' ? '25 minutes' : '35 minutes'}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-semibold">{getPassingScore()}%</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="font-semibold text-gray-800 mb-2">📝 Instructions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Select one answer for each question
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    You can navigate between questions
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Timer will start when you begin
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Review your answers before submitting
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <button
                onClick={startQuiz}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Quiz
              </button>
              <div>
                <button
                  onClick={() => navigate(-1)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Levels
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Results screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                passedQuiz() ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'
              }`}>
                <span className="text-4xl">{passedQuiz() ? '🎉' : '📝'}</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Quiz Results</h1>
              <p className="text-gray-600 text-lg">You scored</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-center text-white">
                <div className="text-5xl font-bold mb-2">{score}/{questions.length}</div>
                <div className="text-blue-100">Correct Answers</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-center text-white">
                <div className="text-5xl font-bold mb-2">{calculatePercentage()}%</div>
                <div className="text-purple-100">Final Score</div>
              </div>
              
              <div className={`p-6 rounded-xl text-center ${
                passedQuiz() ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'
              } text-white`}>
                <div className="text-5xl font-bold mb-2">{passedQuiz() ? 'PASS' : 'FAIL'}</div>
                <div className={passedQuiz() ? 'text-green-100' : 'text-red-100'}>
                  {passedQuiz() ? 'Congratulations!' : 'Keep practicing!'}
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Detailed Results</h3>
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const isCorrect = answers[index] === question.correctAnswer;
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-gray-800">
                          Q{index + 1}: {question.question}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm font-medium ${
                          isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <div className="text-gray-600">
                        <div className="mb-1">
                          <span className="font-medium">Your answer:</span>{' '}
                          {answers[index] !== null ? question.options[answers[index]] : 'Not answered'}
                        </div>
                        <div>
                          <span className="font-medium">Correct answer:</span>{' '}
                          {question.options[question.correctAnswer]}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleRestartQuiz}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Retry Quiz
                </button>
                <button
                  onClick={() => navigate('/quiz/css')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  Choose Another Level
                </button>
                <button
                  onClick={() => navigate('/quiz')}
                  className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Back to Subjects
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz in progress
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">CSS {level.charAt(0).toUpperCase() + level.slice(1)} Quiz</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600">Time Left</div>
                <div className={`text-xl font-bold ${
                  timeLeft < 60 ? 'text-red-600' : 'text-gray-800'
                }`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-xl font-bold text-gray-800">{score}</div>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Question Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {questions[currentQuestion].question}
            </h2>
            
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = answers[currentQuestion] === questions[currentQuestion].correctAnswer;
                
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-semibold ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ← Previous
            </button>
            
            <div className="text-center">
              <div className="text-gray-600 mb-2">
                Select your answer to proceed
              </div>
            </div>
            
            <button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className={`px-6 py-3 rounded-lg font-semibold ${
                selectedAnswer === null
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
              }`}
            >
              {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
            </button>
          </div>
        </div>
        
        {/* Quick Navigation */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Navigation</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {questions.map((_, index) => {
              const isAnswered = answers[index] !== null;
              const isCurrent = index === currentQuestion;
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index);
                    setSelectedAnswer(answers[index]);
                  }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium ${
                    isCurrent
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : isAnswered
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-center mt-6">
            <button
              onClick={handleQuizComplete}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              Submit Quiz
            </button>
          </div>
        </div>
        
        {/* Quiz completion modal */}
        {quizCompleted && !showResults && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h3>
                <p className="text-gray-600">Time's up! Ready to see your results?</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700">Questions Answered:</span>
                  <span className="font-semibold">{answers.filter(a => a !== null).length}/{questions.length}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700">Correct Answers:</span>
                  <span className="font-semibold">{score}</span>
                </div>
                
                <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700">Time Used:</span>
                  <span className="font-semibold">
                    {formatTime(level === 'basic' ? 900 : level === 'intermediate' ? 1500 : 2100 - timeLeft)}
                  </span>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleShowResults}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg"
                >
                  View Results
                </button>
                <button
                  onClick={handleRestartQuiz}
                  className="flex-1 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
                >
                  Retry Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CSSQuiz;