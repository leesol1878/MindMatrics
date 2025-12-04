import React from 'react'
import { useNavigate } from 'react-router-dom'
//import {HTMLQuiz} from './subjects/html/HTML.jsx'

function Quiz() {
  const navigate = useNavigate()

  const subjects = [
    { id: 1, name: 'HTML', icon: '🌐' },
    { id: 2, name: 'CSS', icon: '🎨' },
    { id: 3, name: 'JavaScript', icon: '⚡' },
    { id: 4, name: 'Python', icon: '🐍' },
  ]

  const startQuiz = (subjectName) => {
    navigate(`/quiz/${subjectName.toLowerCase()}/selection`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Master Your Tech Skills
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Challenge yourself with interactive quizzes across various technologies. 
            Learn, practice, and track your progress in real-time.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-8">
            Choose Your Technology
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {subjects.map(subject => (
              <button
                key={subject.id}
                onClick={() => startQuiz(subject.name)}
                className="bg-gradient-to-br from-blue-400/20 via-purple-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-200/30 text-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center min-h-[160px] group hover:from-blue-400/30 hover:via-purple-500/30 hover:to-blue-600/30"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {subject.icon}
                </div>
                <div className="text-2xl font-bold mb-3 capitalize">
                  {subject.name}
                </div>
                <div className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-4 py-2">
                  Start Quiz →
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Why Learn With Us Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-white/50">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Learn With Us?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 transform border border-blue-100/30">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Learn Fast</h4>
              <p className="text-gray-600 leading-relaxed">
                Interactive quizzes help you learn and retain information faster than traditional methods.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 transform border border-blue-100/30">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Track Progress</h4>
              <p className="text-gray-600 leading-relaxed">
                Monitor your improvement with detailed analytics and performance tracking.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-sm rounded-xl p-6 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 transform border border-blue-100/30">
              <div className="text-4xl mb-4">🏆</div>
              <h4 className="text-xl font-semibold text-gray-800 mb-3">Earn Badges</h4>
              <p className="text-gray-600 leading-relaxed">
                Unlock achievements and badges as you master different technologies and concepts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz