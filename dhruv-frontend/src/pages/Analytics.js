import React, { useEffect, useState } from 'react';
import { getDashboardAnalytics } from '../services/api';
import { MdBarChart, MdTrendingUp, MdPeople } from 'react-icons/md';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getDashboardAnalytics();
        setAnalytics(response.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="container mx-auto p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Analytics Dashboard</h1>

      {analytics ? (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Assignments</p>
                  <p className="text-3xl font-bold text-blue-600">{analytics.summary?.totalAssignments || 0}</p>
                </div>
                <MdBarChart size={32} className="text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Submissions</p>
                  <p className="text-3xl font-bold text-green-600">{analytics.summary?.totalSubmissions || 0}</p>
                </div>
                <MdPeople size={32} className="text-green-600" />
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Average Class Score</p>
                  <p className="text-3xl font-bold text-yellow-600">{analytics.summary?.averageClassScore || 0}%</p>
                </div>
                <MdTrendingUp size={32} className="text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Top Performers */}
          {analytics.summary?.topPerformers?.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Top Performers</h2>
              <div className="space-y-2">
                {analytics.summary.topPerformers.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border-b">
                    <span className="text-gray-700">{student.name}</span>
                    <span className="text-lg font-bold text-green-600">{student.scorePercentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Struggling Students */}
          {analytics.summary?.strugglingSudents?.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⚠️ Students Needing Support</h2>
              <div className="space-y-2">
                {analytics.summary.strugglingSudents.map((student, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border-b">
                    <span className="text-gray-700">{student.name}</span>
                    <span className="text-lg font-bold text-red-600">{student.scorePercentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No analytics data available</p>
        </div>
      )}
    </div>
  );
}

export default Analytics;
