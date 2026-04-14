import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getSubmissionFeedback } from '../services/api';

function ViewFeedback() {
  const { submissionId } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await getSubmissionFeedback(submissionId);
        setFeedback(response.data.feedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };

    if (submissionId) fetchFeedback();
  }, [submissionId]);

  if (loading) return <div className="container mx-auto p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Feedback</h1>

        {feedback ? (
          <div className="space-y-6">
            {/* General Feedback */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">General Feedback</h2>
              <p className="text-gray-700">{feedback.generalFeedback}</p>
            </div>

            {/* Strengths */}
            {feedback.strengths?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-green-700 mb-2">✅ Strengths</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {feedback.strengths.map((strength, idx) => (
                    <li key={idx} className="text-gray-700">{strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {feedback.areasForImprovement?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-yellow-700 mb-2">⚠️ Areas for Improvement</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {feedback.areasForImprovement.map((area, idx) => (
                    <li key={idx} className="text-gray-700">{area}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {feedback.suggestions?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-blue-700 mb-2">💡 Suggestions</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {feedback.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-gray-700">{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Resources */}
            {feedback.resources?.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-purple-700 mb-2">📚 Learning Resources</h2>
                <div className="space-y-2">
                  {feedback.resources.map((resource, idx) => (
                    <a 
                      key={idx}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-purple-50 rounded hover:bg-purple-100"
                    >
                      <p className="font-semibold text-purple-700">{resource.title}</p>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-600">No feedback available yet</p>
        )}
      </div>
    </div>
  );
}

export default ViewFeedback;
