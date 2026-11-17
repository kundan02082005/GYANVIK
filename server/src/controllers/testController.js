import { store } from '../db/store.js';

export const getTestSeries = (req, res) => {
  const { examSlug = 'neet' } = req.query;
  const tests = store.getTestSeries(examSlug);
  return res.json({ success: true, tests });
};

export const getTestDetails = (req, res) => {
  const { id } = req.params;
  const test = store.getTestById(id);
  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found.' });
  }

  // Get matching questions for this test: if full mock, fetch all NEET questions; if subject-wise, filter
  let questions = store.questions.filter(q => q.examSlug === (test.examSlug || 'neet'));
  if (test.title.toLowerCase().includes('physics')) {
    questions = questions.filter(q => q.subjectId === 'sub-physics');
  } else if (test.title.toLowerCase().includes('biology')) {
    questions = questions.filter(q => q.subjectId === 'sub-botany' || q.subjectId === 'sub-zoology');
  }

  // Do not expose correctOption in raw test mode if we want strict security,
  // but include safe options
  const safeQuestions = questions.map(({ correctOption: _, explanation: __, ...q }) => q);

  return res.json({
    success: true,
    test,
    questions: safeQuestions,
    totalQuestions: questions.length
  });
};

export const submitTestAttempt = (req, res) => {
  const { testId, responses = {}, timeSpentSeconds = 0 } = req.body;
  const studentId = req.user.id;

  const test = store.getTestById(testId);
  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found.' });
  }

  // Find questions evaluated in this test
  let questions = store.questions.filter(q => q.examSlug === (test.examSlug || 'neet'));
  if (test.title.toLowerCase().includes('physics')) {
    questions = questions.filter(q => q.subjectId === 'sub-physics');
  } else if (test.title.toLowerCase().includes('biology')) {
    questions = questions.filter(q => q.subjectId === 'sub-botany' || q.subjectId === 'sub-zoology');
  }

  let correctCount = 0;
  let incorrectCount = 0;
  let unattemptedCount = 0;
  const questionReviews = [];
  const subjectStats = {};
  const topicStats = {};

  questions.forEach(q => {
    const studentChoice = responses[q.id];
    const isAnswered = Boolean(studentChoice);
    const isCorrect = isAnswered && studentChoice.toUpperCase() === q.correctOption.toUpperCase();

    // Subject tracking
    const subject = store.subjects.find(s => s.id === q.subjectId);
    const subName = subject ? subject.name : 'General';
    if (!subjectStats[subName]) {
      subjectStats[subName] = { total: 0, correct: 0, incorrect: 0, unattempted: 0, marks: 0 };
    }
    subjectStats[subName].total += 1;

    // Topic tracking
    const topicName = q.topic || 'General';
    if (!topicStats[topicName]) {
      topicStats[topicName] = { total: 0, correct: 0, incorrect: 0 };
    }
    topicStats[topicName].total += 1;

    if (!isAnswered) {
      unattemptedCount += 1;
      subjectStats[subName].unattempted += 1;
    } else if (isCorrect) {
      correctCount += 1;
      subjectStats[subName].correct += 1;
      subjectStats[subName].marks += 4;
      topicStats[topicName].correct += 1;
    } else {
      incorrectCount += 1;
      subjectStats[subName].incorrect += 1;
      subjectStats[subName].marks -= 1;
      topicStats[topicName].incorrect += 1;
    }

    questionReviews.push({
      questionId: q.id,
      questionText: q.questionText,
      options: q.options,
      studentChoice: studentChoice || null,
      correctOption: q.correctOption,
      isCorrect,
      isAnswered,
      explanation: q.explanation,
      subject: subName,
      topic: topicName,
      difficulty: q.difficulty
    });
  });

  const totalScore = (correctCount * 4) - (incorrectCount * 1);
  const attemptedCount = correctCount + incorrectCount;
  const accuracyPct = attemptedCount > 0 ? parseFloat(((correctCount / attemptedCount) * 100).toFixed(1)) : 0;
  const percentile = Math.min(99.9, Math.max(10.0, parseFloat((50 + (totalScore / (test.totalMarks || 720)) * 50).toFixed(1))));

  // Identify weak topics (accuracy < 60% with at least 1 mistake)
  const weakTopics = Object.entries(topicStats)
    .filter(([_, stat]) => stat.incorrect > 0 && (stat.correct / (stat.correct + stat.incorrect)) < 0.6)
    .map(([topic, stat]) => ({
      topic,
      accuracy: Math.round((stat.correct / (stat.correct + stat.incorrect)) * 100),
      incorrectCount: stat.incorrect
    }));

  const attempt = store.recordTestAttempt({
    studentId,
    testId,
    testTitle: test.title,
    startTime: new Date(Date.now() - (timeSpentSeconds * 1000)).toISOString(),
    submitTime: new Date().toISOString(),
    score: totalScore,
    totalMarks: test.totalMarks || 720,
    accuracyPct,
    percentile,
    correctCount,
    incorrectCount,
    unattemptedCount,
    timeSpentSeconds,
    subjectBreakdown: subjectStats,
    weakTopics,
    status: 'COMPLETED'
  });

  return res.status(201).json({
    success: true,
    message: 'Test evaluated successfully! Detailed performance analytics generated.',
    attempt,
    questionReviews
  });
};

export const getStudentHistory = (req, res) => {
  const studentId = req.user.id;
  const attempts = store.getStudentAttempts(studentId);
  return res.json({ success: true, attempts });
};

export const createTestSeries = (req, res) => {
  const {
    title,
    description,
    examSlug = 'neet',
    testType = 'FULL_MOCK',
    durationMinutes = 180,
    totalMarks = 720,
    negativeMarking = 1,
    difficulty = 'MEDIUM',
    isPremium = false
  } = req.body;

  if (!title) {
    return res.status(400).json({ success: false, message: 'Test title is required.' });
  }

  const newTest = store.createTestSeries({
    title,
    description: description || '',
    examSlug,
    testType,
    durationMinutes: parseInt(durationMinutes, 10),
    totalMarks: parseInt(totalMarks, 10),
    negativeMarking: parseInt(negativeMarking, 10),
    difficulty,
    isPublished: true,
    isPremium: Boolean(isPremium),
    questionsCount: testType === 'FULL_MOCK' ? 180 : 45
  });

  return res.status(201).json({
    success: true,
    message: 'Test series created successfully.',
    test: newTest
  });
};
