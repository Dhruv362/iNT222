const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const User = require('./src/models/User');
const Assignment = require('./src/models/Assignment');
require('dotenv').config();

/**
 * Seed database with sample data
 * Run: node scripts/seed.js
 */
async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/homework-grading');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Assignment.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const hashedPassword = await bcryptjs.hash('password123', 10);

    const teacher = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@university.edu',
      password: hashedPassword,
      role: 'teacher',
      department: 'Computer Science'
    });

    const student1 = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@student.edu',
      password: hashedPassword,
      role: 'student',
      department: 'Computer Science',
      studentId: 'STU001'
    });

    const student2 = await User.create({
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@student.edu',
      password: hashedPassword,
      role: 'student',
      department: 'Computer Science',
      studentId: 'STU002'
    });

    console.log('Created sample users');

    // Create sample assignments
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Due in 7 days

    const assignment = await Assignment.create({
      title: 'Data Structures Implementation',
      description: 'Implement binary search tree with all basic operations',
      courseCode: 'CS101',
      courseName: 'Data Structures',
      teacher: teacher._id,
      dueDate: dueDate,
      maxScore: 100,
      rubric: {
        criteria: [
          { name: 'Code Quality', maxPoints: 25, description: 'Code organization and style' },
          { name: 'Functionality', maxPoints: 40, description: 'Correct implementation' },
          { name: 'Comments', maxPoints: 15, description: 'Clear documentation' },
          { name: 'Testing', maxPoints: 20, description: 'Test coverage' }
        ]
      },
      instructions: 'Implement a BST with insert, delete, and search operations',
      isAutoGraded: false
    });

    console.log('Created sample assignment');

    // Log sample credentials
    console.log('\n=== Sample Users Created ===');
    console.log(`Teacher:
      Email: ${teacher.email}
      Password: password123
      Role: Teacher`);
    console.log(`\nStudent 1:
      Email: ${student1.email}
      Password: password123
      Role: Student`);
    console.log(`\nStudent 2:
      Email: ${student2.email}
      Password: password123
      Role: Student`);

    console.log('\n=== Sample Assignment Created ===');
    console.log(`Title: ${assignment.title}`);
    console.log(`Course: ${assignment.courseName} (${assignment.courseCode})`);
    console.log(`Max Score: ${assignment.maxScore}`);

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
