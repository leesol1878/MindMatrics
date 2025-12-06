import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const JavascriptQuiz = () => {
  const { level } = useParams(); // Get level from URL params
  const navigate = useNavigate();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes
  const [isAnswered, setIsAnswered] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);

  // JavaScript questions data
  const javascriptQuestions = {
    basic: [
      { id: 1, question: "Which keyword declares a variable with block scope introduced in ES6?", options: ["var", "let", "const", "both let and const"], correctAnswer: 1 },
      { id: 2, question: "How do you write a single-line comment in JS?", options: ["// comment", "/* comment */", "<!-- comment -->", "# comment"], correctAnswer: 0 },
      { id: 3, question: "Which function converts a JSON string to an object?", options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "parseJSON()"], correctAnswer: 0 },
      { id: 4, question: "Which operator is used for strict equality (no type coercion)?", options: ["==", "=", "===", "!=="], correctAnswer: 2 },
      { id: 5, question: "How do you add an element to the end of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 0 },
      { id: 6, question: "Which global object contains timing functions like setTimeout in browsers?", options: ["Window", "Timer", "Global", "Navigator"], correctAnswer: 0 },
      { id: 7, question: "How to create a function expression?", options: ["function name() {}", "const fn = function() {}", "fn := function() {}", "def fn() {}"], correctAnswer: 1 },
      { id: 8, question: "Which method joins array elements into a string?", options: ["join()", "concat()", "toString()", "merge()"], correctAnswer: 0 },
      { id: 9, question: "Which keyword throws an error manually?", options: ["raise", "throw", "error", "fail"], correctAnswer: 1 },
      { id: 10, question: "How to check the type of a variable?", options: ["typeof x", "type(x)", "getType(x)", "typeof(x)"], correctAnswer: 0 },
      { id: 11, question: "Which syntax declares a constant reference in JS?", options: ["constant foo = 1", "const foo = 1", "let const foo = 1", "var const foo = 1"], correctAnswer: 1 },
      { id: 12, question: "Which method removes the last element from an array and returns it?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 1 },
      { id: 13, question: "Which loop repeatedly executes while condition is true (test before body)?", options: ["do...while", "while", "forEach", "for...in"], correctAnswer: 1 },
      { id: 14, question: "Which operator is used to concatenate strings?", options: ["+", "&", ".", "concat() only"], correctAnswer: 0 },
      { id: 15, question: "Which built-in method converts an object to a JSON string?", options: ["JSON.stringify()", "JSON.parse()", "toJSON()", "Object.toString()"], correctAnswer: 0 },
      { id: 16, question: "Which statement creates a new array with values that pass a test?", options: ["map()", "filter()", "reduce()", "find()"], correctAnswer: 1 },
      { id: 17, question: "Which value is returned when a function has no return statement?", options: ["undefined", "null", "0", "'' (empty string)"], correctAnswer: 0 },
      { id: 18, question: "Which keyword makes a function an async function?", options: ["async", "await", "defer", "asyncify"], correctAnswer: 0 },
      { id: 19, question: "Which method adds elements to the start of an array?", options: ["push()", "pop()", "shift()", "unshift()"], correctAnswer: 3 },
      { id: 20, question: "Which built-in object provides methods like map, filter and reduce for arrays?", options: ["Array.prototype", "Object.prototype", "List.prototype", "Collection.prototype"], correctAnswer: 0 }
    ],
    
    intermediate: [
      { id: 1, question: "Which method returns a promise resolved after a delay when you wrap setTimeout?", options: ["setTimeout returns a promise", "You must wrap setTimeout in a Promise", "delay()", "Promise.timeout()"], correctAnswer: 1 },
      { id: 2, question: "Which array method creates a new array by applying a function to each element?", options: ["filter()", "map()", "forEach()", "reduce()"], correctAnswer: 1 },
      { id: 3, question: "Which operator spreads elements of an array?", options: ["...", "spread()", "@spread", "++"], correctAnswer: 0 },
      { id: 4, question: "Which symbol defines a template literal?", options: ['"', "'", "` (backtick)", "`` (double backtick)"], correctAnswer: 2 },
      { id: 5, question: "Which keyword binds 'this' lexically in arrow functions?", options: ["this", "=>", "lex", "bind"], correctAnswer: 1 },
      { id: 6, question: "Which method is used to handle promise rejections?", options: [".then()", ".catch()", ".finally()", ".resolve()"], correctAnswer: 1 },
      { id: 7, question: "Which data structure stores unique values?", options: ["Array", "Set", "Map", "Object"], correctAnswer: 1 },
      { id: 8, question: "Which method reduces an array to a single value?", options: ["reduce()", "aggregate()", "fold()", "combine()"], correctAnswer: 0 },
      { id: 9, question: "Which syntax creates a new object with specified prototype?", options: ["Object.create(proto)", "{__proto__: proto}", "new Object(proto)", "Object.prototype(proto)"], correctAnswer: 0 },
      { id: 10, question: "Which statement imports a module default export (ES module)?", options: ["import * as m from 'x'", "import m from 'x'", "const m = require('x')", "export m from 'x'"], correctAnswer: 1 },
      { id: 11, question: "Which method serializes an object to JSON string?", options: ["JSON.toString()", "JSON.stringify()", "Object.stringify()", "toJSON()"], correctAnswer: 1 },
      { id: 12, question: "Which object method returns an array of a given object's own enumerable property [key, value] pairs?", options: ["Object.keys()", "Object.values()", "Object.entries()", "Object.getOwnPropertyNames()"], correctAnswer: 2 },
      { id: 13, question: "Which method creates a shallow-copied array of a portion of an existing array?", options: ["slice()", "splice()", "copyWithin()", "concat()"], correctAnswer: 0 },
      { id: 14, question: "Which operator can be used to assign a default value when a variable is nullish (null or undefined)?", options: ["||", "??", "&&", "?: "], correctAnswer: 1 },
      { id: 15, question: "Which built-in object provides key-value pairs but preserves insertion order and allows any value as key?", options: ["Object", "Map", "Set", "WeakMap"], correctAnswer: 1 },
      { id: 16, question: "Which function creates a new Promise that resolves when all input promises resolve?", options: ["Promise.race()", "Promise.all()", "Promise.any()", "Promise.allSettled()"], correctAnswer: 1 },
      { id: 17, question: "Which method returns the first element that satisfies the provided testing function?", options: ["filter()", "find()", "findIndex()", "some()"], correctAnswer: 1 },
      { id: 18, question: "Which operator checks whether a property exists in an object (in operator)?", options: ["hasOwnProperty", "in", "typeof", "exists"], correctAnswer: 1 },
      { id: 19, question: "Which loop iterates enumerable properties of an object (keys)?", options: ["for...of", "for...in", "forEach", "while"], correctAnswer: 1 },
      { id: 20, question: "Which method converts a NodeList to an Array?", options: ["Array.from(nodeList)", "[...nodeList]", "Both of the above", "nodeList.toArray()"], correctAnswer: 2 }
    ],
    
    advanced: [
      { id: 1, question: "Which API provides a way to run background tasks in a browser thread?", options: ["Worker API", "Service Worker", "BackgroundWorker", "Thread API"], correctAnswer: 0 },
      { id: 2, question: "Which feature allows destructuring arrays into variables?", options: ["let [a,b] = arr", "let (a,b) = arr", "let {a,b} = arr", "let a,b = arr"], correctAnswer: 0 },
      { id: 3, question: "Which operator coalesces nullish values (null or undefined)?", options: ["||", "??", "&&", "?: "], correctAnswer: 1 },
      { id: 4, question: "Which method schedules microtasks to run after current script?", options: ["setTimeout", "setImmediate", "queueMicrotask", "requestAnimationFrame"], correctAnswer: 2 },
      { id: 5, question: "Which object holds key-value pairs and preserves insertion order?", options: ["Object", "Map", "Set", "Array"], correctAnswer: 1 },
      { id: 6, question: "Which concept avoids blocking UI by yielding control back to the event loop?", options: ["Promises", "Async/Await", "Callbacks", "All of these"], correctAnswer: 3 },
      { id: 7, question: "Which method creates a shallow copy of an object?", options: ["Object.assign({}, obj)", "{...obj}", "Both of these", "clone(obj)"], correctAnswer: 2 },
      { id: 8, question: "Which feature allows private fields in classes?", options: ["#privateField", "_private", "private:", "privateField()"], correctAnswer: 0 },
      { id: 9, question: "Which API streams binary data in chunks (browser Fetch)?", options: ["Blob API", "Fetch Streams (ReadableStream)", "FileReader", "XHR"], correctAnswer: 1 },
      { id: 10, question: "Which statement rejects a promise with a reason?", options: ["Promise.reject(reason)", "throw reason", "reject(reason)", "Promise.error(reason)"], correctAnswer: 0 }
    ]
  };

  // Get questions based on level
  const questions = javascriptQuestions[level] || javascriptQuestions.basic;
  
  useEffect(() => {
    if (timeRemaining > 0 && !showResult) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleQuizEnd();
    }
  }, [timeRemaining, showResult]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionClick = (optionIndex) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    const isCorrect = optionIndex === questions[currentQuestion].correctAnswer;
    
    // Record user answer
    setUserAnswers(prev => [...prev, {
      questionId: questions[currentQuestion].id,
      selected: optionIndex,
      correct: isCorrect
    }]);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      handleQuizEnd();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedOption(userAnswers[currentQuestion - 1]?.selected || null);
      setIsAnswered(true);
    }
  };

  const handleQuizEnd = () => {
    setShowResult(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setTimeRemaining(900);
    setIsAnswered(false);
    setUserAnswers([]);
  };

  const handleBackToSelection = () => {
    navigate('/quiz/javascript/selection');
  };

  const calculateProgress = () => {
    return ((currentQuestion + 1) / questions.length) * 100;
  };

  const getLevelColor = () => {
    switch(level) {
      case 'basic': return 'from-green-500 to-emerald-600';
      case 'intermediate': return 'from-yellow-500 to-orange-600';
      case 'advanced': return 'from-red-500 to-pink-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  const getLevelName = () => {
    switch(level) {
      case 'basic': return 'Basic';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return 'Basic';
    }
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const getPerformanceMessage = () => {
      if (percentage >= 90) return "Excellent! 🎉";
      if (percentage >= 70) return "Great job! 👍";
      if (percentage >= 50) return "Good effort! 😊";
      return "Keep practicing! 💪";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${getLevelColor()} mb-6`}>
                <span className="text-white text-2xl">JS</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">JavaScript Quiz Results</h1>
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
    );
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
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-xl bg-gradient-to-r ${getLevelColor()} text-white`}>
                <span className="text-2xl font-bold">JS</span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  JavaScript Quiz - {getLevelName()} Level
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
                    handleOptionClick(-1); // Mark as unanswered
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
  );
};

export default JavascriptQuiz;