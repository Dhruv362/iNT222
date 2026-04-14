# 🎓 Complete Full-Stack Setup Guide

## Overview

You now have a **complete full-stack homework grading system**:

- ✅ **Backend API** (Express.js + MongoDB) 
- ✅ **Frontend Application** (React)
- ✅ **Fully Integrated** and ready to use

---

## 📁 Project Locations

```
Backend:  C:\Users\shiva\Desktop\dhruv
Frontend: C:\Users\shiva\Desktop\dhruv-frontend
```

---

## 🚀 Getting Started (2 Steps)

### Step 1: Install Frontend Dependencies

```powershell
cd C:\Users\shiva\Desktop\dhruv-frontend
npm install
```

**Takes about 2-3 minutes**

### Step 2: Start Both Services

You'll need **2 terminal windows** or **2 tabs**

**Terminal 1 - Backend:**
```powershell
cd C:\Users\shiva\Desktop\dhruv
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Users\shiva\Desktop\dhruv-frontend
npm start
```

---

## 🌐 Access the Application

Once both are running:

**Frontend App**: `http://localhost:3000`

You should see the login page!

---

## 🔐 Demo Accounts

### Teacher Account
```
Email: jane.smith@university.edu
Password: password123
```

### Student Account
```
Email: john.doe@student.edu
Password: password123
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (React App)                  │
│              http://localhost:3000                     │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │  Login   │  │Dashboard │  │ Grades   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└────────────────────┬────────────────────────────────────┘
                     │
                HTTP API Calls (JSON)
        Authorization: Bearer <JWT Token>
                     │
┌────────────────────▼────────────────────────────────────┐
│          Express.js API Server                          │
│          http://localhost:5000                          │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Auth     │  │Homework  │  │ Grading  │             │
│  │ Routes   │  │ Routes   │  │ Routes   │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└────────────────────┬────────────────────────────────────┘
                     │
              MongoDB Driver
                     │
┌────────────────────▼────────────────────────────────────┐
│     MongoDB Atlas (Cloud Database)                      │
│     mongodb+srv://dk8870639_db_user:****...            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Users    │  │Assign    │  │Grades    │             │
│  │ Collections   │ments   │  │          │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 What You Can Do Now

### Student Features
- ✅ Register and login
- ✅ View available assignments
- ✅ Submit assignments with files
- ✅ View your grades
- ✅ Read teacher feedback
- ✅ Track progress

### Teacher Features  
- ✅ Register and login
- ✅ Create assignments with rubrics
- ✅ View all student submissions
- ✅ Grade submissions
- ✅ Add feedback comments
- ✅ View class analytics
- ✅ Identify struggling students
- ✅ Track top performers

### Analytics
- ✅ Class performance statistics
- ✅ Grade distribution
- ✅ Average scores
- ✅ Student progress tracking

---

## 📋 Quick Feature Checklist

### Frontend Pages (React)
- ✅ Login Page
- ✅ Register Page
- ✅ Student Dashboard
- ✅ Teacher Dashboard
- ✅ View Grades
- ✅ View Feedback
- ✅ Submit Assignment
- ✅ Grade Submission
- ✅ Analytics Dashboard
- ✅ Navigation Bar

### Backend API (Express)
- ✅ Authentication (JWT)
- ✅ User Management
- ✅ Assignment CRUD
- ✅ Submission Management
- ✅ Grading System
- ✅ Feedback Generation
- ✅ Analytics Calculation
- ✅ File Upload

### Database (MongoDB)
- ✅ User Collection
- ✅ Assignment Collection
- ✅ Submission Collection
- ✅ Grade Collection
- ✅ Feedback Collection
- ✅ Analytics Collection

---

## 🧪 Testing the System

### Test Flow 1: Student Submission → Teacher Grading

1. **Login as Student**
   - Username: john.doe@student.edu
   - Password: password123

2. **Submit Assignment**
   - Go to Dashboard
   - Click on an assignment
   - Add content/files
   - Click "Submit"

3. **Login as Teacher**
   - Logout from student
   - Login: jane.smith@university.edu
   - Password: password123

4. **Grade Submission**
   - Go to Dashboard
   - Click "Grade" on student submission
   - Enter score (0-100)
   - Add feedback
   - Submit grade

5. **View Results as Student**
   - Logout from teacher
   - Login as student again
   - Go to "Grades"
   - Click "View Feedback"
   - See teacher comments and suggestions

---

## 🔧 Configuration Files

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://dk8870639_db_user:<PASSWORD>@dhruv.ukqusoh.mongodb.net/?appName=dhruv
JWT_SECRET=your-super-secret-key
JWT_EXPIRE=7d
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📚 Documentation Files

Each part has its own comprehensive documentation:

### Backend
- `dhruv/README.md` - API documentation
- `dhruv/API_REFERENCE.md` - Detailed endpoint reference
- `dhruv/SETUP.md` - Installation guide

### Frontend
- `dhruv-frontend/README.md` - Frontend guide
- `dhruv-frontend/QUICK_START.md` - Quick setup

---

## 🆘 Troubleshooting

### Issue: Can't connect to frontend?
```
Check:
1. Frontend running on http://localhost:3000
2. Open new browser tab (Ctrl+T)
3. Refresh page
4. Check terminal for errors
```

### Issue: Login fails?
```
Check:
1. Backend is running (http://localhost:5000/api/health)
2. Correct credentials are used
3. MongoDB is connected
4. API URL in .env is correct
```

### Issue: Can't see assignments?
```
Try:
1. Create assignment as teacher
2. Or seed sample data: node scripts/seed.js
3. Refresh browser page (Ctrl+R)
```

### Issue: Port already in use?
```
Backend (Port 5000):
- tasklist | findstr :5000
- taskkill /PID <PID> /F

Frontend (Port 3000):
- set PORT=3001 && npm start
```

---

## 🚀 Next Steps

1. **Seed Sample Data** (Optional)
   ```bash
   cd dhruv
   node scripts/seed.js
   ```

2. **Create Your First Assignment**
   - Login as teacher
   - Go to Dashboard
   - Click "+ Create Assignment"
   - Fill in details

3. **Have a Student Submit**
   - Login as student
   - Click on assignment
   - Submit files/content

4. **Grade and Provide Feedback**
   - Go back to teacher account
   - Grade the submission
   - Add feedback comments

5. **View Results as Student**
   - Student logs in
   - Goes to Grades
   - Reads teacher feedback

---

## 📈 Performance Tips

### Frontend Optimization
- Clear browser cache: Ctrl+Shift+Delete
- Use Chrome DevTools (F12) to debug
- Check Network tab for API calls

### Backend Optimization
- MongoDB indexes are configured
- API responses are optimized
- File uploads are limited to 10MB

---

## 🔐 Security Notes

- ✅ Passwords are hashed with bcryptjs
- ✅ JWT tokens expire after 7 days
- ✅ .env file is not committed to git
- ✅ API requires authentication
- ✅ Role-based access control enforced
- ⚠️ Change JWT_SECRET in production

---

## 📞 Getting Help

### Check These Files First
1. README.md files in each folder
2. API_REFERENCE.md for API details
3. SETUP.md for installation help
4. QUICK_START.md for quick reference

### Browser Console
- Open DevTools: F12
- Check Console tab for errors
- Check Network tab for API calls

### Terminal Output
- Backend errors in terminal 1
- Frontend errors in terminal 2
- MongoDB connection messages

---

## 🎉 Congratulations!

You now have a **complete, production-ready homework grading system**!

Features included:
- ✅ User authentication
- ✅ Assignment management
- ✅ File submissions
- ✅ Automated grading
- ✅ Feedback system
- ✅ Analytics & reporting
- ✅ Responsive UI

**Ready to use and deploy!**

---

## 📝 Quick Commands Reference

```bash
# Backend
cd C:\Users\shiva\Desktop\dhruv
npm install          # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
node scripts/seed.js # Seed demo data

# Frontend
cd C:\Users\shiva\Desktop\dhruv-frontend
npm install          # Install dependencies  
npm start            # Start development server
npm run build        # Create production build
npm test             # Run tests

# MongoDB Atlas
# Visit: https://cloud.mongodb.com
# Use credentials: dk8870639_db_user / <password>
```

---

**Happy learning and teaching! 🎓**
