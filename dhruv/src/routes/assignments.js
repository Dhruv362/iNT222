const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const Assignment = require('../models/Assignment');

/**
 * POST /api/assignments
 * Create a new assignment
 */
router.post('/', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const {
      title,
      description,
      courseCode,
      courseName,
      dueDate,
      allowedFileType,
      maxScore,
      rubric,
      instructions,
      isAutoGraded,
      autoGradingRules
    } = req.body;

    // Validate required fields
    if (!title || !description || !courseCode || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    const assignment = new Assignment({
      title,
      description,
      courseCode,
      courseName,
      teacher: req.user.id,
      dueDate: new Date(dueDate),
      allowedFileType: allowedFileType || ['pdf', 'doc', 'docx'],
      maxScore: maxScore || 100,
      rubric,
      instructions,
      isAutoGraded: isAutoGraded || false,
      autoGradingRules
    });

    await assignment.save();

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      assignment: {
        id: assignment._id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        courseCode: assignment.courseCode
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error creating assignment'
    });
  }
});

/**
 * GET /api/assignments/:id
 * Get assignment details
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('teacher', 'firstName lastName email');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      assignment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignment'
    });
  }
});

/**
 * GET /api/assignments/course/:courseCode
 * Get all assignments for a course
 */
router.get('/course/:courseCode', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ courseCode: req.params.courseCode })
      .populate('teacher', 'firstName lastName')
      .sort({ dueDate: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments'
    });
  }
});

/**
 * GET /api/assignments/teacher/:teacherId
 * Get all assignments created by a teacher
 */
router.get('/teacher/:teacherId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.params.teacherId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      assignments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching assignments'
    });
  }
});

/**
 * PATCH /api/assignments/:id
 * Update an assignment
 */
router.patch('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      assignment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error updating assignment'
    });
  }
});

/**
 * DELETE /api/assignments/:id
 * Delete an assignment
 */
router.delete('/:id', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error deleting assignment'
    });
  }
});

module.exports = router;
