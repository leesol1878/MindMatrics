import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Quiz from './components/Quizes.jsx'                 // Subject selection page
import QuizSelection from './components/QuizSelection.jsx'   // Level selection page  
import HTMLQuiz from './components/subjects/html/HTML.jsx'  // HTML quiz component
import CSSQuiz from './components/subjects/css/CSS.JSX'    // CSS quiz component
import JavascriptQuiz from './components/subjects/js/Javascript.jsx' // JavaScript quiz component
import Python from './components/subjects/python/Python.jsx' // Python quiz component
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
        
        {/* Individual quiz routes */}
        <Route path="/quiz/html/:level" element={<HTMLQuiz />} />
        <Route path="/quiz/css/:level" element={<CSSQuiz />} />
        <Route path="/quiz/javascript/:level" element={<JavascriptQuiz />} />
        
        {/* Fallback route */}
        <Route path="*" element={<div>404 - Page Not Found</div>} />

        <Route path="/quiz/python/:level" element={< Python/>} />
      </Routes>
    </Router>
  )
}

export default App