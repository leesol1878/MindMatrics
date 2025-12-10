import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Quiz from './components/Quizes.jsx'                 // Subject selection page
import QuizSelection from './components/QuizSelection.jsx'   // Level selection page  
import QuizEngine from './components/QuizEngine.jsx' // Central quiz engine component
import ResultsPage from './components/ResultsPage.jsx'      // Results page component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/results" element={<ResultsPage />} /> 
        
        {/* Subject selection */}
        <Route path="/quiz" element={<Quiz />} />
        
        {/* Level selection for each subject */}
        <Route path="/quiz/:subject/selection" element={<QuizSelection />} />
        
        {/* Individual quiz routes (centralized) */}
        <Route path="/quiz/:subject/:level" element={<QuizEngine />} />
        
        {/* Fallback route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />

        
      </Routes>
    </Router>
  )
}

export default App