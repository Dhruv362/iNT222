const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const AnalyticsService = require('../services/AnalyticsService');
const Analytics = require('../models/Analytics');

/**
 * POST /api/analytics/assignment/:assignmentId
 * Calculate and save analytics for an assignment
 */
router.post('/assignment/:assignmentId', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    
    const analytics = await AnalyticsService.calculateAssignmentAnalytics(assignmentId);
    
    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'No grades found for this assignment'
      });
    }

    // Save to database
    const savedAnalytics = await AnalyticsService.saveAnalytics(analytics);

    res.status(201).json({
      success: true,
      message: 'Analytics calculated successfully',
      analytics: savedAnalytics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error calculating analytics'
    });
  }
});

/**
 * GET /api/analytics/assignment/:assignmentId
 * Get analytics for an assignment
 */
router.get('/assignment/:assignmentId', auth, async (req, res) => {
  try {
    const analytics = await Analytics.findOne({
      assignment: req.params.assignmentId
    }).populate('assignment').populate('teacher', 'firstName lastName email');

    if (!analytics) {
      return res.status(404).json({
        success: false,
        message: 'Analytics not found for this assignment'
      });
    }

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics'
    });
  }
});

/**
 * GET /api/analytics/course/:courseCode
 * Get course-level analytics
 */
router.get('/course/:courseCode', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const courseAnalytics = await AnalyticsService.getCourseLevelAnalytics(
      req.params.courseCode,
      req.user.id
    );

    if (!courseAnalytics) {
      return res.status(404).json({
        success: false,
        message: 'No analytics found for this course'
      });
    }

    res.status(200).json({
      success: true,
      courseAnalytics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course analytics'
    });
  }
});

/**
 * GET /api/analytics/student/:studentId
 * Get student progress analytics
 */
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    // Check authorization - student can only see their own analytics
    if (req.user.role === 'student' && req.user.id !== req.params.studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const studentAnalytics = await AnalyticsService.getStudentProgressAnalytics(req.params.studentId);

    if (!studentAnalytics) {
      return res.status(404).json({
        success: false,
        message: 'No analytics found for this student'
      });
    }

    res.status(200).json({
      success: true,
      analytics: studentAnalytics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching student analytics'
    });
  }
});

/**
 * GET /api/analytics/dashboard
 * Get teacher dashboard analytics
 */
router.get('/dashboard', auth, checkRole(['teacher', 'admin']), async (req, res) => {
  try {
    const teacherAnalytics = await Analytics.find({
      teacher: req.user.id
    })
      .populate('assignment', 'title courseCode')
      .sort({ createdAt: -1 })
      .limit(10);

    const summaryStats = {
      totalAssignments: teacherAnalytics.length,
      totalSubmissions: teacherAnalytics.reduce((sum, a) => sum + a.totalSubmissions, 0),
      averageClassScore: Math.round(
        (teacherAnalytics.reduce((sum, a) => sum + a.averageScore, 0) / teacherAnalytics.length) * 100
      ) / 100,
      topPerformers: [],
      strugglingStudents: []
    };

    // Aggregate top performers and struggling students
    for (const analytics of teacherAnalytics) {
      if (analytics.topPerformers) {
        summaryStats.topPerformers.push(...analytics.topPerformers);
      }
      if (analytics.strugglingStudents) {
        summaryStats.strugglingStudents.push(...analytics.strugglingStudents);
      }
    }

    // Remove duplicates and sort
    summaryStats.topPerformers = [...new Map(
      summaryStats.topPerformers.map(item => [item.studentId, item])
    ).values()].sort((a, b) => b.scorePercentage - a.scorePercentage).slice(0, 5);

    summaryStats.strugglingStudents = [...new Map(
      summaryStats.strugglingStudents.map(item => [item.studentId, item])
    ).values()].sort((a, b) => a.scorePercentage - b.scorePercentage).slice(0, 5);

    res.status(200).json({
      success: true,
      summary: summaryStats,
      recentAssignments: teacherAnalytics
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics'
    });
  }
});

module.exports = router;
