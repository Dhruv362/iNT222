# API Reference

Complete documentation for all endpoints in the Homework Grading System API.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require Bearer token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

Get a token by logging in at `/auth/login`

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Access:** Public

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string (email format)",
  "password": "string (min 6 chars)",
  "role": "student|teacher|admin",
  "department": "string",
  "studentId": "string (optional, for students)"
}
```

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "department": "Computer Science"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securePassword123",
    "role": "student",
    "department": "Computer Science",
    "studentId": "STU001"
  }'
```

---

### Login User
Authenticate and get JWT token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "email": "string (email format)",
  "password": "string"
}
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "email": "john@example.com",
    "role": "student",
    "department": "Computer Science"
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

---

## User Endpoints

### Get User Profile
Retrieve user profile information.

**Endpoint:** `GET /users/:id`

**Access:** Authenticated

**URL Parameters:**
- `id` (string) - User ID

**Response (200 - OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "student",
    "department": "Computer Science",
    "studentId": "STU001",
    "bio": "Computer Science student",
    "isActive": true,
    "createdAt": "2024-04-09T10:00:00.000Z",
    "updatedAt": "2024-04-09T10:00:00.000Z"
  }
}
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>"
```

---

### Get All Users
List all users (admin/teacher only).

**Endpoint:** `GET /users`

**Access:** Authenticated (admin/teacher only)

**Query Parameters:**
- `role` (string, optional) - Filter by role: "student", "teacher", "admin"
- `department` (string, optional) - Filter by department

**Response (200 - OK):**
```json
{
  "success": true,
  "count": 5,
  "users": [ /* user objects */ ]
}
```

**Example:**
```bash
curl -X GET "http://localhost:5000/api/users?role=student&department=Computer%20Science" \
  -H "Authorization: Bearer <token>"
```

---

### Update User Profile
Update user information.

**Endpoint:** `PATCH /users/:id`

**Access:** Authenticated (users can only update their own profile)

**Request Body (all fields optional):**
```json
{
  "firstName": "string",
  "lastName": "string",
  "bio": "string",
  "profilePicture": "string (URL or base64)"
}
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": { /* updated user object */ }
}
```

**Example:**
```bash
curl -X PATCH http://localhost:5000/api/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "bio": "Computer Science student, interested in AI"
  }'
```

---

## Assignment Endpoints

### Create Assignment
Create a new assignment (teacher only).

**Endpoint:** `POST /assignments`

**Access:** Authenticated (teacher/admin only)

**Request Body:**
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "courseCode": "string (required)",
  "courseName": "string",
  "dueDate": "string (ISO date)",
  "allowedFileType": ["string"],
  "maxScore": "number (default: 100)",
  "rubric": {
    "criteria": [
      {
        "name": "string",
        "maxPoints": "number",
        "description": "string"
      }
    ]
  },
  "instructions": "string",
  "isAutoGraded": "boolean",
  "autoGradingRules": "object"
}
```

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "assignment": {
    "id": "507f1f77bcf86cd799439012",
    "title": "Data Structures Implementation",
    "dueDate": "2024-05-15T23:59:59.000Z",
    "courseCode": "CS101"
  }
}
```

**Example:**
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
    "isAutoGraded": false,
    "rubric": {
      "criteria": [
        {"name": "Code Quality", "maxPoints": 25},
        {"name": "Functionality", "maxPoints": 40}
      ]
    }
  }'
```

---

### Get Assignment Details
Retrieve specific assignment information.

**Endpoint:** `GET /assignments/:id`

**Access:** Authenticated

**URL Parameters:**
- `id` (string) - Assignment ID

**Response (200 - OK):**
```json
{
  "success": true,
  "assignment": { /* assignment object with teacher details */ }
}
```

---

### Get Course Assignments
Get all assignments for a specific course.

**Endpoint:** `GET /assignments/course/:courseCode`

**Access:** Authenticated

