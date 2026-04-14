const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');
const GradingService = require('../services/GradingService');
const FeedbackService = require('../services/FeedbackService');

/**
 * POST /api/submissions
 * Submit homework
 */
router.post('/', auth, upload.array('files', 5), async (req, res) => {
  try {
    const { assignmentId, content } = req.body;
    const studentId = req.user.id;

    // Validate input
    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        message: 'Assignment ID is required'
      });
    }

    // Check if assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check for duplicate submission
    let submission = await Submission.findOne({
      assignment: assignmentId,
      student: studentId
    });

    if (submission) {
      // Update submission instead of creating new one
      submission.content = content || submission.content;
      submission.submittedDate = new Date();
      submission.status = 'submitted';
      
      if (req.files && req.files.length > 0) {
        submission.files = req.files.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          filepath: file.path,
          mimeType: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        }));
      }
    } else {
      // Create new submission
      submission = new Submission({
        assignment: assignmentId,
        student: studentId,
        content,
        files: req.files ? req.files.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          filepath: file.path,
          mimeType: file.mimetype,
          size: file.size,
          uploadedAt: new Date()
        })) : [],
        isLate: new Date() > assignment.dueDate,
        status: 'submitted'
      });
    }

    await submission.save();

    // Update assignment submission count
    if (!submission.isLate) {
      assignment.totalSubmissions += 1;
      await assignment.save();
    }

    res.status(201).json({
      success: true,
      message: 'Submission successful',
      submission: {
        id: submission._id,
        assignmentId: submission.assignment,
        submittedDate: submission.submittedDate,
        status: submission.status,
        isLate: submission.isLate
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error submitting assignment'
    });
  }
});

/**
 * GET /api/submissions/:id
 * Get submission details
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('assignment')
      .populate('student', 'firstName lastName email');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    res.status(200).json({
      success: true,
      submission
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submission'
    });
  }
});

/**
 * GET /api/submissions/assignment/:assignmentId
 * Get all submissions for an assignment
 */
router.get('/assignment/:assignmentId', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId })
      .populate('student', 'firstName lastName email studentId')
      .populate('grade')
      .populate('feedback')
      .sort({ submittedDate: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions'
    });
  }
});

/**
 * GET /api/submissions/student/:studentId
 * Get all submissions for a student
 */
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    // Check authorization - student can only see their own submissions
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const submissions = await Submission.find({ student: req.params.studentId })
      .populate('assignment', 'title courseCode')
      .populate('grade')
      .sort({ submittedDate: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      submissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching submissions'
    });
  }
});

/**
 * PATCH /api/submissions/:id
 * Update submission status
 */
router.patch('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { status, teacherNotes } = req.body;
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status, teacherNotes, updatedAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Submission updated',
      submission
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating submission'
    });
  }
});

module.exports = router;
