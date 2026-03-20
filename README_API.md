***

# 📖 Documentation API - OASE Waterfinder (Backend)

Salut l'équipe React ! 👋 
Le backend est prêt et 100% fonctionnel. Voici la documentation de l'API REST pour que vous puissiez brancher le front-end. 

L'API est construite avec Node.js, Express et Prisma. Elle renvoie exclusivement du **JSON**.

### 🌍 URL de base (Développement local)
`http://localhost:3000/api`

### 🔐 Authentification (JWT)
La majorité des routes sont protégées. Pour y accéder, l'utilisateur doit se connecter (`/auth/login`) pour récupérer un **Token**.
Vous devrez envoyer ce token dans les **Headers** de vos requêtes `fetch` ou `axios` :
```json
{
  "Authorization": "Bearer VOTRE_TOKEN_ICI"
}
```

---

## 1️⃣ AUTHENTIFICATION

### ➤ S'inscrire
- **Route :** `POST /auth/register`
- **Sécurité :** Publique
- **Body attendu (JSON) :**
  ```json
  {
    "username": "Thomas",
    "email": "thomas@mail.com",
    "password": "monmotdepasse"
  }
  ```
- **Réponse succès (201) :** `{"message": "Utilisateur créé avec succès !", "userId": 1}`

### ➤ Se connecter (Login)
- **Route :** `POST /auth/login`
- **Sécurité :** Publique
- **Body attendu (JSON) :**
  ```json
  {
    "email": "thomas@mail.com",
    "password": "monmotdepasse"
  }
  ```
- **Réponse succès (200) :** Vous devez sauvegarder le `token` (ex: dans le `localStorage` ou un State React).
  ```json
  {
    "message": "Connexion réussie !",
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "username": "Thomas" }
  }
  ```

---

## 2️⃣ POINTS D'EAU & TOILETTES (Locations)

*⚠️ Note importante : Dans les réponses JSON, les clés correspondent à la BDD (ex: `loc_latitude` au lieu de `latitude`).*

### ➤ Récupérer tous les points (Pour la Carte)
- **Route :** `GET /locations`
- **Sécurité :** 🔒 Requis (Bearer Token)
- **Filtres (Optionnel) :** Vous pouvez filtrer par type via l'URL (`?type=toilet` ou `?type=fountain`).
  *Exemple : `GET /locations?type=fountain`*
- **Réponse succès (200) :** Un tableau contenant les lieux.
  ```json
  [
    {
      "loc_id": 1,
      "loc_latitude": 48.8566,
      "loc_longitude": 2.3522,
      "loc_type": "fountain",
      "loc_desc": "Super fontaine",
      "loc_available": true
    }
  ]
  ```

### ➤ Ajouter un point
- **Route :** `POST /locations`
- **Sécurité :** 🔒 Requis (Bearer Token)
- **Body attendu (JSON) :**
  ```json
  {
    "latitude": 48.8566,
    "longitude": 2.3522,
    "type": "fountain", 
    "description": "Fontaine Wallace"
  }
  ```
  *(Le `type` doit être obligatoirement "fountain" ou "toilet")*

### ➤ Détails d'un point (Fiche du lieu + Note moyenne)
- **Route :** `GET /locations/:id` *(ex: `/locations/1`)*
- **Sécurité :** Publique
- **Réponse succès (200) :**
  ```json
  {
    "locationDetails": {
      "loc_id": 1,
      "loc_type": "fountain",
      "reviews": [
        {
          "r_rating": 4,
          "r_comment": "Eau fraîche",
          "users": { "u_name": "Thomas" }
        }
      ]
    },
    "totalReviews": 1,
    "averageRating": 4.0
  }
  ```

---

## 3️⃣ SYSTÈME D'AVIS (Reviews)

### ➤ Ajouter une note / un commentaire
- **Route :** `POST /reviews`
- **Sécurité :** 🔒 Requis (Bearer Token)
- **Règles Métier appliquées par le Backend :**
  1. 🚨 L'utilisateur **doit être à moins de 300 mètres** du point d'eau (Erreur 403 sinon).
  2. 📆 L'utilisateur ne peut noter un même point qu'**une seule fois par jour** (Erreur 403 sinon).
  3. 🎮 L'utilisateur gagne automatiquement +10 points de score à chaque avis valide !
- **Body attendu (JSON) :** 
  *Vous DEVEZ m'envoyer la position GPS actuelle de l'utilisateur pour que je vérifie la règle des 300m.*
  ```json
  {
    "locationId": 1,
    "rating": 5,
    "comment": "Très propre",
    "userLat": 48.8568,
    "userLong": 2.3524
  }
  ```

---

## 4️⃣ GAMIFICATION (Leaderboard)

### ➤ Récupérer le classement des meilleurs contributeurs
- **Route :** `GET /users/leaderboard`
- **Sécurité :** Publique
- **Réponse succès (200) :** Le Top 10 des utilisateurs triés par score.
  ```json
  [
    {
      "u_id": 1,
      "u_name": "Thomas",
      "u_score": 120
    },
    {
      "u_id": 2,
      "u_name": "Marie",
      "u_score": 50
    }
  ]
  ```

---
*N'hésitez pas si vous avez des questions sur l'intégration ou si vous rencontrez des erreurs "CORS" au moment de relier le Front au Back ! Bon code ! 🚀*

***
