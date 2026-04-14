import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllAssignments, getStudentSubmissions, getStudentGrades } from '../services/api';
import { MdAssignment, MdDone, MdAccessTime, MdGrade } from 'react-icons/md';

function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allAssignmentsRes, submissionsRes, gradesRes] = await Promise.all([
          getAllAssignments(),
          getStudentSubmissions(user.id),
          getStudentGrades(user.id)
        ]);

        // Handle different response formats
        let assignmentList = allAssignmentsRes.data;
        if (!Array.isArray(assignmentList)) {
          assignmentList = assignmentList?.assignments || [];
        }
        setAssignments(assignmentList);

        const submissionsList = submissionsRes.data.submissions || submissionsRes.data || [];
        const gradesList = gradesRes.data.grades || gradesRes.data || [];

        setSubmissions(submissionsList);
        setGrades(gradesList);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  const averageGrade = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length).toFixed(1)
    : 0;

  return (
    <div className="container mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Welcome, {user?.firstName}!</h1>
        <p className="text-gray-600 mt-2">Track your assignments and grades</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Submissions</p>
              <p className="text-3xl font-bold text-blue-600">{submissions.length}</p>
            </div>
            <MdAssignment size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Grades Received</p>
              <p className="text-3xl font-bold text-green-600">{grades.length}</p>
            </div>
            <MdDone size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Average Grade</p>
              <p className="text-3xl font-bold text-yellow-600">{averageGrade}%</p>
            </div>
            <MdGrade size={32} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-purple-600">
                {submissions.filter(s => s.status === 'submitted').length}
              </p>
            </div>
            <MdAccessTime size={32} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Assignments</h2>
        
        {assignments.length === 0 ? (
          <p className="text-gray-600">No assignments available</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{assignment.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{assignment.courseCode}</p>
                <p className="text-gray-600 text-sm mb-3">{assignment.description?.substring(0, 100)}...</p>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => navigate(`/submit/${assignment._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Submissions</h2>
        
        {submissions.length === 0 ? (
          <p className="text-gray-600">No submissions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-gray-700 font-bold">Assignment</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-bold">Course</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-bold">Status</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-bold">Submitted</th>
                  <th className="px-4 py-2 text-left text-gray-700 font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{sub.assignment?.title}</td>
                    <td className="px-4 py-3 text-gray-600">{sub.assignment?.courseCode}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        sub.status === 'graded' ? 'bg-green-100 text-green-800' :
                        sub.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {new Date(sub.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => navigate(`/assignment/${sub.assignment?._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grades */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Grades</h2>
        
        {grades.length === 0 ? (
          <p className="text-gray-600">No grades yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grades.map((grade) => (
              <div key={grade._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                <h3 className="font-bold text-lg text-gray-800">{grade.assignment?.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{grade.assignment?.courseCode}</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Score: <span className="font-bold text-lg">{grade.percentage}%</span></p>
                    <p className="text-gray-600 text-sm">Grade: <span className="font-bold text-lg text-yellow-600">{grade.letterGrade}</span></p>
                  </div>
                  {grade.feedback && (
                    <button 
                      onClick={() => navigate(`/feedback/${grade.feedback}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                    >
                      View Feedback
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
