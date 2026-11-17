import { store } from '../db/store.js';

export const getSubjects = (req, res) => {
  const { examSlug = 'neet' } = req.query;
  const subjects = store.getSubjects(examSlug);
  return res.json({ success: true, subjects });
};

export const getChapters = (req, res) => {
  const { subjectId } = req.query;
  const chapters = store.getChapters(subjectId);
  return res.json({ success: true, chapters });
};

export const getQuestions = (req, res) => {
  const { subjectId, chapterId, year, difficulty, examSlug = 'neet' } = req.query;
  const questions = store.getQuestions({ subjectId, chapterId, year, difficulty, examSlug });
  return res.json({ success: true, count: questions.length, questions });
};

export const createQuestion = (req, res) => {
  const {
    subjectId,
    chapterId,
    examSlug = 'neet',
    year,
    topic,
    difficulty = 'MEDIUM',
    questionText,
    questionImageUrl,
    options,
    correctOption,
    explanation,
    tags
  } = req.body;

  if (!subjectId || !questionText || !options || !correctOption) {
    return res.status(400).json({
      success: false,
      message: 'Subject, Question Text, Options, and Correct Option are required.'
    });
  }

  const newQuestion = store.createQuestion({
    subjectId,
    chapterId,
    examSlug,
    year: parseInt(year, 10) || 2024,
    topic: topic || 'General Concepts',
    difficulty,
    questionText,
    questionImageUrl: questionImageUrl || null,
    options: Array.isArray(options) ? options : [],
    correctOption,
    explanation: explanation || 'Detailed solution provided by Gyanvik Academic Panel.',
    tags: Array.isArray(tags) ? tags : ['NEET PYQ']
  });

  return res.status(201).json({
    success: true,
    message: 'Question added to authentic question bank successfully.',
    question: newQuestion
  });
};

export const updateQuestion = (req, res) => {
  const { id } = req.params;
  const updated = store.updateQuestion(id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Question not found.' });
  }
  return res.json({ success: true, message: 'Question updated successfully.', question: updated });
};

export const deleteQuestion = (req, res) => {
  const { id } = req.params;
  const success = store.deleteQuestion(id);
  if (!success) {
    return res.status(404).json({ success: false, message: 'Question not found.' });
  }
  return res.json({ success: true, message: 'Question deleted successfully.' });
};

// --- NCERT Resources ---
export const getNcertResources = (req, res) => {
  const { subjectId } = req.query;
  const resources = store.getNcertResources(subjectId);
  return res.json({ success: true, resources });
};

export const createNcertResource = (req, res) => {
  const { title, subjectId, classLevel, chapterName, fileUrl, fileSizeMb = 5.0, coverColor = 'emerald' } = req.body;
  if (!title || !subjectId || !fileUrl) {
    return res.status(400).json({ success: false, message: 'Title, Subject and File URL are required.' });
  }

  const resource = store.createNcertResource({
    title,
    subjectId,
    classLevel: classLevel || '11th & 12th',
    chapterName: chapterName || 'Full Textbook',
    fileUrl,
    fileSizeMb: parseFloat(fileSizeMb),
    isDownloadable: true,
    coverColor
  });

  return res.status(201).json({
    success: true,
    message: 'NCERT Textbook material cataloged successfully.',
    resource
  });
};

// --- Short Notes & Blueprints ---
export const getShortNotes = (req, res) => {
  const { subjectId } = req.query;
  const notes = store.getShortNotes(subjectId);
  return res.json({ success: true, notes });
};

export const createShortNote = (req, res) => {
  const { title, subjectId, classLevel, chapterName, summary, fileUrl, isBlueprint = false, isPremium = true } = req.body;
  if (!title || !subjectId || !fileUrl) {
    return res.status(400).json({ success: false, message: 'Title, Subject and File URL are required.' });
  }

  const note = store.createShortNote({
    title,
    subjectId,
    classLevel: classLevel || '12th',
    chapterName: chapterName || 'Revision Notes',
    summary: summary || '',
    fileUrl,
    isBlueprint: Boolean(isBlueprint),
    isPremium: Boolean(isPremium)
  });

  return res.status(201).json({
    success: true,
    message: 'Revision notes / examination blueprint added successfully.',
    note
  });
};
