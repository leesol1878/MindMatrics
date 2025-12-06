import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// Import your questions data
import questionsData from '../../../assets/dummydata.js'

function HTMLQuiz() {
  const navigate = useNavigate()
  const { level } = useParams()
  const [selectedLevel, setSelectedLevel] = useState(level || null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(900)
  const [isAnswered, setIsAnswered] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])
  const timerRef = useRef(null)

  // HTML questions data from your imported file
  const htmlQuestions = questionsData.html || {};
  
  // Get questions based on selected level
  const questions = htmlQuestions[selectedLevel] || []

  useEffect(() => {
    if (timeRemaining > 0 && !showResult) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0) {
      handleQuizEnd()
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timeRemaining, showResult])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return
    
    setSelectedOption(optionIndex)
    setIsAnswered(true)
    
    const isCorrect = optionIndex === questions[currentQuestion].correctAnswer
    
    setUserAnswers(prev => [...prev, {
      questionId: questions[currentQuestion].id,
      selected: optionIndex,
      correct: isCorrect
    }])
    
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      handleQuizEnd()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setSelectedOption(userAnswers[currentQuestion - 1]?.selected || null)
      setIsAnswered(true)
    }
  }

  const handleQuizEnd = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setShowResult(true)
  }

  const handleRestart = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setCurrentQuestion(0)
    setSelectedOption(null)
    setScore(0)
    setShowResult(false)
    setTimeRemaining(900)
    setIsAnswered(false)
    setUserAnswers([])
  }

  const handleBackToSelection = () => {
    navigate('/quiz/html/selection')
  }

  const calculateProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100
  }

  const getLevelColor = () => {
    switch(selectedLevel) {
      case 'basic': return 'from-green-500 to-emerald-600'
      case 'intermediate': return 'from-yellow-500 to-orange-600'
      case 'advanced': return 'from-red-500 to-pink-600'
      default: return 'from-blue-500 to-indigo-600'
    }
  }

  const getLevelName = () => {
    switch(selectedLevel) {
      case 'basic': return 'Basic'
      case 'intermediate': return 'Intermediate'
      case 'advanced': return 'Advanced'
      default: return 'Basic'
    }
  }

  // If no level selected, show level selection
  if (!selectedLevel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <span className="text-5xl mr-4">🌐</span>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                HTML QUIZ
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Test your HTML knowledge across different difficulty levels. Master the building blocks of the web!
            </p>
          </div>

          {/* Level Selection */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Choose Your Level</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  level: 'basic',
                  title: 'Basic Level',
                  description: 'Perfect for beginners. Learn the fundamentals of HTML structure and tags.',
                  questions: 20,
                  duration: '15 minutes',
                  difficulty: 'Beginner',
                  color: 'from-green-400 to-green-600'
                },
                {
                  level: 'intermediate',
                  title: 'Intermediate Level',
                  description: 'For those with some experience. Explore semantic HTML, forms, and accessibility.',
                  questions: 40,
                  duration: '25 minutes',
                  difficulty: 'Intermediate',
                  color: 'from-blue-400 to-blue-600'
                },
                {
                  level: 'advanced',
                  title: 'Advanced Level',
                  description: 'Expert level. Dive deep into HTML5 APIs, optimization, and modern practices.',
                  questions: 60,
                  duration: '35 minutes',
                  difficulty: 'Advanced',
                  color: 'from-purple-400 to-purple-600'
                }
              ].map((level) => (
                <div
                  key={level.level}
                  className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-2xl p-1 transition-all duration-300 hover:scale-105 cursor-pointer border border-blue-100/30"
                  onClick={() => {
                    setSelectedLevel(level.level)
                    setTimeRemaining(level.level === 'basic' ? 900 : level.level === 'intermediate' ? 1500 : 2100)
                  }}
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
                        <span className="font-semibold">{level.questions}</span>
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
                        setSelectedLevel(level.level)
                        setTimeRemaining(level.level === 'basic' ? 900 : level.level === 'intermediate' ? 1500 : 2100)
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

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100)
    const getPerformanceMessage = () => {
      if (percentage >= 90) return "Excellent! 🎉"
      if (percentage >= 70) return "Great job! 👍"
      if (percentage >= 50) return "Good effort! 😊"
      return "Keep practicing! 💪"
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getLevelColor()} mb-6`}>
                <span className="text-white text-2xl">HTML</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">HTML Quiz Results</h1>
              <p className="text-lg text-gray-600 mb-4">{getLevelName()} Level</p>
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 font-semibold">
                {getPerformanceMessage()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-4">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">{score}</div>
                <div className="text-green-700 font-medium">Correct Answers</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">{questions.length}</div>
                <div className="text-blue-700 font-medium">Total Questions</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                  <span className="text-2xl">🏆</span>
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">{percentage}%</div>
                <div className="text-purple-700 font-medium">Final Score</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Score Progress</h3>
                <span className="text-lg font-bold text-gray-800">{percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full bg-gradient-to-r ${getLevelColor()} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transform transition"
              >
                Restart Quiz
              </button>
              <button
                onClick={handleBackToSelection}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-semibold shadow-lg hover:scale-105 transform transition"
              >
                Back to Levels
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No questions available for this level</h1>
          <button
            onClick={handleBackToSelection}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transform transition"
          >
            Back to Level Selection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${getLevelColor()} text-white`}>
                <span className="text-2xl font-bold">HTML</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  HTML Quiz - {getLevelName()} Level
                </h1>
                <p className="text-gray-600 mt-1">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className="text-2xl font-bold text-gray-800">{formatTime(timeRemaining)}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(calculateProgress())}%
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full bg-gradient-to-r ${getLevelColor()} transition-all duration-300`}
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Container */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4">
                <span className="text-xl font-bold">Q{currentQuestion + 1}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">
                {questions[currentQuestion]?.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {questions[currentQuestion]?.options.map((option, index) => {
                const isSelected = selectedOption === index;
                const isCorrect = index === questions[currentQuestion].correctAnswer;
                const showResult = isAnswered;

                let optionClasses = "w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-300 ";
                
                if (showResult) {
                  if (isCorrect) {
                    optionClasses += "bg-green-50 border-green-300 text-green-700 shadow-sm";
                  } else if (isSelected && !isCorrect) {
                    optionClasses += "bg-red-50 border-red-300 text-red-700 shadow-sm";
                  } else {
                    optionClasses += "border-gray-200 text-gray-700";
                  }
                } else {
                  optionClasses += "border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm text-gray-700 ";
                  if (isSelected) {
                    optionClasses += "border-indigo-400 bg-indigo-50";
                  }
                }

                return (
                  <button
                    key={index}
                    className={`${optionClasses} ${isSelected ? 'transform scale-[1.02]' : ''}`}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center">
                      {showResult ? (
                        isCorrect ? (
                          <div className="mr-4 text-green-500 text-xl">✓</div>
                        ) : isSelected ? (
                          <div className="mr-4 text-red-500 text-xl">✗</div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 mr-4"></div>
                        )
                      ) : (
                        <div className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300'} mr-4`}>
                          {isSelected && <div className="w-3 h-3 rounded-full bg-white mx-auto mt-1"></div>}
                        </div>
                      )}
                      <span className="text-lg">{option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            {!isAnswered ? (
              <button
                onClick={() => {
                  if (selectedOption === null) {
                    handleOptionClick(-1);
                  }
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium shadow hover:scale-105 transform transition"
              >
                Skip Question
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow hover:scale-105 transform transition flex items-center gap-2"
              >
                {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Question Navigation Dots */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Question Navigation</h3>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (index !== currentQuestion) {
                      setCurrentQuestion(index);
                      setSelectedOption(userAnswers[index]?.selected || null);
                      setIsAnswered(userAnswers[index] !== undefined);
                    }
                  }}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    index === currentQuestion
                      ? `bg-gradient-to-r ${getLevelColor()} text-white scale-110`
                      : userAnswers[index]
                      ? userAnswers[index].correct
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HTMLQuiz