const express = require('express');
const router = express.Router();
const { verifyToken, isRestaurant, isAdmin } = require('../middleware/auth.middleware');
const db = require('../models');
const Dish = db.dish;
const Restaurant = db.restaurant;

// Get a specific dish by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id, {
            include: [{
                model: Restaurant,
                attributes: ['name']
            }]
        });

        if (!dish) {
            return res.status(404).send({ message: "Plat non trouvé" });
        }

        res.status(200).send(dish);
    } catch (error) {
        console.error('Error fetching dish:', error);
        res.status(500).send({ message: error.message });
    }
});

// Get all dishes (with optional restaurantId filter)
router.get('/', verifyToken, async (req, res) => {
    try {
        const where = req.query.restaurantId ? { restaurantId: req.query.restaurantId } : {};
        const dishes = await Dish.findAll({ where });
        res.status(200).send(dishes);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Get all dishes for a specific restaurant
router.get('/restaurants/:restaurantId/dishes', verifyToken, async (req, res) => {
    try {
        const dishes = await Dish.findAll({
            where: {
                restaurantId: req.params.restaurantId
            }
        });
        res.status(200).send(dishes);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Add a dish (restaurant only)
router.post('/', [verifyToken, isRestaurant], async (req, res) => {
    try {
        const { name, description, price, restaurantId } = req.body;
        
        // Verify restaurant ownership
        const restaurant = await Restaurant.findOne({
            where: { 
                id: restaurantId,
                userId: req.userId
            }
        });

        if (!restaurant) {
            return res.status(403).send({ 
                message: "You can only add dishes to your own restaurant" 
            });
        }

        const dish = await Dish.create({
            name,
            description,
            price,
            restaurantId
        });

        res.status(201).send(dish);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Create a new dish for a restaurant
router.post('/restaurants/:restaurantId/dishes', verifyToken, async (req, res) => {
    try {
        const { name, description, price } = req.body;
        const dish = await Dish.create({
            name,
            description,
            price,
            restaurantId: req.params.restaurantId
        });
        res.status(201).send(dish);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Update a dish (restaurant only)
router.put('/:id', [verifyToken, isRestaurant], async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id);
        
        if (!dish) {
            return res.status(404).send({ message: "Plat non trouvé" });
        }

        // Verify restaurant ownership
        const restaurant = await Restaurant.findOne({
            where: { 
                id: dish.restaurantId,
                userId: req.userId
            }
        });

        if (!restaurant) {
            return res.status(403).send({ 
                message: "You can only update dishes from your own restaurant" 
            });
        }

        await dish.update(req.body);
        res.status(200).send(dish);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Delete a dish (restaurant only)
router.delete('/:id', [verifyToken, isRestaurant], async (req, res) => {
    try {
        const dish = await Dish.findByPk(req.params.id);
        
        if (!dish) {
            return res.status(404).send({ message: "Plat non trouvé" });
        }

        // Verify restaurant ownership
        const restaurant = await Restaurant.findOne({
            where: { 
                id: dish.restaurantId,
                userId: req.userId
            }
        });

        if (!restaurant) {
            return res.status(403).send({ 
                message: "You can only delete dishes from your own restaurant" 
            });
        }

        await dish.destroy();
        res.status(200).send({ message: "Plat supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
