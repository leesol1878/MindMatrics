import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function QuizSelection() {
  const navigate = useNavigate()
  const { subject } = useParams()
  const [selectedLevel, setSelectedLevel] = useState(null)

  // Quiz levels data
  const quizLevels = [
    {
      level: 'basic',
      title: 'Basic Level',
      description: 'Perfect for beginners. Test your fundamental knowledge with straightforward questions.',
      questions: 20,
      duration: '15 minutes',
      difficulty: 'Easy',
      color: 'from-green-400 to-green-600'
    },
    {
      level: 'intermediate',
      title: 'Intermediate Level',
      description: 'For those with some experience. Challenge yourself with more complex scenarios.',
      questions: 40,
      duration: '25 minutes',
      difficulty: 'Medium',
      color: 'from-blue-400 to-blue-600'
    },
    {
      level: 'advanced',
      title: 'Advanced Level',
      description: 'Expert level questions. Test your deep understanding and practical knowledge.',
      questions: 60,
      duration: '35 minutes',
      difficulty: 'Hard',
      color: 'from-purple-400 to-purple-600'
    }
  ]

  // Function to start the quiz with selected level
  const startQuiz = (level) => {
    navigate(`/quiz/${subject}/${level}`)
  }

  // Subject icons mapping
  const subjectIcons = {
    html: '🌐',
    css: '🎨',
    javascript: '⚡',
    python: '🐍'
  }

  // Capitalize first letter of subject
  const getSubjectName = () => {
    if (!subject) return ''
    return subject.charAt(0).toUpperCase() + subject.slice(1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <span className="text-5xl mr-4">
              {subjectIcons[subject] || '📝'}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getSubjectName()} Quiz
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Choose your difficulty level and test your {getSubjectName().toLowerCase()} knowledge. 
            Each level offers a different challenge!
          </p>
        </div>

        {/* Quiz Description Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-12 border border-white/50">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            About This Quiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                What to Expect:
              </h3>
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
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Preparation Tips:
              </h3>
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
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Choose Your Level
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quizLevels.map((level) => (
              <div
                key={level.level}
                className={`bg-gradient-to-br ${level.color} rounded-2xl p-1 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  selectedLevel === level.level ? 'ring-4 ring-blue-400 ring-opacity-50' : ''
                }`}
                onClick={() => setSelectedLevel(level.level)}
              >
                <div className="bg-white rounded-xl p-6 h-full">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {level.title}
                    </h3>
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
                        {level.level === 'basic' ? '60%' : 
                         level.level === 'intermediate' ? '70%' : '80%'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      startQuiz(level.level)
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      selectedLevel === level.level
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {selectedLevel === level.level ? 'Start Quiz →' : 'Select Level'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Start Button */}
        <div className="text-center">
          <button
            onClick={() => selectedLevel && startQuiz(selectedLevel)}
            disabled={!selectedLevel}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              selectedLevel
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl transform hover:-translate-y-1'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedLevel 
              ? `Start ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Quiz`
              : 'Select a Level to Begin'
            }
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/quiz')}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300 flex items-center justify-center mx-auto"
          >
            <span className="mr-2">←</span>
            Back to Subjects
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizSelection