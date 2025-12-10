import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuiz } from '../api/quizAPI'

function QuizEngine() {
  const { subject, level } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { [qIndex]: { selected: number|null, correct: bool, skipped?:bool } }
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const q = getQuiz(subject, level)
    setQuiz(q)
    if (q && q.duration) setTimeLeft(q.duration * 60)
    else setTimeLeft(null)
    setCurrentIndex(0)
    setAnswers({})
    setFinished(false)
    setScore(0)
  }, [subject, level])

  useEffect(() => {
    if (timeLeft == null) return
    if (finished) return
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          handleSubmit()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [timeLeft, finished])

  const getOptionText = (option) => {
    if (option == null) return ''
    if (typeof option === 'string') return option
    return option.optionText || option.text || ''
  }

  const isOptionCorrect = (q, oi) => {
    // Support both shapes: option object with isCorrect OR question.correctAnswer index
    const opt = q.options && q.options[oi]
    if (opt && typeof opt === 'object' && 'isCorrect' in opt) return !!opt.isCorrect
    if (typeof q.correctAnswer === 'number') return oi === q.correctAnswer
    return false
  }

  const handleSelect = (qIndex, optIndex) => {
    setAnswers((prev) => {
      if (prev[qIndex]) return prev // already answered
      const q = quiz.questions[qIndex]
      const correct = isOptionCorrect(q, optIndex)
      const next = { ...prev, [qIndex]: { selected: optIndex, correct, skipped: false } }
      return next
    })
  }

  const handleSkip = (qIndex) => {
    setAnswers((prev) => {
      if (prev[qIndex]) return prev
      return { ...prev, [qIndex]: { selected: null, correct: false, skipped: true } }
    })
  }

  const calculateScore = () => {
    if (!quiz) return 0
    let s = 0
    Object.values(answers).forEach((a) => {
      if (a && a.correct) s++
    })
    return s
  }

  const handleSubmit = () => {
    const s = calculateScore()
    setScore(s)
    setFinished(true)
    clearInterval(timerRef.current)
  }

  const handleRestart = () => {
    if (!quiz) return
    setAnswers({})
    setCurrentIndex(0)
    setFinished(false)
    setScore(0)
    if (quiz.duration) setTimeLeft(quiz.duration * 60)
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>
    )
  }

  const q = quiz.questions[currentIndex]
  const minutes = Math.floor((timeLeft || 0) / 60)
  const seconds = (timeLeft || 0) % 60

  const answeredCount = Object.keys(answers).length
  const progressPercent = quiz.questions.length ? Math.round((answeredCount / quiz.questions.length) * 100) : 0

  if (finished) {
    const percentage = Math.round((score / quiz.questions.length) * 100)
    const getPerformanceMessage = () => {
      if (percentage >= 90) return 'Excellent! 🎉'
      if (percentage >= 70) return 'Great job! 👍'
      if (percentage >= 50) return 'Good effort! 😊'
      return 'Keep practicing! 💪'
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 mb-6`}>
                <span className="text-white text-2xl">{(quiz.technology || subject || '').toUpperCase()}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{quiz.title || `${quiz.technology} Quiz`}</h1>
              <p className="text-lg text-gray-600 mb-4">{quiz.level || level} Level</p>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">{quiz.questions.length}</div>
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
                  className={`h-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500`}
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
                onClick={() => navigate(`/quiz/${quiz.technology || subject}/selection`)}
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

  // render question view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white`}>
                <span className="text-2xl font-bold">{(quiz.technology || subject || '').toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{quiz.title || `${quiz.technology} Quiz`} - {quiz.level || level}</h1>
                <p className="text-gray-600 mt-1">Question {currentIndex + 1} of {quiz.questions.length}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className="text-2xl font-bold text-gray-800">{minutes.toString().padStart(2,'0')}:{seconds.toString().padStart(2,'0')}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-800">{progressPercent}%</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-8">
            <div className="flex items-start mb-6">
              <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4">
                <span className="text-xl font-bold">Q{currentIndex + 1}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 leading-relaxed">{q.questionText || q.question}</h2>
            </div>

            <div className="space-y-4">
              {q.options.map((option, index) => {
                const ans = answers[currentIndex]
                const isAnswered = !!ans
                const isSelected = ans && ans.selected === index
                const correct = isAnswered && (ans.selected === null ? false : ans.correct)
                const optIsCorrect = isOptionCorrect(q, index)

                let optionClasses = 'w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-300 '
                if (isAnswered) {
                  if (optIsCorrect) {
                    optionClasses += 'bg-green-50 border-green-300 text-green-700 shadow-sm'
                  } else if (isSelected && !optIsCorrect) {
                    optionClasses += 'bg-red-50 border-red-300 text-red-700 shadow-sm'
                  } else {
                    optionClasses += 'border-gray-200 text-gray-700'
                  }
                } else {
                  optionClasses += 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm text-gray-700 '
                  if (isSelected) optionClasses += 'border-indigo-400 bg-indigo-50'
                }

                return (
                  <button
                    key={index}
                    className={`${optionClasses} ${isSelected ? 'transform scale-[1.02]' : ''}`}
                    onClick={() => handleSelect(currentIndex, index)}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center">
                      {isAnswered ? (
                        optIsCorrect ? (
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
                      <span className="text-lg">{getOptionText(option)}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                if (currentIndex > 0) setCurrentIndex((i) => Math.max(0, i - 1))
              }}
              disabled={currentIndex === 0}
              className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex gap-2">
              {!answers[currentIndex] ? (
                <button
                  onClick={() => handleSkip(currentIndex)}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-white font-medium shadow hover:scale-105 transform transition"
                >
                  Skip Question
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (currentIndex === quiz.questions.length - 1) handleSubmit()
                    else setCurrentIndex((i) => Math.min(quiz.questions.length - 1, i + 1))
                  }}
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow hover:scale-105 transform transition flex items-center gap-2"
                >
                  {currentIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Question Navigation</h3>
            <div className="flex flex-wrap gap-2">
              {quiz.questions.map((_, index) => {
                const ans = answers[index]
                const btnClass = index === currentIndex
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white scale-110'
                  : ans
                    ? ans.correct
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index)
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${btnClass}`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizEngine
