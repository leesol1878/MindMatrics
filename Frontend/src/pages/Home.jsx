import React from 'react'
import Navbar from '../components/Navbar'
import Quiz from '../components/Quizes'



const Home = () => {
  return (
    <div>
        <Navbar />

        <Quiz />

        {/* <Login /> */}
    </div>
  )
}

export default Home