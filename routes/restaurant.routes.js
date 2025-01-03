const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const bcrypt = require('bcryptjs');
const db = require('../models');
const Restaurant = db.restaurant;
const User = db.user;

// Get all restaurants
router.get('/', verifyToken, async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      include: [{
        model: User,
        attributes: ['username', 'email']
      }]
    });
    console.log('Restaurants récupérés:', restaurants); // Log des restaurants récupérés
    res.status(200).send(restaurants);
  } catch (error) {
    console.error('Erreur lors de la récupération des restaurants:', error); // Log de l'erreur
    res.status(500).send({ message: error.message });
  }
});

// Create restaurant (admin only)
router.post('/', [verifyToken, isAdmin], async (req, res) => {
  try {
    const { name, address, postalCode, city, email, password } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);
    
    // Créer l'utilisateur avec le rôle RESTAURANT
    const restaurantUser = await User.create({
      username: name,
      email,
      password: hashedPassword,
      role: 'RESTAURANT'
    });

    // Créer le restaurant associé à l'utilisateur
    const restaurant = await Restaurant.create({
      name,
      address,
      postalCode,
      city,
      email,
      userId: restaurantUser.id
    });

    res.status(201).send({
      message: "Restaurant créé avec succès",
      restaurant,
      user: {
        id: restaurantUser.id,
        email: restaurantUser.email,
        role: restaurantUser.role
      }
    });
  } catch (error) {
    console.error('Erreur lors de la création du restaurant:', error);
    res.status(500).send({ message: error.message });
  }
});

// Update restaurant
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    
    if (!restaurant) {
      return res.status(404).send({ message: "Restaurant non trouvé" });
    }

    // Vérifier que l'utilisateur est admin ou le propriétaire du restaurant
    if (req.user.role !== 'ADMIN' && restaurant.userId !== req.user.id) {
      return res.status(403).send({ message: "Non autorisé à modifier ce restaurant" });
    }

    const { name, address, postalCode, city, email } = req.body;
    
    // Mettre à jour le restaurant
    await restaurant.update({
      name,
      address,
      postalCode,
      city,
      email
    });

    // Si l'utilisateur est le propriétaire du restaurant, mettre à jour son email aussi
    if (restaurant.userId === req.user.id) {
      const user = await User.findByPk(req.user.id);
      if (user) {
        await user.update({ email });
      }
    }

    res.status(200).send({ message: "Restaurant mis à jour avec succès" });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du restaurant:', error);
    res.status(500).send({ message: error.message });
  }
});

// Delete restaurant (admin only)
router.delete('/:id', [verifyToken, isAdmin], async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    
    if (!restaurant) {
      return res.status(404).send({ message: "Restaurant not found" });
    }

    await restaurant.destroy();
    res.status(200).send({ message: "Restaurant deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get restaurant by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['username', 'email']
      }]
    });
    
    if (!restaurant) {
      return res.status(404).send({ message: "Restaurant not found" });
    }

    res.status(200).send(restaurant);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
