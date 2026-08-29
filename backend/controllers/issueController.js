import prisma from '../config/db.js';

export const createIssue = async (req, res, next) => {
  try {
    const { title, description, category, latitude, longitude, address } = req.body;
    const userId = req.user.id;

    const images = req.files ? req.files.map((file) => file.path) : [];

    const issue = await prisma.issue.create({
      data: {
        title,
        description,
        category,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        images,
        userId,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'SUBMITTED_ISSUE',
        details: `Created issue: "${title}" (Category: ${category})`,
        userId,
      },
    });

    res.status(201).json({ success: true, issue });
  } catch (error) {
    next(error);
  }
};

export const getMyIssues = async (req, res, next) => {
  try {
    const issues = await prisma.issue.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ success: true, count: issues.length, issues });
  } catch (error) {
    next(error);
  }
};

export const getIssueById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        user: {
          select: { fullName: true, email: true, phone: true },
        },
      },
    });

    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }

    res.status(200).json({ success: true, issue });
  } catch (error) {
    next(error);
  }
};