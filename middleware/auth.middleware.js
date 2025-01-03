const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
      return res.status(403).send({
        message: "No token provided!"
      });
    }

    const tokenString = token.replace('Bearer ', '');

    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Charger les informations complètes de l'utilisateur
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({
        message: "User not found!"
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send({
      message: "Unauthorized!"
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role === "ADMIN") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Admin Role!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

const isRestaurant = async (req, res, next) => {
  try {
    if (req.user.role === "RESTAURANT") {
      next();
      return;
    }
    res.status(403).send({
      message: "Require Restaurant Role!"
    });
  } catch (error) {
    res.status(500).send({
      message: "Unable to validate user role!"
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
  isRestaurant
};
