import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Award, 
  BarChart3, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Filter,
  Download,
  RefreshCw,
  Home,
  Trash2,
  Eye,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  Trophy,
  Target,
  Percent
} from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [technologyFilter, setTechnologyFilter] = useState('all');
  
  // Updated to only include HTML, CSS, JavaScript (js), and Python
  const technologies = [
    "html", 
    "css", 
    "js", 
    "Python"
  ];

  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [results, filter, technologyFilter]);

  const applyFilters = () => {
    let filtered = [...results];
    
    if (filter !== 'all') {
      filtered = filtered.filter(result => result.performance === filter);
    }
    
    if (technologyFilter !== 'all') {
      filtered = filtered.filter(result => result.technology === technologyFilter);
    }
    
    setFilteredResults(filtered);
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Please login to view your results');
        navigate('/login');
        return;
      }

      // Try to fetch from your backend API
      try {
        const response = await fetch('http://localhost:5000/api/results/user/all', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setResults(data.results || []);
            calculateStats(data.results || []);
            setError('');
          } else {
            throw new Error(data.message || 'Failed to load results');
          }
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (apiError) {
        console.log('API not available, showing demo data:', apiError.message);
        // Show demo data if API is not available
        showDemoData();
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load results. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showDemoData = () => {
    const demoResults = [
      {
        _id: '1',
        title: 'HTML Basics Quiz',
        technology: 'html',
        level: 'basic',
        totalQuestions: 10,
        correct: 8,
        wrong: 2,
        score: 80,
        performance: 'Good',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        answers: []
      },
      {
        _id: '2',
        title: 'CSS Fundamentals Quiz',
        technology: 'css',
        level: 'intermediate',
        totalQuestions: 15,
        correct: 12,
        wrong: 3,
        score: 80,
        performance: 'Good',
        createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        answers: []
      },
      {
        _id: '3',
        title: 'JavaScript Advanced Quiz',
        technology: 'js',
        level: 'advanced',
        totalQuestions: 20,
        correct: 18,
        wrong: 2,
        score: 90,
        performance: 'Excellent',
        createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        answers: []
      },
      {
        _id: '4',
        title: 'Python Basics Quiz',
        technology: 'Python',
        level: 'basic',
        totalQuestions: 12,
        correct: 10,
        wrong: 2,
        score: 83,
        performance: 'Excellent',
        createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        answers: []
      },
      {
        _id: '5',
        title: 'HTML Intermediate Quiz',
        technology: 'html',
        level: 'intermediate',
        totalQuestions: 15,
        correct: 11,
        wrong: 4,
        score: 73,
        performance: 'Good',
        createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        answers: []
      }
    ];
    
    setResults(demoResults);
    calculateStats(demoResults);
  };

  const calculateStats = (resultsData) => {
    const totalQuizzes = resultsData.length;
    const averageScore = totalQuizzes > 0 
      ? resultsData.reduce((acc, curr) => acc + curr.score, 0) / totalQuizzes 
      : 0;
    
    const techStats = {};
    resultsData.forEach(result => {
      if (!techStats[result.technology]) {
        techStats[result.technology] = {
          count: 0,
          totalScore: 0,
          averageScore: 0
        };
      }
      techStats[result.technology].count++;
      techStats[result.technology].totalScore += result.score;
    });
    
    Object.keys(techStats).forEach(tech => {
      techStats[tech].averageScore = Math.round(
        techStats[tech].totalScore / techStats[tech].count
      );
    });
    
    const statsData = {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      highestScore: totalQuizzes > 0 
        ? Math.max(...resultsData.map(r => r.score))
        : 0,
      totalQuestionsAnswered: resultsData.reduce((acc, curr) => acc + curr.totalQuestions, 0),
      totalCorrectAnswers: resultsData.reduce((acc, curr) => acc + curr.correct, 0),
      technologyStats: techStats,
      performanceBreakdown: {
        Excellent: resultsData.filter(r => r.performance === 'Excellent').length,
        Good: resultsData.filter(r => r.performance === 'Good').length,
        Average: resultsData.filter(r => r.performance === 'Average').length,
        Poor: resultsData.filter(r => r.performance === 'Poor').length
      }
    };
    
    setStats(statsData);
  };

  const fetchResultDetails = async (resultId) => {
    // For demo purposes, find the result in our state
    const result = results.find(r => r._id === resultId);
    if (result) {
      setSelectedResult(result);
    } else {
      alert('Result not found');
    }
  };

  const deleteResult = async (resultId) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Try to delete from API
        const response = await fetch(`http://localhost:5000/api/results/${resultId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setResults(results.filter(result => result._id !== resultId));
            alert('Result deleted successfully');
            calculateStats(results.filter(result => result._id !== resultId));
            return;
          }
        }
      }
      
      // Fallback to local deletion for demo
      setResults(results.filter(result => result._id !== resultId));
      alert('Result deleted successfully');
      calculateStats(results.filter(result => result._id !== resultId));
      
    } catch (err) {
      console.error('Error deleting result:', err);
      alert('Failed to delete result');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const getPerformanceColor = (performance) => {
    switch (performance) {
      case 'Excellent': return 'bg-emerald-100 text-emerald-800';
      case 'Good': return 'bg-indigo-100 text-indigo-800';
      case 'Average': return 'bg-yellow-100 text-yellow-800';
      case 'Poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'basic': return 'bg-indigo-50 text-indigo-700';
      case 'intermediate': return 'bg-purple-50 text-purple-700';
      case 'advanced': return 'bg-pink-50 text-pink-700';
      default: return 'bg-indigo-50 text-indigo-700';
    }
  };

  const getLevelLabel = (level) => {
    switch (level) {
      case 'basic': return 'Beginner';
      case 'intermediate': return 'Intermediate';
      case 'advanced': return 'Advanced';
      default: return level;
    }
  };

  const getTechnologyColor = (tech) => {
    const colors = {
      html: 'bg-orange-100 text-orange-800',
      css: 'bg-blue-100 text-blue-800',
      js: 'bg-yellow-100 text-yellow-800',
      Python: 'bg-indigo-100 text-indigo-800'
    };
    return colors[tech] || 'bg-gray-100 text-gray-800';
  };

  const getTechnologyName = (tech) => {
    const names = {
      html: 'HTML',
      css: 'CSS',
      js: 'JavaScript',
      Python: 'Python'
    };
    return names[tech] || tech.toUpperCase();
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `quiz-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error && results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Results</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Award className="w-8 h-8 text-indigo-600" />
                My Quiz Results
              </h1>
              <p className="text-gray-600 mt-1">Track your learning progress and performance</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={fetchResults}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={exportResults}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Section */}
        {stats && (
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Your Learning Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalQuizzes || 0}</p>
                <p className="text-sm text-gray-600">Total Quizzes</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-center mb-2">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.averageScore || 0}%</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.highestScore || 0}%</p>
                <p className="text-sm text-gray-600">Highest Score</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex items-center justify-center mb-2">
                  <Percent className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalQuestionsAnswered || 0}</p>
                <p className="text-sm text-gray-600">Questions Answered</p>
              </div>
            </div>

            {/* Technology Stats */}
            {stats.technologyStats && Object.keys(stats.technologyStats).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance by Technology</h3>
                <div className="space-y-3">
                  {Object.entries(stats.technologyStats).map(([tech, data]) => (
                    <div key={tech} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTechnologyColor(tech)}`}>
                          {getTechnologyName(tech)}
                        </span>
                        <span className="text-xs text-gray-500">{data.count} quiz{data.count !== 1 ? 'zes' : ''}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">{data.averageScore}%</p>
                        <p className="text-xs text-gray-500">Average</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Performance Breakdown */}
            {stats.performanceBreakdown && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Performance Breakdown</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-2xl font-bold text-emerald-700">{stats.performanceBreakdown.Excellent || 0}</p>
                    <p className="text-sm text-emerald-600">Excellent</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <p className="text-2xl font-bold text-indigo-700">{stats.performanceBreakdown.Good || 0}</p>
                    <p className="text-sm text-indigo-600">Good</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-2xl font-bold text-yellow-700">{stats.performanceBreakdown.Average || 0}</p>
                    <p className="text-sm text-yellow-600">Average</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-2xl font-bold text-red-700">{stats.performanceBreakdown.Poor || 0}</p>
                    <p className="text-sm text-red-600">Needs Work</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="font-medium text-gray-700">Filters</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                <select
                  value={technologyFilter}
                  onChange={(e) => setTechnologyFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="all">All Technologies</option>
                  {technologies.map(tech => (
                    <option key={tech} value={tech}>{getTechnologyName(tech)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Performance</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option value="all">All Performances</option>
                  <option value="Excellent">Excellent (85%+)</option>
                  <option value="Good">Good (70-84%)</option>
                  <option value="Average">Average (45-69%)</option>
                  <option value="Poor">Needs Work (&lt;45%)</option>
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredResults.length} of {results.length} results
            </div>
          </div>
        </div>

        {/* Results List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz History ({filteredResults.length} results)
          </h2>
          
          {filteredResults.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow border border-gray-200">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
              <p className="text-gray-600 mb-4">
                {results.length === 0 
                  ? "You haven't taken any quizzes yet. Start learning!" 
                  : "No results match your current filters. Try adjusting them."}
              </p>
              {results.length === 0 && (
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                >
                  Browse Quizzes
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((result) => (
                <div 
                  key={result._id} 
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    {/* Result Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getLevelColor(result.level)}`}>
                          <span className="font-bold">{result.level.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{result.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs ${getTechnologyColor(result.technology)}`}>
                              {getTechnologyName(result.technology)}
                            </span>
                            <span className="text-xs text-gray-500">{getLevelLabel(result.level)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-800">{result.score}%</div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getPerformanceColor(result.performance)}`}>
                          {result.performance}
                        </span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Correct</div>
                        <div className="text-xl font-bold text-green-600">{result.correct}</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-xl font-bold text-gray-800">{result.totalQuestions}</div>
                      </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(result.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => fetchResultDetails(result._id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        <button
                          onClick={() => deleteResult(result._id)}
                          className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                          title="Delete result"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Result Details Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{selectedResult.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {getTechnologyName(selectedResult.technology)}
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {getLevelLabel(selectedResult.level)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${getPerformanceColor(selectedResult.performance)}`}>
                      {selectedResult.performance}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  &times;
                </button>
              </div>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-sm opacity-90">Score</p>
                  <p className="text-2xl font-bold">{selectedResult.correct}/{selectedResult.totalQuestions}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-90">Percentage</p>
                  <p className="text-2xl font-bold">{selectedResult.score}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-90">Correct</p>
                  <p className="text-2xl font-bold">{selectedResult.correct}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm opacity-90">Wrong</p>
                  <p className="text-2xl font-bold">{selectedResult.wrong}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Answers Section */}
              {selectedResult.answers && selectedResult.answers.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Question Breakdown</h3>
                  <div className="space-y-4">
                    {selectedResult.answers.map((answer, index) => (
                      <div 
                        key={index} 
                        className={`p-4 rounded-lg border ${answer.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          {answer.isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">
                              Question {index + 1}: {answer.questionText}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Your Answer</p>
                                <p className={`font-medium ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                  {answer.userAnswer}
                                </p>
                              </div>
                              {!answer.isCorrect && (
                                <div>
                                  <p className="text-sm text-gray-600 mb-1">Correct Answer</p>
                                  <p className="font-medium text-green-700">{answer.correctAnswer}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No detailed answer data available for this quiz.</p>
                  <p className="text-sm text-gray-500 mt-2">Take more quizzes to see detailed answer tracking.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t p-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedResult(null)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigate(`/quiz/${selectedResult.technology}/${selectedResult.level}`);
                  setSelectedResult(null);
                }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;