module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        msg: 'Ce nom d\'utilisateur est déjà pris'
      },
      validate: {
        notNull: {
          msg: 'Le nom d\'utilisateur est requis'
        },
        notEmpty: {
          msg: 'Le nom d\'utilisateur ne peut pas être vide'
        }
      }
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        msg: 'Cet email est déjà utilisé'
      },
      validate: {
        notNull: {
          msg: 'L\'email est requis'
        },
        isEmail: {
          msg: 'Format d\'email invalide'
        }
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le mot de passe est requis'
        },
        len: {
          args: [6, 100],
          msg: 'Le mot de passe doit contenir au moins 6 caractères'
        }
      }
    },
    role: {
      type: Sequelize.ENUM('USER', 'RESTAURANT', 'ADMIN'),
      defaultValue: 'USER',
      validate: {
        isIn: {
          args: [['USER', 'RESTAURANT', 'ADMIN']],
          msg: 'Le rôle doit être USER, RESTAURANT ou ADMIN'
        }
      }
    }
  });

  return User;
};
