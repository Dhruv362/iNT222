# Homework Grading System - Frontend

A modern React-based frontend application for the Homework Submission and Grading System.

## Features

- 🔐 **User Authentication**: Login and registration for students and teachers
- 📚 **Student Dashboard**: View assignments, submissions, and grades
- 👨‍🏫 **Teacher Dashboard**: Manage assignments and grade submissions
- 📊 **Analytics**: Performance metrics and student insights
- 💬 **Feedback System**: View detailed feedback on submissions
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **React 18** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icons
- **Ant Design** - UI components (optional)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd dhruv-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Edit .env file
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```

The application will run on `http://localhost:3000`

## Project Structure

```
src/
├── components/              # Reusable components
│   └── Navigation.js       # Navigation bar
├── context/                # Context API
│   └── AuthContext.js      # Authentication context
├── pages/                  # Page components
│   ├── Login.js            # Login page
│   ├── Register.js         # Registration page
│   ├── StudentDashboard.js # Student dashboard
│   ├── TeacherDashboard.js # Teacher dashboard
│   ├── ViewGrades.js       # View grades page
│   ├── ViewFeedback.js     # View feedback page
│   ├── Analytics.js        # Analytics dashboard
│   ├── SubmitAssignment.js # Submit assignment
│   ├── GradeSubmission.js  # Grade submission
│   └── AssignmentDetail.js # Assignment details
├── services/               # API services
│   └── api.js             # API calls
├── App.js                 # Main App component
├── index.js               # Entry point
└── index.css              # Global styles
```

## Usage

### Student Workflow

1. **Register/Login** as a student
2. **View Dashboard** - See all available assignments
3. **Submit Assignment** - Upload files or add content
4. **Check Grades** - View graded assignments
5. **Read Feedback** - Get detailed feedback from teacher

### Teacher Workflow

1. **Register/Login** as a teacher
2. **View Dashboard** - See all assignments and submissions
3. **Grade Submissions** - Review and grade student work
4. **Generate Feedback** - Auto-generate or add custom feedback
5. **View Analytics** - See class performance and metrics

## API Integration

The frontend communicates with the backend API via the `src/services/api.js` service. All API calls include:

- Automatic JWT token inclusion in headers
- Error handling
- Request/response interceptors

Example API call:
```javascript
import { loginUser } from '../services/api';

const response = await loginUser(email, password);
```

## Authentication

- User credentials are stored in `localStorage`
- JWT tokens are automatically attached to all requests
- Authentication context manages global auth state
- Protected routes redirect unauthorized users to login

## Demo Credentials

Login with these demo accounts:

**Teacher:**
- Email: jane.smith@university.edu
- Password: password123

**Student:**
- Email: john.doe@student.edu
- Password: password123

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
1. Connect your GitHub repository
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `build`
3. Deploy

### Deploy to Other Platforms
- AWS Amplify
- Heroku
- Firebase Hosting
- Azure Static Web Apps

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Troubleshooting

### API Connection Error
- Ensure backend is running on port 5000
- Check `REACT_APP_API_URL` in `.env`
- Clear browser cache and restart

### Login Error
- Verify credentials in database
- Check if user account exists
- Ensure backend is accessible

### Port Already in Use
```bash
# Linux/Mac: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Windows: Use a different port
set PORT=3001 && npm start
```

## Future Enhancements

- [ ] Dark mode support
- [ ] Real-time notifications
- [ ] File preview in submissions
- [ ] Advanced filtering and search
- [ ] Export grades to CSV
- [ ] Calendar view for assignments
- [ ] Email integration
- [ ] Mobile app (React Native)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Support

For questions or issues, please contact the development team.
