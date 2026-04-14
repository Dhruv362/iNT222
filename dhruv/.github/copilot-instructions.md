# Homework Grading System - Project Setup

This is a comprehensive Node.js/Express backend API for managing homework submissions, automated grading, feedback generation, and analytics.

## Quick Start

1. Install dependencies: `npm install`
2. Configure environment: Copy `.env.example` to `.env` and update values
3. Start MongoDB instance
4. Run server: `npm run dev` (development) or `npm start` (production)
5. Server runs on `http://localhost:5000`

## Project Structure

```
src/
├── index.js                 # Main server entry point
├── middleware/              # Express middleware
│   ├── auth.js             # JWT authentication & role-based access
│   └── upload.js           # File upload configuration
├── models/                  # MongoDB schemas
│   ├── User.js             # User model (students, teachers, admins)
│   ├── Assignment.js       # Assignment model
│   ├── Submission.js       # Submission model
│   ├── Grade.js            # Grade model
│   ├── Feedback.js         # Feedback model
│   └── Analytics.js        # Analytics model
├── routes/                  # API endpoints
│   ├── auth.js             # Authentication routes
│   ├── users.js            # User management
│   ├── assignments.js      # Assignment CRUD
│   ├── submissions.js      # Submission management
│   ├── grades.js           # Grading endpoints
│   ├── feedback.js         # Feedback generation
│   └── analytics.js        # Analytics dashboards
└── services/               # Business logic
    ├── GradingService.js   # Automated grading logic
    ├── FeedbackService.js  # Feedback generation
    └── AnalyticsService.js # Analytics calculations
```

## Key Features

- **File Upload**: Multer-based secure file uploads with size/type restrictions
- **JWT Authentication**: Token-based auth with role-based access control
- **Automated Grading**: Configurable rubric-based auto-grading
- **Feedback Generation**: AI-ready feedback system with learning resources
- **Analytics**: Comprehensive performance metrics and dashboards
- **Late Detection**: Automatic late submission detection

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- jsonwebtoken: JWT authentication
- bcryptjs: Password hashing
- multer: File upload handling
- cors: Cross-origin requests
- dotenv: Environment variables

## API Documentation

See [README.md](./README.md) for complete API documentation with examples.

## Testing

The API can be tested with:
- cURL commands (see README.md examples)
- Postman collection (TODO: create)
- Jest test suite (run with `npm test`)

## Development Notes

- All endpoints require authentication (except /api/auth/register and /api/auth/login)
- Teachers have read/write access to assignments and grades
- Students can only view their own submissions and grades
- Use environment variables for all configuration
- MongoDB models include timestamps for audit trails

## Next Steps for Enhancement

1. Integrate plagiarism detection API
2. Add email notifications
3. Implement file preview functionality
4. Add request logging and monitoring
5. Create Postman API collection
6. Add GraphQL endpoint
7. Implement WebSocket for real-time updates
8. Add rate limiting
