# Getting Started - Full Stack Setup

## 📋 Quick Setup (5 minutes)

### Step 1: Backend Setup ✅ (Already Done)
Your backend is located at: `C:\Users\shiva\Desktop\dhruv`

```bash
# Backend is already set up and running on port 5000
npm run dev
```

### Step 2: Frontend Setup (New)
Your frontend is located at: `C:\Users\shiva\Desktop\dhruv-frontend`

```bash
# Install dependencies
cd C:\Users\shiva\Desktop\dhruv-frontend
npm install

# Start development server
npm start
```

The frontend will run on `http://localhost:3000`

---

## 🚀 Quick Start (Both Services)

### Terminal 1 - Backend
```powershell
cd C:\Users\shiva\Desktop\dhruv
npm run dev
```

Expected output:
```
Server running on port 5000
Environment: development
MongoDB connected successfully
```

### Terminal 2 - Frontend
```powershell
cd C:\Users\shiva\Desktop\dhruv-frontend
npm start
```

Expected output:
```
Compiled successfully!
You can now view the app in the browser.
Local: http://localhost:3000
```

---

## 🎯 Access the Application

1. **Open Browser**: Go to `http://localhost:3000`
2. **See Login Page**: You're ready!
3. **Demo Credentials**:
   - **Teacher**: jane.smith@university.edu / password123
   - **Student**: john.doe@student.edu / password123

---

## 📱 Features Available

### For Students:
- ✅ Login/Register
- ✅ View Dashboard
- ✅ See Assignments
- ✅ Submit Homework
- ✅ View Grades
- ✅ Read Feedback

### For Teachers:
- ✅ Login/Register
- ✅ View Dashboard
- ✅ Create Assignments
- ✅ Grade Submissions
- ✅ View Analytics

---

## 🛠️ Troubleshooting

### Frontend won't start?
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
npm start
```

### API Connection Error?
- Check backend is running: `http://localhost:5000/api/health`
- Check `.env` file has: `REACT_APP_API_URL=http://localhost:5000/api`
- Restart frontend: `npm start`

### Port 5000 or 3000 already in use?
```powershell
# Kill process on port 5000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Or use different port
set PORT=3001 && npm start
```

---

## 📚 Project Structure

```
C:\Users\shiva\Desktop\
├── dhruv/                  # Backend (Express + MongoDB)
│   ├── src/
│   ├── package.json
│   ├── .env
│   └── README.md
│
└── dhruv-frontend/         # Frontend (React)
    ├── src/
    ├── public/
    ├── package.json
    ├── .env
    └── README.md
```

---

## 🎓 Testing Workflow

### As a Student:
1. Go to `http://localhost:3000`
2. Login: john.doe@student.edu / password123
3. Click "Dashboard" → See your assignments
4. Click "Submit" on an assignment
5. Upload a file and click "Submit Assignment"
6. Go to "Grades" to see if you have any grades
7. Click "View Feedback" to see teacher's comments

### As a Teacher:
1. Go to `http://localhost:3000`
2. Login: jane.smith@university.edu / password123
3. Click "Dashboard" → See submissions
4. Click "Grade Submission" to grade work
5. Click "Analytics" to see class performance

---

## 📖 Next Steps

1. **Seed Database with Sample Data** (Optional):
   ```bash
   cd C:\Users\shiva\Desktop\dhruv
   node scripts/seed.js
   ```

2. **Create an Assignment**:
   - Login as teacher
   - Go to Dashboard
   - Click "+ Create Assignment"
   - Fill in details and save

3. **Submit Work** (as student):
   - Login as student
   - Click Submit button
   - Upload files or add content
   - Submit

4. **Grade Work** (as teacher):
   - See submissions in dashboard
   - Click "Grade" button
   - Enter score and feedback
   - Submit grade

5. **View Results** (as student):
   - Go to "Grades" section
   - See your score and feedback

---

## 💡 Tips

- Use Chrome/Firefox for best experience
- Keep both terminals running (Backend + Frontend)
- Check browser console (F12) for debugging
- Check terminal output for API errors
- Create demo assignments for testing

---

## 🆘 Getting Help

- **Backend Issues**: Check backend README.md
- **Frontend Issues**: Check frontend README.md
- **API Issues**: Check API_REFERENCE.md

All documentation files include detailed setup and troubleshooting info.

---

**Everything is ready! Happy coding! 🎉**
