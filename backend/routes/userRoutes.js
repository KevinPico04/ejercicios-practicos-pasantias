const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware'); 
const jwt = require('jsonwebtoken');
const router = express.Router();

// Path to register a user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = new User({ name, email, password });
  await user.save();

  res.status(201).json({ message: 'User created successfully' });
});

// Path to login (generate JWT)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

// Protected route
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Access the user from the application
    res.json(user); // Return the user profile
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// CRUD Operations (Example for Users)
router.get('/', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

router.delete('/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

module.exports = router;
