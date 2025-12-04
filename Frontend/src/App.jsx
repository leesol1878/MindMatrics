import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Quiz from './components/Quizes.jsx'                 // Subject selection page
import QuizSelection from './components/QuizSelection.jsx'   // Level selection page  
import HTMLQuiz from '/src/components/subjects/html/HTML.jsx';  // Actual quiz component
import CSSQuiz from "./components/subjects/css/CSS.JSX";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/results" element={<div>Results Page - To be implemented</div>} />
        
        {/* Quiz Routes */}
        <Route path="/quiz" element={<Quiz />} />                     {/* Subject selection */}
        <Route path="/quiz/:subject/selection" element={<QuizSelection />} />  {/* Level selection */}
        <Route path="/quiz/:subject/:level" element={<HTMLQuiz />} />          {/* Actual quiz - FIXED */}


        {/* <Route path="/quiz/css/:level" element={<CSSQuiz />} />          Actual quiz - CSS */}
        


      </Routes>
    </Router>
  )
}

export default App