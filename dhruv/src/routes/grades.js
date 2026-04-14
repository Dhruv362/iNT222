const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Grade = require('../models/Grade');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const GradingService = require('../services/GradingService');

/**
 * POST /api/grades
 * Create or auto-grade a submission
 */
router.post('/', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { submissionId, assignmentId, totalScore, rubricScores, isAutoGraded } = req.body;

    // Validate input
    if (!submissionId || !assignmentId) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID and Assignment ID are required'
      });
    }

    // Get submission and assignment
    const submission = await Submission.findById(submissionId);
    const assignment = await Assignment.findById(assignmentId);

    if (!submission || !assignment) {
      return res.status(404).json({
        success: false,
        message: 'Submission or Assignment not found'
      });
    }

    // Check if grade already exists
    let grade = await Grade.findOne({ submission: submissionId });

    if (grade) {
      // Update existing grade
      grade = await GradingService.updateGrade(grade._id, {
        totalScore,
        percentage: (totalScore / assignment.maxScore) * 100,
        rubricScores,
        teacher: req.user.id,
        isAutoGraded
      });
    } else {
      // Create new grade
      const gradeData = {
        submission: submissionId,
        assignment: assignmentId,
        student: submission.student,
        teacher: req.user.id,
        totalScore: totalScore || 0,
        percentage: totalScore ? (totalScore / assignment.maxScore) * 100 : 0,
        rubricScores: rubricScores || [],
        isAutoGraded: isAutoGraded || false,
        gradingMethod: isAutoGraded ? 'automated' : 'manual'
      };

      grade = await GradingService.createManualGrade(gradeData);
      await grade.save();
    }

    // Update submission with grade reference
    submission.grade = grade._id;
    submission.status = 'graded';
    submission.gradedDate = new Date();
    await submission.save();

    res.status(201).json({
      success: true,
      message: 'Grade recorded successfully',
      grade: {
        id: grade._id,
        submission: grade.submission,
        totalScore: grade.totalScore,
        percentage: grade.percentage,
        letterGrade: grade.letterGrade,
        isAutoGraded: grade.isAutoGraded
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating grade'
    });
  }
});

/**
 * POST /api/grades/auto/:assignmentId
 * Auto-grade all submissions for an assignment
 */
router.post('/auto/:assignmentId', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    if (!assignment.isAutoGraded) {
      return res.status(400).json({
        success: false,
        message: 'This assignment is not configured for auto-grading'
      });
    }

    // Get all submissions for this assignment
    const submissions = await Submission.find({ assignment: assignmentId });

    const grades = [];
    for (const submission of submissions) {
      const autoGrade = await GradingService.autoGradeSubmission(submission, assignment);
      if (autoGrade) {
        await autoGrade.save();
        submission.grade = autoGrade._id;
        submission.status = 'graded';
        submission.gradedDate = new Date();
        await submission.save();
        grades.push(autoGrade);
      }
    }

    res.status(200).json({
      success: true,
      message: `Auto-graded ${grades.length} submissions`,
      gradesCount: grades.length,
      grades: grades.map(g => ({
        id: g._id,
        submission: g.submission,
        totalScore: g.totalScore,
        percentage: g.percentage,
        letterGrade: g.letterGrade
      }))
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error auto-grading submissions'
    });
  }
});

/**
 * GET /api/grades/submission/:submissionId
 * Get grade for a submission
 */
router.get('/submission/:submissionId', auth, async (req, res) => {
  try {
    const grade = await Grade.findOne({ submission: req.params.submissionId })
      .populate('student', 'firstName lastName email')
      .populate('submission');

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    res.status(200).json({
      success: true,
      grade
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grade'
    });
  }
});

/**
 * GET /api/grades/assignment/:assignmentId
 * Get all grades for an assignment
 */
router.get('/assignment/:assignmentId', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const grades = await Grade.find({ assignment: req.params.assignmentId })
      .populate('student', 'firstName lastName email studentId')
      .populate('submission')
      .sort({ totalScore: -1 });

    // Calculate statistics
    const stats = await GradingService.getGradeStatistics(req.params.assignmentId);

    res.status(200).json({
      success: true,
      count: grades.length,
      statistics: stats,
      grades
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grades'
    });
  }
});

/**
 * GET /api/grades/student/:studentId
 * Get all grades for a student
 */
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    // Check authorization
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const grades = await Grade.find({ student: req.params.studentId })
      .populate('assignment', 'title courseCode maxScore')
      .populate('submission')
      .sort({ gradedDate: -1 });

    const averageScore = grades.length > 0
      ? Math.round((grades.reduce((sum, g) => sum + g.percentage, 0) / grades.length) * 100) / 100
      : 0;

    res.status(200).json({
      success: true,
      count: grades.length,
      averageScore,
      grades
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching grades'
    });
  }
});

/**
 * PATCH /api/grades/:id
 * Update a grade
 */
router.patch('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const { totalScore, percentage, rubricScores, gradeChangeReason } = req.body;

    const grade = await GradingService.updateGrade(req.params.id, {
      totalScore,
      percentage,
      rubricScores,
      gradeChangeReason
    });

    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Grade updated successfully',
      grade
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating grade'
    });
  }
});

module.exports = router;
