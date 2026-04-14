import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getStudentGrades } from '../services/api';

function ViewGrades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await getStudentGrades(user.id);
        setGrades(response.data.grades || []);
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchGrades();
  }, [user?.id]);

  if (loading) return <div className="container mx-auto p-6">Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Grades</h1>

      {grades.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">No grades yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {grades.map((grade) => (
            <div key={grade._id} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800">{grade.assignment?.title}</h3>
              <p className="text-gray-600">{grade.assignment?.courseCode}</p>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Score:</span>
                  <span className="text-2xl font-bold text-blue-600">{grade.percentage}%</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-700">Grade:</span>
                  <span className="text-2xl font-bold text-yellow-600">{grade.letterGrade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewGrades;
