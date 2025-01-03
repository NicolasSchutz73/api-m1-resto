const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const db = require('../models');
const User = db.user;

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'username', 'email', 'role']
        });

        if (!user) {
            return res.status(404).send({ message: "Utilisateur non trouvé" });
        }

        res.status(200).send(user);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: error.message });
    }
});

// Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { username, email } = req.body;

        // Vérifier si l'email est déjà utilisé
        if (email) {
            const existingUser = await User.findOne({
                where: { 
                    email: email,
                    id: { [db.Sequelize.Op.ne]: req.userId }
                }
            });

            if (existingUser) {
                return res.status(400).send({ message: "Cet email est déjà utilisé" });
            }
        }

        const user = await User.findByPk(req.userId);
        
        if (!user) {
            return res.status(404).send({ message: "Utilisateur non trouvé" });
        }

        await user.update({
            username: username || user.username,
            email: email || user.email
        });

        res.status(200).send({
            message: "Profil mis à jour avec succès",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
