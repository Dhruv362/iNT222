import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTeacherAssignments } from '../services/api';
import { MdCheckCircle, MdPendingActions, MdGrade, MdEdit, MdDelete } from 'react-icons/md';

function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        if (user?.id) {
          const response = await getTeacherAssignments(user.id);
          // Handle both array and nested object responses
          const data = response.data;
          const assignmentList = Array.isArray(data) ? data : (data?.assignments || []);
          setAssignments(assignmentList);
        }
      } catch (error) {
        console.error('Error fetching assignments:', error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user?.id]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Teacher Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage assignments and grade submissions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Assignments</p>
              <p className="text-3xl font-bold text-blue-600">{assignments.length}</p>
            </div>
            <MdGrade size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Submissions Graded</p>
              <p className="text-3xl font-bold text-green-600">0</p>
            </div>
            <MdCheckCircle size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Review</p>
              <p className="text-3xl font-bold text-yellow-600">0</p>
            </div>
            <MdPendingActions size={32} className="text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
          <button
            onClick={() => navigate('/teacher/create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            + Create Assignment
          </button>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No assignments yet</p>
            <p className="text-gray-500">Create your first assignment to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Title</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Course</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Due Date</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Max Score</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => (
                  <tr key={assignment._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{assignment.title}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-600">{assignment.courseCode}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-600">
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-600">{assignment.maxScore}</td>
                    <td className="border border-gray-300 px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/assignment/${assignment._id}`)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherDashboard;
