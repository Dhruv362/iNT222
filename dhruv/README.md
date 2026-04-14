# Homework Submission and Grading System API

A comprehensive backend API for managing homework submissions, automated grading, student feedback generation, and performance analytics in educational institutions.

## Features

✅ **Student Submission Management**
- File upload support (PDF, Word, Text, ZIP)
- Multiple file submission per assignment
- Late submission detection
- Revision tracking

✅ **Automated Grading**
- Configurable rubric-based grading
- Automatic score calculation
- Support for multiple grading criteria
- Gradual performance tracking

✅ **Feedback Generation**
- Automated feedback generation based on scores
- Teacher manual feedback
- Detailed feedback with suggestions
- Learning resource recommendations

✅ **Grade Analytics**
- Assignment-level statistics
- Course-level analytics
- Student progress tracking
- Performance distribution analysis
- Identification of struggling and top-performing students

✅ **User Management**
- Role-based access control (Student, Teacher, Admin)
- User authentication and authorization
- Profile management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Multer
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env with your configuration**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/homework-grading
   JWT_SECRET=your-secure-secret-key
   ```

5. **Start MongoDB**
   ```bash
   # Using MongoDB Community Edition
   mongod
   ```

6. **Run the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The server should now be running on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users` - Get all users (admin/teacher only)
- `PATCH /api/users/:id` - Update user profile
- `POST /api/users/deactivate/:id` - Deactivate user (admin only)

### Assignments
- `POST /api/assignments` - Create assignment (teacher only)
- `GET /api/assignments/:id` - Get assignment details
- `GET /api/assignments/course/:courseCode` - Get assignments by course
- `GET /api/assignments/teacher/:teacherId` - Get teacher's assignments
- `PATCH /api/assignments/:id` - Update assignment (teacher only)
- `DELETE /api/assignments/:id` - Delete assignment (teacher only)

### Submissions
- `POST /api/submissions` - Submit homework (with file upload)
- `GET /api/submissions/:id` - Get submission details
- `GET /api/submissions/assignment/:assignmentId` - Get all submissions for assignment (teacher only)
- `GET /api/submissions/student/:studentId` - Get student's submissions
- `PATCH /api/submissions/:id` - Update submission status (teacher only)

### Grades
- `POST /api/grades` - Create or update grade
- `POST /api/grades/auto/:assignmentId` - Auto-grade all submissions (teacher only)
- `GET /api/grades/submission/:submissionId` - Get grade for submission
- `GET /api/grades/assignment/:assignmentId` - Get all grades for assignment (teacher only)
- `GET /api/grades/student/:studentId` - Get student's grades
- `PATCH /api/grades/:id` - Update grade (teacher only)

### Feedback
- `POST /api/feedback` - Create feedback
- `POST /api/feedback/auto/:assignmentId` - Auto-generate feedback (teacher only)
- `GET /api/feedback/:id` - Get feedback
- `GET /api/feedback/submission/:submissionId` - Get feedback for submission
- `PATCH /api/feedback/:id` - Update feedback (teacher only)

### Analytics
- `POST /api/analytics/assignment/:assignmentId` - Calculate assignment analytics (teacher only)
- `GET /api/analytics/assignment/:assignmentId` - Get assignment analytics
- `GET /api/analytics/course/:courseCode` - Get course analytics (teacher only)
- `GET /api/analytics/student/:studentId` - Get student progress
- `GET /api/analytics/dashboard` - Get teacher dashboard (teacher only)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Usage Examples

### 1. Register a Teacher
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "teacher",
    "department": "Computer Science"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### 3. Create Assignment
```bash
curl -X POST http://localhost:5000/api/assignments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Assignment 1: Data Structures",
    "description": "Implement basic data structures",
    "courseCode": "CS101",
    "courseName": "Introduction to CS",
    "dueDate": "2024-05-15T23:59:59Z",
    "maxScore": 100,
    "isAutoGraded": false
  }'
```

### 4. Submit Homework
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Authorization: Bearer <token>" \
  -F "assignmentId=<assignment-id>" \
  -F "content=My submission text" \
  -F "files=@homework.pdf"
```

### 5. Auto-grade Submissions
```bash
curl -X POST http://localhost:5000/api/grades/auto/<assignment-id> \
  -H "Authorization: Bearer <token>"
```

### 6. Generate Feedback
```bash
curl -X POST http://localhost:5000/api/feedback/auto/<assignment-id> \
  -H "Authorization: Bearer <token>"
```

### 7. Get Analytics
```bash
curl -X GET "http://localhost:5000/api/analytics/dashboard" \
  -H "Authorization: Bearer <token>"
```

## Database Schema

### User
- Id, firstName, lastName, email, password, role, department, studentId, profilePicture, bio, isActive, timestamps

### Assignment
- Id, title, description, courseCode, courseName, teacher, dueDate, allowedFileType, maxScore, rubric, instructions, isAutoGraded, autoGradingRules, totalSubmissions, gradeDistribution, timestamps

### Submission
- Id, assignment, student, submittedDate, files, content, status, isLate, lateDays, plagiarismScore, timeGradedDate, grade, feedback, teacherNotes, studentNotes, timestamps

### Grade
- Id, submission, assignment, student, teacher, totalScore, percentage, letterGrade, rubricScores, isAutoGraded, gradingMethod, gradeChangedDate, gradeChangeReason, timestamps

### Feedback
- Id, submission, student, assignment, generalFeedback, detailedFeedback, strengths, areasForImprovement, suggestions, resources, isAutoGenerated, generatedBy, teacher, studentViewed, timestamps

### Analytics
- Id, assignment, course, teacher, totalSubmissions, submissionRate, lateSubmissions, averageScore, medianScore, standardDeviation, scoreDistribution, classAverageGrade, strugglingStudents, topPerformers, plagiarismStatistics, timestamps

## Error Handling

All endpoints return standardized JSON responses:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` file to version control
2. **Password Hashing**: Passwords are hashed using bcryptjs
3. **JWT Authentication**: Tokens expire after 7 days by default
4. **CORS**: Configured to accept requests from allowed origins
5. **File Upload**: Restricted file types and file size limits

## Development

### Run in Development Mode
```bash
npm run dev
```

This starts the server with nodemon for automatic restart on file changes.

### Run Tests
```bash
npm test
```

## Future Enhancements

- [ ] Plagiarism detection integration
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] GraphQL API support
- [ ] WebSocket real-time notifications
- [ ] File preview functionality
- [ ] Batch operations
- [ ] API rate limiting

## License

MIT

## Support

For issues, questions, or suggestions, please create an issue in the repository.
