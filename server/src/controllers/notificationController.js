import { store } from '../db/store.js';

export const getTicker = (req, res) => {
  const { examSlug = 'neet' } = req.query;
  const items = store.getTickerNotifications(examSlug);
  return res.json({
    success: true,
    ticker: items
  });
};

export const getNotifications = (req, res) => {
  const { examSlug = 'neet' } = req.query;
  const items = store.getNotifications(examSlug);
  return res.json({
    success: true,
    notifications: items
  });
};

export const createNotification = (req, res) => {
  const { title, content, examSlug = 'neet', sourceName, sourceUrl, isVerified = true, isTicker = true, urgencyLevel = 'INFO' } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  const notification = store.createNotification({
    title,
    content,
    examSlug,
    sourceName: sourceName || 'National Testing Agency (NTA)',
    sourceUrl: sourceUrl || 'https://exams.nta.ac.in/NEET/',
    isVerified: Boolean(isVerified),
    isTicker: Boolean(isTicker),
    urgencyLevel,
    createdBy: req.user?.id
  });

  return res.status(201).json({
    success: true,
    message: 'Official announcement published to ticker successfully.',
    notification
  });
};

export const updateNotification = (req, res) => {
  const { id } = req.params;
  const updated = store.updateNotification(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Notification not found.' });
  }
  return res.json({
    success: true,
    message: 'Notification updated successfully.',
    notification: updated
  });
};

export const deleteNotification = (req, res) => {
  const { id } = req.params;
  const success = store.deleteNotification(id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Notification not found.' });
  }
  return res.json({
    success: true,
    message: 'Notification deleted successfully.'
  });
};
