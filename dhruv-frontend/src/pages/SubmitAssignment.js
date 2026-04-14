import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SubmitAssignment() {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    files: []
  });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      files: Array.from(e.target.files)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // API call would go here
      alert('Assignment submitted successfully!');
      navigate('/student');
    } catch (error) {
      alert('Error submitting assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Submit Assignment</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Assignment Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 h-32"
              placeholder="Enter your solution or comments"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Upload Files</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              accept=".pdf,.doc,.docx,.txt,.zip"
            />
            <p className="text-sm text-gray-600 mt-2">Accepted: PDF, Word, Text, ZIP (Max 5 files)</p>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Assignment'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/student')}
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

export default SubmitAssignment;
