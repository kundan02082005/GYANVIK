import { store } from '../db/store.js';

export const getDiscoveries = (req, res) => {
  const { category, stateScope } = req.query;
  const list = store.getDiscoveries({ category, stateScope });
  return res.json({ success: true, count: list.length, discoveries: list });
};

export const createDiscovery = (req, res) => {
  const {
    title,
    category,
    conductingAuthority,
    eligibility,
    ageLimit,
    reservationInfo,
    applicationWindow,
    examDate,
    officialUrl,
    stateScope = 'All India'
  } = req.body;

  if (!title || !category || !conductingAuthority || !officialUrl) {
    return res.status(400).json({ success: false, message: 'Title, category, conducting authority and official URL are required.' });
  }

  const discovery = store.createDiscovery({
    title,
    category,
    conductingAuthority,
    eligibility: eligibility || 'Check official prospectus',
    ageLimit: ageLimit || 'As prescribed by examination authority',
    reservationInfo: reservationInfo || 'Government of India norms apply',
    applicationWindow: applicationWindow || 'Announced periodically',
    examDate: examDate || 'Annual cycle',
    officialUrl,
    stateScope
  });

  return res.status(201).json({
    success: true,
    message: 'Official competitive examination opportunity cataloged.',
    discovery
  });
};

export const getCompetitions = (req, res) => {
  const { examSlug = 'neet' } = req.query;
  const competitions = store.getCompetitions(examSlug);
  return res.json({ success: true, competitions });
};

export const createCompetition = (req, res) => {
  const { title, examSlug = 'neet', description, startDate, endDate, eligibility, rulesText, prizesText } = req.body;
  if (!title || !startDate || !endDate) {
    return res.status(400).json({ success: false, message: 'Title, start date and end date are required.' });
  }

  const comp = store.createCompetition({
    title,
    examSlug,
    description: description || '',
    startDate,
    endDate,
    eligibility: eligibility || 'Open to all registered candidates',
    rulesText: rulesText || 'Standard NTA marking rules apply',
    prizesText: prizesText || 'Merit scholarships and recognition certificates'
  });

  return res.status(201).json({
    success: true,
    message: 'National competition / talent search created.',
    competition: comp
  });
};
