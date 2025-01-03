const express = require('express');
const router = express.Router();
const { verifyToken, isRestaurant } = require('../middleware/auth.middleware');
const db = require('../models');
const Order = db.order;
const OrderItem = db.orderItem;
const User = db.user;
const Dish = db.dish;
const Restaurant = db.restaurant;

// Get orders for a specific restaurant
router.get('/restaurant/:restaurantId', verifyToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: {
                restaurantId: req.params.restaurantId
            },
            include: [
                {
                    model: User,
                    attributes: ['email']
                },
                {
                    model: OrderItem,
                    include: [{
                        model: Dish,
                        attributes: ['name']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).send(orders);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: error.message });
    }
});

// Get orders for the authenticated user
router.get('/my-orders', verifyToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: {
                userId: req.userId
            },
            include: [
                {
                    model: OrderItem,
                    include: [{
                        model: Dish,
                        attributes: ['name', 'price']
                    }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).send(orders);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: error.message });
    }
});

// Create order (any authenticated user)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { restaurantId, items } = req.body;
        
        // Calculate total amount
        let totalAmount = 0;
        for (const item of items) {
            const dish = await Dish.findByPk(item.dishId);
            if (!dish) {
                return res.status(404).send({ message: `Plat ${item.dishId} non trouvé` });
            }
            totalAmount += dish.price * item.quantity;
        }

        // Create order
        const order = await Order.create({
            userId: req.userId,
            restaurantId,
            totalAmount
        });

        // Create order items
        for (const item of items) {
            await OrderItem.create({
                orderId: order.id,
                dishId: item.dishId,
                quantity: item.quantity,
                price: (await Dish.findByPk(item.dishId)).price
            });
        }

        res.status(201).send(order);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

// Delete an order (restaurant only)
router.delete('/:id', [verifyToken, isRestaurant], async (req, res) => {
    try {
        // Vérifier que la commande existe et appartient au restaurant
        const restaurant = await Restaurant.findOne({
            where: { userId: req.userId }
        });

        if (!restaurant) {
            return res.status(403).send({ message: "Vous devez être propriétaire d'un restaurant" });
        }

        const order = await Order.findOne({
            where: { 
                id: req.params.id,
                restaurantId: restaurant.id
            }
        });
        
        if (!order) {
            return res.status(404).send({ message: "Commande non trouvée ou vous n'êtes pas autorisé à la supprimer" });
        }

        // Supprimer d'abord les items de la commande
        await OrderItem.destroy({
            where: { orderId: order.id }
        });

        // Puis supprimer la commande
        await order.destroy();
        res.status(200).send({ message: "Commande supprimée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
