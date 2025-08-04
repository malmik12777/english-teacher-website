const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Homework = require('../models/Homework');
const { protect, teacher } = require('../middleware/auth');

// Получение текущего пользователя
router.get('/user', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Получение всех пользователей (только для учителя)
router.get('/users', protect, teacher, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Заметки
router.get('/notes', protect, async (req, res) => {
  try {
    const notes = await Note.find({ author: req.user._id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/notes', protect, async (req, res) => {
  const { title, content } = req.body;

  try {
    const note = await Note.create({
      title,
      content,
      author: req.user._id
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Домашние задания
router.get('/homework', protect, async (req, res) => {
  try {
    let homework;
    if (req.user.role === 'teacher') {
      homework = await Homework.find({}).populate('student', 'name email');
    } else {
      homework = await Homework.find({ student: req.user._id });
    }
    res.json(homework);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/homework', protect, teacher, async (req, res) => {
  const { title, description, student, deadline } = req.body;

  try {
    const homework = await Homework.create({
      title,
      description,
      student,
      deadline
    });
    res.status(201).json(homework);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;