import prisma from '../config/db.js';

export const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalReports = await prisma.issue.count();
    const pendingCount = await prisma.issue.count({ where: { status: 'PENDING' } });
    const inProgressCount = await prisma.issue.count({ where: { status: 'IN_PROGRESS' } });
    const resolvedCount = await prisma.issue.count({ where: { status: 'RESOLVED' } });

    const issuesList = await prisma.issue.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { fullName: true, email: true, phone: true } },
      },
    });

    res.status(200).json({
      success: true,
      officer: req.user,
      stats: {
        totalReports,
        pendingCount,
        inProgressCount,
        resolvedCount,
        resolutionRate: totalReports > 0 ? ((resolvedCount / totalReports) * 100).toFixed(1) : 0,
      },
      issues: issuesList,
    });
  } catch (error) {
    next(error);
  }
};

export const updateIssueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: { status },
    });

    res.status(200).json({ success: true, issue: updatedIssue });
  } catch (error) {
    next(error);
  }
};