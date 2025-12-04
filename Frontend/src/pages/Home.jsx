import React from 'react'
import Navbar from '../components/Navbar'
import Quiz from '../components/Quizes'
import QuizSelection from '../components/QuizSelection.jsx'
import HTML from '../components/subjects/html/HTML.jsx' 
import CSS from '../components/subjects/css/CSS.JSX'


const Home = () => {
  return (
    <div>
        <Navbar />

        <Quiz />

        <QuizSelection />

        < HTML />

        <CSS/>

        {/* <Login /> */}
    </div>
  )
}

export default Home