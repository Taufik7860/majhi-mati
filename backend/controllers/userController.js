import prisma from '../config/db.js';

export const getCitizenDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const totalSubmitted = await prisma.issue.count({ where: { userId } });
    const pending = await prisma.issue.count({ where: { userId, status: 'PENDING' } });
    const inProgress = await prisma.issue.count({ where: { userId, status: 'IN_PROGRESS' } });
    const resolved = await prisma.issue.count({ where: { userId, status: 'RESOLVED' } });

    const recentIssues = await prisma.issue.findMany({
      where: { userId },
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      user: req.user,
      stats: {
        totalSubmitted,
        pending,
        inProgress,
        resolved,
      },
      recentIssues,
    });
  } catch (error) {
    next(error);
  }
};