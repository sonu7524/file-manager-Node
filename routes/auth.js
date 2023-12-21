// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query'],
});
const { generateToken, hashPassword, comparePassword } = require('../utils/authUtils');

// Register a new user
router.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;


  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(409).send({error: 'User already exists'});
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.json({ message: 'User registered successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Login a user
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    console.log(user);

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    // Compare the hashed password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send('Invalid username or password');
    }

    res.json({ message: 'Login successful', authToken: generateToken(user) });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/get/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
})

module.exports = router;