**URL Parameters:**
- `courseCode` (string) - Course code

**Response (200 - OK):**
```json
{
  "success": true,
  "count": 5,
  "assignments": [ /* assignment objects */ ]
}
```

---

### Update Assignment
Update assignment details (teacher only).

**Endpoint:** `PATCH /assignments/:id`

**Access:** Authenticated (teacher/admin only)

**Request Body:** Any assignment fields to update

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Assignment updated successfully",
  "assignment": { /* updated assignment */ }
}
```

---

### Delete Assignment
Delete an assignment (teacher only).

**Endpoint:** `DELETE /assignments/:id`

**Access:** Authenticated (teacher/admin only)

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Assignment deleted successfully"
}
```

---

## Submission Endpoints

### Submit Homework
Upload homework files and text content.

**Endpoint:** `POST /submissions`

**Access:** Authenticated (students)

**Request Body (multipart/form-data):**
- `assignmentId` (string, required) - Assignment ID
- `content` (string, optional) - Text content
- `files` (file, multiple, optional) - Files to upload (max 5, max 10MB total)

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Submission successful",
  "submission": {
    "id": "507f1f77bcf86cd799439013",
    "assignmentId": "507f1f77bcf86cd799439012",
    "submittedDate": "2024-04-09T15:30:00.000Z",
    "status": "submitted",
    "isLate": false
  }
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Authorization: Bearer <token>" \
  -F "assignmentId=507f1f77bcf86cd799439012" \
  -F "content=My submission text" \
  -F "files=@homework.pdf"
```

---

### Get Submission Details
Retrieve submission with files and feedback.

**Endpoint:** `GET /submissions/:id`

**Access:** Authenticated

**Response (200 - OK):**
```json
{
  "success": true,
  "submission": { /* submission with populated references */ }
}
```

---

### Get Assignment Submissions
Get all submissions for an assignment (teacher only).

**Endpoint:** `GET /submissions/assignment/:assignmentId`

**Access:** Authenticated (teacher/admin only)

**Response (200 - OK):**
```json
{
  "success": true,
  "count": 5,
  "submissions": [ /* all submissions for assignment */ ]
}
```

---

## Grade Endpoints

### Create/Update Grade
Record a grade for a submission.

**Endpoint:** `POST /grades`

**Access:** Authenticated (teacher/admin only)

**Request Body:**
```json
{
  "submissionId": "string (required)",
  "assignmentId": "string (required)",
  "totalScore": "number",
  "rubricScores": [
    {
      "criteria": "string",
      "score": "number",
      "maxScore": "number"
    }
  ],
  "isAutoGraded": "boolean"
}
```

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Grade recorded successfully",
  "grade": {
    "id": "507f1f77bcf86cd799439014",
    "totalScore": 85,
    "percentage": 85,
    "letterGrade": "B"
  }
}
```

---

### Auto-Grade Submissions
Automatically grade all submissions for an assignment.

**Endpoint:** `POST /grades/auto/:assignmentId`

**Access:** Authenticated (teacher/admin only)

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Auto-graded 5 submissions",
  "gradesCount": 5,
  "grades": [ /* grade objects */ ]
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/grades/auto/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer <token>"
```

---

### Get Assignment Grades
Get all grades for an assignment with statistics.

**Endpoint:** `GET /grades/assignment/:assignmentId`

**Access:** Authenticated (teacher/admin only)

**Response (200 - OK):**
```json
{
  "success": true,
  "count": 5,
  "statistics": {
    "count": 5,
    "average": 82.4,
    "median": 85,
    "min": 65,
    "max": 95,
    "standardDeviation": 9.85
  },
  "grades": [ /* grade objects */ ]
}
```

---

## Feedback Endpoints

### Create Feedback
Generate feedback for a submission.

**Endpoint:** `POST /feedback`

**Access:** Authenticated (teacher/admin only)

**Request Body:**
```json
{
  "submissionId": "string (required)",
  "assignmentId": "string (required)",
  "isAutoGenerated": "boolean",
  "generalFeedback": "string",
  "detailedFeedback": [
    {
      "section": "string",
      "comment": "string",
      "severity": "info|warning|critical"
    }
  ],
  "strengths": ["string"],
  "areasForImprovement": ["string"],
  "suggestions": ["string"]
}
```

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Feedback created successfully",
  "feedback": {
    "id": "507f1f77bcf86cd799439015",
    "submission": "507f1f77bcf86cd799439013",
    "strengths": ["Good structure", "Clear logic"],
    "areasForImprovement": ["More comments needed"]
  }
}
```

