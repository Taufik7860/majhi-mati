const supportTickets = [];

const generateTicketToken = ({ citizenName, subject, description, uploadedFile }) => {
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const timePart = String(Date.now()).slice(-4);
  const safeName = (citizenName || 'CITIZEN').replace(/\s+/g, '').slice(0, 3).toUpperCase();

  return `MMD-${safeName}-${dateStamp}-${timePart}`;
};

export const createSupportTicket = (req, res) => {
  try {
    const { citizenName, subject, description, uploadedFile } = req.body || {};

    if (!citizenName?.trim() || !subject?.trim() || !description?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Citizen name, subject and description are required.',
      });
    }

    const ticket = {
      id: supportTickets.length + 1,
      token: generateTicketToken({
        citizenName,
        subject,
        description,
        uploadedFile,
      }),
      citizenName: citizenName.trim(),
      subject: subject.trim(),
      description: description.trim(),
      uploadedFile: uploadedFile || '',
      status: 'open',
      createdAt: new Date().toISOString(),
      officerNote: 'Assigned to municipal officer support desk',
    };

    supportTickets.unshift(ticket);

    return res.status(201).json({
      success: true,
      message: 'Support token created successfully.',
      ticket,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to create support ticket.',
      error: error.message,
    });
  }
};

export const getSupportTickets = (req, res) => {
  return res.status(200).json({
    success: true,
    count: supportTickets.length,
    tickets: supportTickets,
  });
};
