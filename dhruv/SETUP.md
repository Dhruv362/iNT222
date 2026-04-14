# Complete Setup Guide

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14 or higher) - [Download](https://nodejs.org/)
- MongoDB (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- A code editor (VS Code recommended)
- Git (optional, for version control)

## Installation Steps

### 1. Setup Project

```bash
# Navigate to project directory
cd homework-grading-system

# Install dependencies
npm install
```

### 2. Configure Environment Variables

The `.env` file is already included with the required configuration.

Edit `.env` file with your actual settings:
```bash
# Windows: notepad .env
# Mac/Linux: nano .env
```

**IMPORTANT:** Update the MongoDB password in the connection string:

```
# Replace <db_password> with your actual MongoDB password
MONGODB_URI=mongodb+srv://dk8870639_db_user:<YOUR_PASSWORD>@dhruv.ukqusoh.mongodb.net/?appName=dhruv
```

Other important settings:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=change-this-to-a-secure-secret-key
JWT_EXPIRE=7d
```

### 3. MongoDB Cloud Setup

Your application uses **MongoDB Atlas** (cloud database).

The connection string is already configured:
```
mongodb+srv://dk8870639_db_user:<YOUR_PASSWORD>@dhruv.ukqusoh.mongodb.net/?appName=dhruv
```

**Steps:**
1. Replace `<YOUR_PASSWORD>` with your MongoDB Atlas account password
2. Update the `.env` file with your password
3. Ensure your IP is whitelisted in MongoDB Atlas Security > Network Access
4. The database will connect automatically when the server starts

### 4. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
Server running on port 5000
Environment: development
MongoDB connected successfully
```

🎉 **Your server is now connected to MongoDB Atlas!**

## Verify Installation

### Health Check
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-04-09T10:30:00.000Z"
}
```

### Optional: Seed Sample Data

To populate your database with sample users and assignments:

```bash
node scripts/seed.js
```

This creates:
- **Teacher:** jane.smith@university.edu / password123
- **Student 1:** john.doe@student.edu / password123
- **Student 2:** alice.johnson@student.edu / password123
- **Sample Assignment:** Data Structures Implementation for CS101

## Testing the API

### 1. Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student",
    "department": "Computer Science",
    "studentId": "STU123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response.

### 3. Get User Profile

```bash
curl -X GET http://localhost:5000/api/users/YOUR_USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import the environment and collection (setup instructions coming)
3. Use the pre-configured requests for testing

## Database Connection Troubleshooting

**Connection Refused Error:**
```
Error: connect ECONNREFUSED
```
**Solution:** 
- Verify `.env` file contains correct MongoDB Atlas connection string
- Check that `<db_password>` is replaced with your actual password
- Ensure your IP address is whitelisted in MongoDB Atlas (Security > Network Access > Add IP Address)

**Wrong Connection String:**
- The connection format should be: `mongodb+srv://username:password@cluster.mongodb.net/?appName=dhruv`
- Do NOT include `<` and `>` brackets in the actual password

**"Authentication Failed" Error:**
- Verify you're using the correct MongoDB Atlas password (not your account password)
- Check that the username is correct: `dk8870639_db_user`
- Ensure no special characters are missing from the connection string

## Common Issues

### Issue: "Cannot find module 'express'"
**Solution:** Run `npm install`

### Issue: "MongoDB connection error"
**Solution:** 
1. Verify MongoDB is running
2. Check connection string in .env
3. Ensure MongoDB port 27017 is not blocked

### Issue: "JWT token is invalid"
**Solution:**
1. Ensure JWT_SECRET in .env is set
2. Use token from login response
3. Include "Bearer " prefix in Authorization header

### Issue: "CORS error"
**Solution:** CORS is already configured. If issues persist, check your client-side code.

## Production Deployment

### Using Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   ```
5. Deploy: `git push heroku main`

### Using AWS

1. Create EC2 instance
2. Install Node.js and MongoDB
3. Clone repository
4. Configure environment variables
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name "homework-api"
   ```

### Using DigitalOcean

1. Create Droplet (Ubuntu)
2. Install Node.js: `curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -`
3. Install MongoDB
4. Deploy application
5. Use Nginx as reverse proxy

## Performance Optimization

### Database Indexing
```javascript
// Already configured in models:
submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });
```

### Pagination Example
```bash
curl "http://localhost:5000/api/grades/assignment/ID?page=1&limit=10"
```

### Caching (Future Implementation)
```javascript
// Example using Redis
const redis = require('redis');
const client = redis.createClient();
```

## Monitoring

### Query Performance
Enable MongoDB profiling:
```javascript
db.setProfilingLevel(1);
db.system.profile.find().sort({ ts: -1 }).limit(5).pretty();
```

### Application Logs
Check console output for errors. For production, integrate logging service:
- Winston
- Morgan
- Bunyan

## Next Steps

1. **Read Full Documentation**: See `README.md` for complete API reference
2. **Setup Tests**: Run `npm test` to execute test suite
3. **Configure Email**: Set up nodemailer for notifications
4. **Add Frontend**: Create React/Vue frontend application
5. **Setup CI/CD**: Configure GitHub Actions for automated testing

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review README.md for API details
3. Check MongoDB documentation
4. Search Stack Overflow or GitHub Issues

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Handbook](https://auth0.com/resources/ebooks/jwt-handbook)
- [REST API Best Practices](https://www.moesif.com/blog/api-guide/references/api-best-practices/)
