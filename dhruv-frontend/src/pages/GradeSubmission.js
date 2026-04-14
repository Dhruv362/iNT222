import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function GradeSubmission() {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    totalScore: '',
    rubricScores: [],
    feedback: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call would go here
      alert('Grade submitted successfully!');
      navigate('/teacher');
    } catch (error) {
      alert('Error submitting grade');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Grade Submission</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Total Score</label>
            <input
              type="number"
              value={formData.totalScore}
              onChange={(e) => setFormData(prev => ({ ...prev, totalScore: e.target.value }))}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="0-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Feedback</label>
            <textarea
              value={formData.feedback}
              onChange={(e) => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-32"
              placeholder="Provide detailed feedback to the student"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Grade'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/teacher')}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GradeSubmission;