---

### Auto-Generate Feedback
Generate feedback for all submissions.

**Endpoint:** `POST /feedback/auto/:assignmentId`

**Access:** Authenticated (teacher/admin only)

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Generated feedback for 5 submissions",
  "feedbackCount": 5
}
```

---

### Get Feedback
Retrieve feedback for a submission.

**Endpoint:** `GET /feedback/:id` or `/feedback/submission/:submissionId`

**Access:** Authenticated

**Response (200 - OK):**
```json
{
  "success": true,
  "feedback": { /* feedback object */ }
}
```

---

## Analytics Endpoints

### Calculate Assignment Analytics
Generate analytics for an assignment.

**Endpoint:** `POST /analytics/assignment/:assignmentId`

**Access:** Authenticated (teacher/admin only)

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Analytics calculated successfully",
  "analytics": {
    "totalSubmissions": 25,
    "averageScore": 82.4,
    "medianScore": 85,
    "scoreDistribution": {
      "A": 8,
      "B": 12,
      "C": 4,
      "D": 1,
      "F": 0
    },
    "strugglingStudents": [ /* top 3 low performers */ ],
    "topPerformers": [ /* top 3 high performers */ ]
  }
}
```

---

### Get Assignment Analytics
Retrieve calculated analytics for an assignment.

**Endpoint:** `GET /analytics/assignment/:assignmentId`

**Access:** Authenticated

**Response (200 - OK):**
```json
{
  "success": true,
  "analytics": { /* analytics object */ }
}
```

---

### Get Student Progress
Get analytics for a student's performance.

**Endpoint:** `GET /analytics/student/:studentId`

**Access:** Authenticated (students can only view their own)

**Response (200 - OK):**
```json
{
  "success": true,
  "analytics": {
    "studentId": "507f1f77bcf86cd799439011",
    "totalAssignments": 10,
    "averageScore": 85.6,
    "improvementRate": 15,
    "trendline": [
      { "assignmentName": "Assignment 1", "score": 78 },
      { "assignmentName": "Assignment 2", "score": 82 }
    ]
  }
}
```

---

### Get Dashboard Analytics
Get teacher dashboard with all analytics.

**Endpoint:** `GET /analytics/dashboard`

**Access:** Authenticated (teacher/admin only)

**Response (200 - OK):**
```json
{
  "success": true,
  "summary": {
    "totalAssignments": 8,
    "totalSubmissions": 150,
    "averageClassScore": 81.3,
    "topPerformers": [ /* top students across all assignments */ ],
    "strugglingStudents": [ /* struggling students */ ]
  },
  "recentAssignments": [ /* last 10 assignments with analytics */ ]
}
```

---

## Error Responses

All endpoints return standardized error responses:

**400 - Bad Request:**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

**401 - Unauthorized:**
```json
{
  "success": false,
  "message": "No token, authorization denied"
}
```

**403 - Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Insufficient permissions."
}
```

**404 - Not Found:**
```json
{
  "success": false,
  "message": "Assignment not found"
}
```

**500 - Server Error:**
```json
{
  "success": false,
  "message": "Error creating assignment"
}
```

---

## Rate Limiting

Currently not implemented. Production deployment should include:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Pagination (Future)

Planned for implementation:
```
GET /submissions?page=1&limit=10&sort=submittedDate
```
