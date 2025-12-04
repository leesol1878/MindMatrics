import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Import your questions data (you'll need to import this from your actual file)
import questionsData from '../../../assets/dummydata.js'


function HTMLQuiz() {
  const navigate = useNavigate()
  const { subject, level } = useParams()
  const [selectedLevel, setSelectedLevel] = useState(level || null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const timerRef = useRef(null)

  // Get questions based on subject and level
  const questions = questionsData[subject]?.[selectedLevel] || []

  // Timer setup - SIMPLIFIED AND FIXED VERSION
  useEffect(() => {
    // Clear any existing timer when component unmounts or quiz completes
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Handle timer logic separately
  useEffect(() => {
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      // Clear any existing timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      
      // Start new timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current)
            setTimeout(() => finishQuiz(), 100) // Small delay to ensure state update
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    } else {
      // Clear timer if quiz is not started or completed
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [quizStarted, quizCompleted])

  // Initialize timer when quiz starts
  useEffect(() => {
    if (quizStarted && !quizCompleted) {
      const durations = {
        basic: 15 * 60, // 15 minutes in seconds
        intermediate: 25 * 60, // 25 minutes
        advanced: 35 * 60 // 35 minutes
      }
      setTimeLeft(durations[selectedLevel] || 900)
    }
  }, [quizStarted, selectedLevel, quizCompleted])

  const startQuiz = (level) => {
    setSelectedLevel(level)
    setQuizStarted(true)
    // Reset answers and current question when starting new quiz
    setSelectedAnswers({})
    setCurrentQuestion(0)
    setScore(0)
  }

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answerIndex
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      finishQuiz()
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const finishQuiz = () => {
    // Clear timer first
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    // Calculate score
    let calculatedScore = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        calculatedScore++
      }
    })
    
    setScore(calculatedScore)
    setQuizCompleted(true)
    setQuizStarted(false)
  }

  const restartQuiz = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswers({})
    setQuizStarted(false)
    setQuizCompleted(false)
    setSelectedLevel(null)
    setTimeLeft(0)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // If no level selected, show level selection
  if (!selectedLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <span className="text-5xl mr-4">🌐</span>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HTML QUIZ
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Choose your difficulty level and test your HTML knowledge. Each level offers a different challenge!
            </p>
          </div>

          {/* Quiz Description Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12 border border-white/50">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About This Quiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">What to Expect:</h3>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Multiple choice questions with instant feedback
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Timer to track your progress
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Detailed results and explanations
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Progress tracking throughout the quiz
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Preparation Tips:</h3>
                <ul className="text-gray-600 space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    Make sure you have a stable internet connection
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    Choose the level that matches your experience
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    Read each question carefully before answering
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">💡</span>
                    Don't rush - you can always review your answers
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Level Selection */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Choose Your Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  level: 'basic',
                  title: 'Basic Level',
                  description: 'Perfect for beginners. Test your fundamental knowledge with straightforward questions.',
                  questions: 10,
                  duration: '15 minutes',
                  difficulty: 'Easy',
                  color: 'from-green-400 to-green-600'
                },
                {
                  level: 'intermediate',
                  title: 'Intermediate Level',
                  description: 'For those with some experience. Challenge yourself with more complex scenarios.',
                  questions: 15,
                  duration: '25 minutes',
                  difficulty: 'Medium',
                  color: 'from-blue-400 to-blue-600'
                },
                {
                  level: 'advanced',
                  title: 'Advanced Level',
                  description: 'Expert level questions. Test your deep understanding and practical knowledge.',
                  questions: 20,
                  duration: '35 minutes',
                  difficulty: 'Hard',
                  color: 'from-purple-400 to-purple-600'
                }
              ].map((level) => (
                <div
                  key={level.level}
                  className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-2xl p-1 transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-100/30"
                  onClick={() => startQuiz(level.level)}
                >
                  <div className="bg-white rounded-xl p-6 h-full">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{level.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        level.level === 'basic' ? 'bg-green-100 text-green-800' :
                        level.level === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {level.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-center mb-4 leading-relaxed">
                      {level.description}
                    </p>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Questions:</span>
                        <span className="font-semibold">
                          {level.level === 'basic' ? '20' : level.level === 'intermediate' ? '40' : '60'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-semibold">{level.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Passing Score:</span>
                        <span className="font-semibold">
                          {level.level === 'basic' ? '60%' : level.level === 'intermediate' ? '70%' : '80%'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        startQuiz(level.level)
                      }}
                      className="w-full py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
                    >
                      Start Quiz →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // If quiz is completed, show results
  if (quizCompleted) {
    const percentage = (score / questions.length) * 100
    const passingScore = selectedLevel === 'basic' ? 60 : selectedLevel === 'intermediate' ? 70 : 80
    const passed = percentage >= passingScore

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-white/50">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {passed ? '🎉' : '📝'}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {passed ? 'Congratulations!' : 'Quiz Completed!'}
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                {passed 
                  ? `You passed the ${selectedLevel} HTML quiz!` 
                  : `You completed the ${selectedLevel} HTML quiz.`}
              </p>
              
              <div className="mb-8">
                <div className="text-5xl font-bold mb-2">
                  <span className={passed ? 'text-green-600' : 'text-blue-600'}>
                    {score}/{questions.length}
                  </span>
                </div>
                <div className="text-xl text-gray-600">
                  {percentage.toFixed(1)}% Correct
                </div>
                
                <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-1000 ${passed ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>0%</span>
                  <span>Passing: {passingScore}%</span>
                  <span>100%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800">{selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}</div>
                  <div className="text-gray-600">Level</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800">{questions.length}</div>
                  <div className="text-gray-600">Questions</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-800">{formatTime(timeLeft)}</div>
                  <div className="text-gray-600">Time Left</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={restartQuiz}
                  className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300 mr-4"
                >
                  Restart Quiz
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 rounded-lg font-semibold bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300"
                >
                  Back to Subjects
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show the actual quiz
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Quiz Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-white/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-800">
                HTML Quiz - <span className="capitalize">{selectedLevel}</span> Level
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 rounded-lg px-4 py-2">
                <div className="text-sm text-gray-500">Time Remaining</div>
                <div className={`text-xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg px-4 py-2">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-xl font-bold text-gray-800">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-6 border border-white/50">
          <div className="mb-8">
            <div className="flex items-start mb-2">
              <span className="text-blue-600 font-bold text-lg mr-2">Q{currentQuestion + 1}.</span>
              <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
                {questions[currentQuestion]?.question}
              </h2>
            </div>
            
            {/* Options */}
            <div className="mt-6 space-y-3">
              {questions[currentQuestion]?.options.map((option, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                  }`}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <label className="flex-grow cursor-pointer text-gray-700">
                    {option}
                  </label>
                  <div className="text-gray-400 text-sm">
                    {String.fromCharCode(65 + index)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              ← Previous
            </button>
            
            <div className="flex space-x-4">
              {Object.keys(selectedAnswers).length > 0 && (
                <button
                  onClick={finishQuiz}
                  className="px-6 py-3 rounded-lg font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-300"
                >
                  Finish Quiz
                </button>
              )}
              
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next →'}
              </button>
            </div>
          </div>
        </div>

        {/* Question Navigation Dots */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  currentQuestion === index
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : selectedAnswers[index] !== undefined
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HTMLQuiz;