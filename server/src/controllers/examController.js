import { store } from '../db/store.js';

export const getCategories = (req, res) => {
  return res.json({
    success: true,
    categories: store.examCategories
  });
};

export const getExamConfig = (req, res) => {
  const { slug = 'neet' } = req.params;
  const config = store.getExamConfig(slug);
  return res.json({
    success: true,
    config
  });
};

export const updateExamConfig = (req, res) => {
  const { slug = 'neet' } = req.params;
  const updates = req.body;

  const updated = store.updateExamConfig(slug, updates, req.user?.id);

  return res.json({
    success: true,
    message: `Examination pattern & configuration for ${slug.toUpperCase()} successfully updated.`,
    config: updated
  });
};

export const createCategory = (req, res) => {
  const { slug, name, fullName, category, tagline, description, status = 'COMING_SOON', badge, color = 'blue' } = req.body;

  if (!slug || !name) {
    return res.status(400).json({ success: false, message: 'Slug and Name are required.' });
  }

  const existing = store.examCategories.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'Category with this slug already exists.' });
  }

  const newCat = {
    slug: slug.toLowerCase(),
    name,
    fullName: fullName || name,
    category: category || 'Competitive Examination',
    status,
    badge: badge || 'New Examination Track',
    tagline: tagline || '',
    description: description || '',
    color
  };

  store.examCategories.push(newCat);

  return res.status(201).json({
    success: true,
    message: `Examination track "${name}" created successfully.`,
    category: newCat
  });
};
