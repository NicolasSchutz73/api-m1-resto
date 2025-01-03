const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont requis"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);
    
    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'USER'
    });

    res.status(201).send({
      message: "User registered successfully!",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: error.errors[0].message
      });
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: error.errors[0].message
      });
    }
    console.error(error);
    res.status(500).send({ 
      message: "Une erreur est survenue lors de l'enregistrement"
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        message: "L'email et le mot de passe sont requis"
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(404).send({ message: "Utilisateur non trouvé" });
    }

    // Verify password
    const passwordIsValid = await bcrypt.compare(password, user.password);
    
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Mot de passe incorrect" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: 86400 } // 24 hours
    );

    res.status(200).send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      accessToken: token
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ 
      message: "Une erreur est survenue lors de la connexion"
    });
  }
});

module.exports = router;
