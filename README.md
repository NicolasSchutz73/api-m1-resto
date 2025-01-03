# API Restaurant 🍽️

Une API REST complète pour la gestion de restaurants, avec interface client et back-office.

## 🚀 Technologies utilisées

- **Backend** :
  - Node.js
  - Express.js
  - Sequelize ORM
  - SQLite
  - JWT pour l'authentification

- **Frontend** :
  - HTML/CSS/JavaScript vanilla
  - Interface séparée pour client et back-office

## ✨ Fonctionnalités

- **Interface Client** :
  - Parcourir les restaurants
  - Commander des plats
  - Gérer son panier
  - Voir l'historique des commandes

- **Interface Back-office** :
  - Gestion des restaurants (ADMIN)
  - Gestion des plats (RESTAURANT)
  - Suivi des commandes
  - Statistiques

## 🛠️ Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Un éditeur de code (VS Code recommandé)
- Postman (pour tester l'API)

## 📦 Installation

1. Clonez le dépôt
```bash
git clone https://github.com/NicolasSchutz73/api-restaurant.git
cd api-restaurant
```

2. Installez les dépendances
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet
```env
JWT_SECRET=votre_secret_jwt
PORT=3000
```

4. Démarrez le serveur
```bash
npm start
```

## 🔑 Rôles et permissions

### ADMIN
- Peut créer/supprimer des restaurants
- A accès à toutes les fonctionnalités

### RESTAURANT
- Peut gérer ses plats
- Peut voir ses commandes
- Peut modifier ses informations

### USER
- Peut voir les restaurants et les plats
- Peut passer et gérer ses commandes
- Peut modifier son profil

## 📚 Documentation API

Une collection Postman est fournie pour tester facilement l'API. Pour l'utiliser :

1. Importez le fichier `API_Restaurant.postman_collection.json` dans Postman
2. Configurez les variables de la collection :
   - `token` : Token JWT pour un utilisateur normal
   - `adminToken` : Token JWT pour un administrateur
   - `restaurantToken` : Token JWT pour un restaurant

### Endpoints disponibles

#### Auth
- POST `/api/auth/login` : Connexion
- POST `/api/auth/register` : Inscription

#### Restaurants
- GET `/api/restaurants` : Liste des restaurants
- GET `/api/restaurants/:id` : Détails d'un restaurant
- POST `/api/restaurants` : Créer un restaurant (Admin)
- PUT `/api/restaurants/:id` : Modifier un restaurant
- DELETE `/api/restaurants/:id` : Supprimer un restaurant (Admin)

#### Plats
- GET `/api/dishes?restaurantId=X` : Liste des plats d'un restaurant
- GET `/api/dishes/:id` : Détails d'un plat
- POST `/api/dishes` : Créer un plat (Restaurant)
- DELETE `/api/dishes/:id` : Supprimer un plat (Restaurant)

#### Commandes
- GET `/api/orders/user` : Commandes de l'utilisateur connecté
- GET `/api/orders/restaurant/:id` : Commandes d'un restaurant
- POST `/api/orders` : Créer une commande
- DELETE `/api/orders/:id` : Supprimer une commande

#### Utilisateurs
- GET `/api/users/profile` : Profil de l'utilisateur connecté
- PUT `/api/users/profile` : Modifier le profil

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 👨‍💻 Auteur

Nicolas Schutz
