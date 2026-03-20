### Mon journal de code Back end OASE

---
---
---

### Le 06/03/2026 :

C'est parti ! Très bonne nouvelle pour le changement de nom de table (`Location` au lieu de `Point`), c'est beaucoup plus clair sémantiquement et ça évite les conflits avec des mots réservés en SQL.

Puisque tu as cloné le dépôt de l'équipe Android, nous allons créer ton projet Back-end **dans un dossier séparé** à la racine de ce dépôt (ou à côté, selon votre organisation Git), pour ne pas mélanger le code Kotlin et le code Node.js.

Suis ces étapes scrupuleusement. On commence par les fondations.

---

### Étape 1 : Vérification de Node.js

Ouvre ton terminal (PowerShell, Command Prompt ou Terminal intégré à VS Code) et tape :

```bash
node -v
```

*   **Si tu vois un numéro de version** (ex: `v18.16.0` ou `v20.x.x`) : C'est bon, passe à l'étape 2.
*   **Si tu vois une erreur** ou une version très vieille (genre `v12...`) :
    1.  Va sur [nodejs.org](https://nodejs.org/).
    2.  Télécharge la version **LTS** (Long Term Support), c'est la plus stable.
    3.  Installe-la (Next, Next, Finish).
    4.  Relance ton terminal et vérifie à nouveau `node -v`.

---

### Étape 2 : Création de l'architecture du projet

On va isoler ton travail. Place-toi à la racine du projet global (là où il y a le dossier de l'appli Android) et crée ton espace :

1.  Créer le dossier du backend :
    ```bash
    mkdir oase-backend
    cd oase-backend
    ```
2.  Initialiser le projet Node.js (crée le fichier `package.json`) :
    ```bash
    npm init -y
    ```

---

### Étape 3 : Installation des outils (La Stack)

On va installer les librairies dont je t'ai parlé. On distingue les outils pour que l'appli tourne (Production) et les outils pour t'aider à coder (Développement).

**1. Les dépendances de Production (Express, Prisma, Sécurité) :**
Copie-colle cette commande :
```bash
npm install express cors dotenv @prisma/client bcryptjs jsonwebtoken
```

*   `express` : Le serveur web.
*   `cors` : Autorise l'appli Android à discuter avec ton serveur.
*   `dotenv` : Pour gérer tes variables secrètes (mots de passe BDD).
*   `@prisma/client` : L'outil qui va discuter avec MySQL.
*   `bcryptjs` & `jsonwebtoken` : Pour sécuriser les mots de passe et la connexion.

**2. Les dépendances de Développement (TypeScript, Nodemon) :**
Copie-colle cette commande :
```bash
npm install -D typescript ts-node @types/node @types/express @types/cors @types/bcryptjs @types/jsonwebtoken nodemon
```

*   `typescript` : Le langage typé.
*   `ts-node` : Permet d'exécuter du TypeScript directement sans compiler à chaque fois.
*   `@types/...` : Les dictionnaires pour que TypeScript comprenne les librairies JS.
*   `nodemon` : Redémarre ton serveur automatiquement dès que tu sauvegardes un fichier (super pratique !).

---

### Étape 4 : Configuration de TypeScript

On doit dire à TypeScript comment travailler.
Exécute cette commande pour générer le fichier de config :

```bash
npx tsc --init
```

Maintenant, ouvre le fichier `tsconfig.json` qui vient d'être créé à la racine de `oase-backend` et remplace **tout** son contenu par ceci (une config propre pour Node.js moderne) :

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

### Étape 5 : Structure des dossiers et premier serveur

C'est le moment de créer tes fichiers.

1.  À l'intérieur de `oase-backend`, crée un dossier `src`.
2.  Dans `src`, crée un fichier `index.ts`.

L'arborescence doit ressembler à ça :
```text
oase-backend/
├── node_modules/
├── src/
│   └── index.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

3.  **Le code de ton premier serveur**
    Copie ce code dans `src/index.ts` :

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Accepter les requêtes de l'extérieur
app.use(express.json()); // Comprendre le format JSON entrant

// Route de test (pour vérifier que ça marche)
app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Serveur OASE Waterfinder est en ligne !');
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
```

---

### Étape 6 : Automatiser le démarrage

Pour lancer ton serveur facilement, on va modifier le fichier `package.json`.
Ouvre `package.json`, cherche la partie `"scripts"` et remplace-la par :

```json
"scripts": {
  "start": "node dist/index.js",
  "build": "tsc",
  "dev": "nodemon src/index.ts"
},
```

---

### Étape 7 : Le Test Final 🔥

1.  Dans ton terminal (toujours dans `oase-backend`), lance :
    ```bash
    npm run dev
    ```
2.  Tu devrais voir :
    > `[nodemon] starting 'ts-node src/index.ts'`
    > `✅ Serveur démarré sur http://localhost:3000`

3.  Ouvre ton navigateur web et va sur `http://localhost:3000`.
4.  Si tu vois : **"🚀 Serveur OASE Waterfinder est en ligne !"**, c'est gagné.

---

### ⚠️ Important : Le fichier .gitignore

Si tu es dans le même dépôt Git que l'équipe Android, tu ne dois **JAMAIS** envoyer le dossier `node_modules` (trop lourd) ni tes fichiers de configuration secrets sur GitHub.

Crée un fichier nommé `.gitignore` **dans le dossier oase-backend** et mets-y ceci :

```text
node_modules
dist
.env
```

---

**Dis-moi quand c'est fait et que tu as le message "🚀 Serveur en ligne" !**
La prochaine étape sera de connecter ce serveur à la Base de Données MySQL de ton camarade via Prisma.

---
---
---

### Le 06/03/2026 :

Génial ! Ton serveur Backend est en vie. 🚀

Passons à la suite : **Connecter le serveur à la Base de Données (MySQL) avec Prisma.**

C'est une étape cruciale. Si tu as bien récupéré l'URL de connexion auprès de ton camarade (ou si tu as installé MySQL en local pour tester), on va pouvoir avancer.

---

### Étape 1 : Initialiser Prisma

Assure-toi d'être dans le dossier `oase-backend`.

1.  Lance cette commande pour créer les fichiers de configuration de Prisma :
    ```bash
    npx prisma init
    ```

    *   Cela va créer un nouveau dossier `prisma/` avec un fichier `schema.prisma`.
    *   Cela va aussi créer un fichier `.env` à la racine (s'il n'existait pas déjà).

---

### Étape 2 : Configurer la connexion BDD

1.  Ouvre le fichier `.env` qui est à la racine du projet.
2.  Tu vas voir une ligne qui ressemble à `DATABASE_URL="postgresql://..."`.
3.  Remplace-la par l'URL de connexion MySQL de ton camarade.

    *   **Si c'est une BDD en ligne (ex: PlanetScale, AWS, Azure, ou hébergée par l'école) :**
        Demande-lui l'URL exacte. Elle ressemble à ça :
        `mysql://UTILISATEUR:MOT_DE_PASSE@HOST:PORT/NOM_DE_LA_BDD`

    *   **Si c'est en local sur TON PC (via XAMPP/WAMP ou MySQL Workbench) :**
        L'URL sera sûrement :
        `DATABASE_URL="mysql://root:root@localhost:3306/oase_db"`
        *(Remplace `root` par ton user, `root` par ton mot de passe, et `oase_db` par le nom exact de la base).*

---

### Étape 3 : Définir le Schéma de Données (Les Tables)

C'est ici que tu vas décrire à Prisma comment sont structurées tes données. Ouvre le fichier `prisma/schema.prisma`.

Remplace tout son contenu par ceci (j'ai adapté avec le nom `Location` comme demandé) :

```prisma
// Configuration
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// --- Modèles (Tables) ---

model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  email     String   @unique
  password  String   // Hashé avec bcrypt
  score     Int      @default(0) // Gamification
  createdAt DateTime @default(now())
  
  // Relations
  locations Location[] // Un user peut créer plusieurs lieux
  reviews   Review[]   // Un user peut écrire plusieurs avis
}

model Location {
  id          Int      @id @default(autoincrement())
  latitude    Float
  longitude   Float
  type        String   // "WATER" ou "TOILET"
  description String?  // Optionnel
  isActive    Boolean  @default(true) // Modération
  createdAt   DateTime @default(now())

  // Relations
  createdById Int
  createdBy   User     @relation(fields: [createdById], references: [id])
  reviews     Review[]
}

model Review {
  id        Int      @id @default(autoincrement())
  rating    Int      // 1 à 5
  comment   String?
  createdAt DateTime @default(now())

  // Relations
  userId    Int
  user      User     @relation(fields: [userId], references: [id])
  locationId Int
  location  Location @relation(fields: [locationId], references: [id])

  // Contrainte unique : Un user ne peut noter un lieu qu'une seule fois (par jour si on veut, mais ici on simplifie pour commencer)
  // @@unique([userId, locationId]) <--- Décommente si tu veux empêcher le spam absolu dès le début
}
```

---

### Étape 4 : Synchroniser avec la BDD ("Push")

Maintenant que le schéma est prêt, on va demander à Prisma de créer ces tables dans la vraie base de données MySQL.

1.  Assure-toi que ton serveur MySQL est lancé (si c'est en local).
2.  Lance cette commande :

    ```bash
    npx prisma db push
    ```

    *   Si tout se passe bien, tu verras : `🚀  Your database is now in sync with your Prisma schema.`
    *   Si tu as une erreur de connexion, vérifie ton URL dans le `.env` (mot de passe, port, nom de la base).

---

### Étape 5 : Générer le Client Prisma

C'est la dernière étape de configuration. Cela va créer le code TypeScript nécessaire pour que ton serveur puisse utiliser les modèles `User`, `Location`, etc.

Lance :
```bash
npx prisma generate
```

Tu devrais voir :
`✔ Generated Prisma Client`

---

### Étape 6 : Test de connexion depuis ton serveur

Pour être sûr que ton serveur Express arrive à parler à la BDD, on va modifier `src/index.ts`.

Ajoute ce bloc de code **juste après** les imports, en haut du fichier :

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ... reste du code (app = express(), etc.)
```

Et modifie ta route de test `/` pour qu'elle essaie de compter le nombre d'utilisateurs :

```typescript
// Route de test BDD
app.get('/', async (req: Request, res: Response) => {
  try {
    // Tente de récupérer tous les users (il y en a 0 pour l'instant)
    const userCount = await prisma.user.count();
    res.json({ message: '🚀 Serveur connecté à MySQL !', userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur de connexion à la BDD' });
  }
});
```

Sauvegarde (`Ctrl+S`). Nodemon va redémarrer le serveur.
Retourne sur `http://localhost:3000`.

Si tu vois `{"message":"🚀 Serveur connecté à MySQL !","userCount":0}`, c'est **PARFAIT**.

Dis-moi si tu rencontres une erreur à l'étape du `db push` ou à la connexion !

---
Les étapes ont été changées pour adapter à la base de données de Victor
C'est parfait. Ton camarade t'a donné les plans de la maison, maintenant on va construire la maison sur ton terrain (ton PC).

Comme les fichiers SQL contiennent des noms de colonnes très spécifiques (`u_id`, `loc_latitude`, etc.) qui sont différents de ceux que je t'avais donnés (`id`, `latitude`), **nous allons changer de stratégie pour Prisma.**

Au lieu d'écrire le fichier `schema.prisma` à la main et de "pousser" vers la BDD, on va créer la BDD avec les fichiers SQL, puis demander à Prisma de **lire** la BDD pour générer le fichier tout seul. C'est la technique de **l'Introspection**.

Voici la marche à suivre pas à pas :

---

### Phase 1 : Importer la BDD dans MySQL Workbench

Tu dois exécuter les fichiers SQL dans un ordre précis (car les tables sont liées entre elles).
**Ordre impératif :** Users -> Location -> Reviews.

1.  **Oouvre MySQL Workbench** et connecte-toi à ton instance locale (`root`).
2.  **Créer la Schema (la base vide) :**
    *   Clique sur l'icône "cylindre + plus" (Create a new schema).
    *   Nomme-la : `oase_db` (ou `gogues` si tu veux respecter le nom original, mais `oase_db` est plus pro).
    *   Clique sur **Apply**, puis **Apply**, puis **Finish**.
3.  **Sélectionner la Schema :**
    *   Dans la colonne de gauche (Navigator), double-clique sur `oase_db` pour qu'il soit en **gras**.
4.  **Exécuter les scripts (Avec une petite correction indispensable) :**

    ⚠️ **Attention** : Ton camarade a mis `u_password varchar(32)`. C'est trop court pour la sécurité moderne (Bcrypt a besoin de 60 caractères). On va corriger ça à la volée.

    *   **Fichier 1 : Users**
        *   Ouvre un nouvel onglet SQL (icône page blanche avec "SQL").
        *   Copie le contenu de `gogues_users.sql`.
        *   **MODIFICATION :** Cherche la ligne `u_password varchar(32) NOT NULL,` et change `32` par `255`. -> `u_password varchar(255) NOT NULL,`
        *   Clique sur l'éclair ⚡ pour exécuter.

    *   **Fichier 2 : Location**
        *   Efface le code précédent.
        *   Copie tout le contenu de `gogues_location.sql`.
        *   Clique sur l'éclair ⚡.

    *   **Fichier 3 : Reviews**
        *   Efface le code précédent.
        *   Copie tout le contenu de `gogues_reviews.sql`.
        *   Clique sur l'éclair ⚡.

Vérifie dans la colonne de gauche, sous `oase_db` > `Tables`, tu devrais voir `users`, `location`, et `reviews`. C'est bon !

---

### Phase 2 : Configurer le fichier .env (Retour à VS Code)

Retourne dans ton projet `oase-backend` sur VS Code.

1.  Ouvre le fichier `.env`.
2.  Mets à jour l'URL avec tes infos locales :
    ```ini
    DATABASE_URL="mysql://root:TON_MOT_DE_PASSE@localhost:3306/oase_db"
    ```
    *(Remplace `TON_MOT_DE_PASSE` par celui de ton MySQL Workbench. Si tu n'en as pas mis lors de l'installation de MySQL, enlève tout après les deux points : `mysql://root:@localhost...`)*.

---

### Phase 3 : L'Introspection Prisma (La Magie 🪄)

On va demander à Prisma d'aller voir ta base de données et de réécrire le fichier `schema.prisma` pour qu'il corresponde exactement au travail de ton camarade.

1.  Dans le terminal de VS Code, lance :
    ```bash
    npx prisma db pull
    ```
    *Tu devrais voir : `✓ Introspected 3 models and wrote them into prisma/schema.prisma`*

2.  Ensuite, régénère le client TypeScript :
    ```bash
    npx prisma generate
    ```

---

### Phase 4 : Vérification et Adaptation du Code

Ouvre maintenant le fichier `prisma/schema.prisma`. Tu verras que le code a changé ! Il utilise maintenant `users`, `location`, `u_name`, etc.

Comme les noms ont changé, **ton code de test dans `index.ts` va planter** (car il cherchait `prisma.user` alors que maintenant la table s'appelle probablement `prisma.users`).

Modifie `src/index.ts` pour corriger le test :

```typescript
// ... imports

app.get('/', async (req: Request, res: Response) => {
  try {
    // Attention: Prisma a sans doute mis le nom du modèle au singulier ou pluriel selon la BDD.
    // Vérifie dans schema.prisma si le model s'appelle "users" ou "user".
    // En général avec l'introspection sur tes fichiers, ce sera "users".
    
    const userCount = await prisma.users.count(); // Note le "s" à users
    res.json({ message: '🚀 Serveur connecté à MySQL !', userCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur de connexion à la BDD' });
  }
});
```

---

### À toi de jouer !
1.  Fais les imports SQL (avec la correction du mot de passe).
2.  Configure le `.env`.
3.  Fais le `db pull` et `generate`.
4.  Lance `npm run dev` et teste `localhost:3000`.


---
---
---

À chaque début de session de code, tu devras faire ceci :
- Ouvrir VS Code (ou ton terminal).
- Aller dans le dossier du backend : cd oase-backend
- Lancer la commande magique : npm run dev

---
---
---

### Le 15/03/2026 :

Maintenant, on rentre dans le vrai code de développement métier.

Selon le Cahier des Charges (Exigence **EF1**), l'application ne peut être utilisée qu'avec un compte.
Notre première mission est donc de créer le **Système d'Authentification (Inscription et Connexion)**.

Pour garder un code propre et pro, on ne va pas tout mettre dans `index.ts`. On va séparer la logique (les Contrôleurs) et les URLs (les Routes).

Voici la marche à suivre étape par étape.

---

### Étape 1 : Préparer le terrain (Dossiers et Variables secrètes)

1. Dans ton dossier `src/`, crée deux nouveaux dossiers :
   - `controllers` (pour la logique métier)
   - `routes` (pour définir les adresses URL)

2. Ouvre ton fichier `.env` (à la racine) et ajoute une clé secrète pour générer les "badges" (Tokens JWT) de connexion :
   ```ini
   DATABASE_URL="mysql://..."
   JWT_SECRET="oase_super_secret_key_2026_!?"
   ```
   *(Ne partage jamais cette clé en vrai, c'est elle qui sécurise ton appli).*

---

### Étape 2 : Le Contrôleur d'Authentification (La Logique)

C'est ici qu'on va utiliser les noms de colonnes bizarres de ton camarade (`u_name`, `u_mail`, etc.).

Dans `src/controllers/`, crée un fichier nommé **`authController.ts`** et colle ce code :

```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// --- INSCRIPTION (REGISTER) ---
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. On récupère ce que l'appli Kotlin nous envoie
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ error: "Tous les champs sont requis." });
      return;
    }

    // 2. Vérifier si l'email existe déjà dans la DB
    const existingUser = await prisma.users.findUnique({ where: { u_mail: email } });
    if (existingUser) {
      res.status(409).json({ error: "Cet email est déjà utilisé." });
      return;
    }

    // 3. Sécuriser le mot de passe (Hachage)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Sauvegarder dans la DB (en respectant les colonnes du camarade)
    const newUser = await prisma.users.create({
      data: {
        u_name: username,
        u_mail: email,
        u_password: hashedPassword,
        u_score: 0, // Score de départ
        u_creation_date: new Date()
      }
    });

    res.status(201).json({ message: "Utilisateur créé avec succès !", userId: newUser.u_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de l'inscription." });
  }
};

// --- CONNEXION (LOGIN) ---
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // 1. Chercher l'utilisateur par son email
    const user = await prisma.users.findUnique({ where: { u_mail: email } });
    if (!user) {
      res.status(401).json({ error: "Email ou mot de passe incorrect." });
      return;
    }

    // 2. Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.u_password);
    if (!isValidPassword) {
      res.status(401).json({ error: "Email ou mot de passe incorrect." });
      return;
    }

    // 3. Créer le Token JWT (le "badge" de l'utilisateur)
    const token = jwt.sign(
      { userId: user.u_id, username: user.u_name }, 
      JWT_SECRET, 
      { expiresIn: '30d' } // Valable 30 jours
    );

    res.status(200).json({ 
      message: "Connexion réussie !", 
      token: token,
      user: { id: user.u_id, username: user.u_name }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur lors de la connexion." });
  }
};
```

---

### Étape 3 : Les Routes (Les URLs)

Il faut maintenant relier ces fonctions à des URLs web.
Dans `src/routes/`, crée un fichier nommé **`authRoutes.ts`** et colle ceci :

```typescript
import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Quand on fait un POST sur /register, ça lance la fonction register
router.post('/register', register);

// Quand on fait un POST sur /login, ça lance la fonction login
router.post('/login', login);

export default router;
```

---

### Étape 4 : Brancher le tout dans le serveur principal

Ouvre ton fichier **`src/index.ts`** (celui qu'on a fait au tout début).
On va lui dire d'utiliser nos nouvelles routes. Modifie-le pour qu'il ressemble à ça :

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes'; // <-- Ajout de l'import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Indispensable pour lire le req.body !

// --- BRANCHEMENT DES ROUTES ---
// Toutes les URLs qui commencent par /api/auth iront dans authRoutes
app.use('/api/auth', authRoutes); 

app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Serveur OASE Waterfinder est en ligne !');
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
```

---

### Étape 5 : Tester ton API (Le moment de vérité)

Maintenant, il faut tester si ça marche avant de dire à l'équipe Kotlin que c'est prêt.
Vu que ce sont des requêtes `POST`, tu ne peux pas juste taper l'URL dans ton navigateur Chrome.

Je te conseille d'utiliser une extension directement dans VS Code : **Thunder Client** (ou Postman si tu connais).

1. Dans VS Code, va dans les extensions (les petits carrés à gauche).
2. Cherche **Thunder Client** et installe-le.
3. Clique sur l'icône de l'éclair qui est apparue à gauche, puis sur **New Request**.
4. Configure la requête d'inscription :
   - Méthode : **POST**
   - URL : `http://localhost:3000/api/auth/register`
   - Va dans l'onglet **Body**, choisis **JSON**, et tape ceci :
     ```json
     {
       "username": "Thomas",
       "email": "thomas@sportsman.com",
       "password": "motdepassesupersecret"
     }
     ```
5. Clique sur **Send**.

Si tu obtiens un message `{"message": "Utilisateur créé avec succès !"...}` en vert (Status 201), **félicitations, tu viens de coder ton premier système d'authentification complet et sécurisé !** 🥳

Ensuite on s'attaquera au système de Points d'eau.

---
---
---

C'est fantastique ! 🎉 Tu as une base solide. 

Maintenant que les utilisateurs peuvent s'inscrire et se connecter, on va s'attaquer au cœur de l'application : **Les Points d'eau et les Toilettes (Locations)**.

Avant de coder, je dois te signaler **un problème critique dans la base de données de ton camarade**.
Dans son fichier SQL, il a écrit :
`loc_longitude int NOT NULL, loc_latitude int NOT NULL`
**C'est une erreur !** Les coordonnées GPS sont des nombres à virgule (ex: `48.8566`). Si on utilise un `int` (entier), MySQL va arrondir à `48` ! Adieu la précision demandée dans le CdC (< 50 mètres).
👉 **Il faut changer ces colonnes en `FLOAT` ou `DECIMAL(10,8)` dès que possible.** 

Pour ne pas te bloquer, on va coder le backend dès maintenant (Prisma gérera le type actuel, mais la précision sera cassée tant qu'il n'aura pas corrigé).

Voici le plan :
1. Créer un **Middleware** (le "videur" de boîte de nuit) qui vérifiera si l'utilisateur est bien connecté avant d'ajouter un point.
2. Créer le **Contrôleur** pour Ajouter et Récupérer les points.
3. Créer les **Routes**.

---

### Étape 1 : Le Middleware de Sécurité (Le "Videur")

On veut s'assurer que seul un utilisateur avec un Token valide (généré lors du login) peut agir.

1. Dans `src/`, crée un dossier **`middlewares`**.
2. Dedans, crée un fichier **`authMiddleware.ts`** et colle ce code :

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// On crée une interface personnalisée pour ajouter "user" à la requête
export interface AuthRequest extends Request {
  user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // 1. Récupérer le header "Authorization" envoyé par l'appli Kotlin
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: "Accès refusé. Token manquant." });
    return;
  }

  // 2. Extraire le token (on enlève le mot "Bearer ")
  const token = authHeader.split(' ')[1];

  try {
    // 3. Vérifier si le token est valide (pas expiré, pas falsifié)
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 4. On attache les infos de l'utilisateur (userId) à la requête
    req.user = decoded;
    
    // 5. On laisse passer à la suite (le contrôleur)
    next();
  } catch (error) {
    res.status(403).json({ error: "Token invalide ou expiré." });
  }
};
```

---

### Étape 2 : Le Contrôleur des Lieux (Locations)

On va permettre à l'application Kotlin de récupérer tous les points pour les afficher sur la carte, et d'en ajouter de nouveaux.

1. Dans `src/controllers/`, crée **`locationController.ts`** :

```typescript
import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// --- AJOUTER UN POINT D'EAU / TOILETTE ---
export const addLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { latitude, longitude, type, description } = req.body;
    const userId = req.user.userId; // Récupéré grâce au middleware !

    // Validation basique
    if (!latitude || !longitude || !type) {
      res.status(400).json({ error: "Latitude, longitude et type sont requis." });
      return;
    }

    // Création dans la base de données (avec les noms de colonnes de ton camarade)
    const newLocation = await prisma.location.create({
      data: {
        loc_latitude: parseFloat(latitude), 
        loc_longitude: parseFloat(longitude),
        loc_type: type, // Doit être 'toilet' ou 'fountain' selon le SQL
        loc_desc: description || null,
        loc_available: true, // Disponible par défaut
        loc_created_by: userId,
        loc_creation_date: new Date()
      }
    });

    res.status(201).json({ message: "Lieu ajouté avec succès !", location: newLocation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de l'ajout du lieu." });
  }
};

// --- RÉCUPÉRER TOUS LES POINTS (Pour la Carte) ---
export const getLocations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // On ne récupère que les points disponibles (loc_available = true)
    const locations = await prisma.location.findMany({
      where: { loc_available: true }
    });

    res.status(200).json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des lieux." });
  }
};
```

---

### Étape 3 : Les Routes des Lieux

1. Dans `src/routes/`, crée **`locationRoutes.ts`** :

```typescript
import { Router } from 'express';
import { addLocation, getLocations } from '../controllers/locationController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

// On place verifyToken AVANT le contrôleur. 
// Si le token est mauvais, verifyToken bloque tout. Si c'est bon, ça passe à getLocations/addLocation.

// GET /api/locations -> Récupérer les points (il faut être connecté)
router.get('/', verifyToken, getLocations);

// POST /api/locations -> Ajouter un point (il faut être connecté)
router.post('/', verifyToken, addLocation);

export default router;
```

---

### Étape 4 : Brancher au Serveur Principal

Ouvre ton **`src/index.ts`** et ajoute les deux lignes marquées d'une flèche `// <---` :

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import locationRoutes from './routes/locationRoutes'; // <--- Importer les routes locations

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes); // <--- Brancher l'URL /api/locations

app.get('/', (req: Request, res: Response) => {
  res.send('🚀 Serveur OASE Waterfinder est en ligne !');
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
```

---

### Étape 5 : Le Test avec Thunder Client !

C'est là que tu vas voir la puissance de ce que tu viens de coder.

**Test 1 : Essayer d'ajouter un point sans être connecté**
1. Va dans Thunder Client, fais une requête **POST** sur `http://localhost:3000/api/locations`
2. Clique sur Send.
3. 👉 *Résultat attendu : Erreur 401 "Accès refusé. Token manquant."* (Le videur a fait son job !)

**Test 2 : Le vrai ajout**
1. Refais une requête de **Login** (comme à l'étape précédente) pour l'utilisateur "Thomas".
2. Dans la réponse, copie la longue chaîne de caractères du `"token"`.
3. Retourne sur ta requête d'ajout de lieu (`POST /api/locations`).
4. Va dans l'onglet **Headers**.
   - Dans "Header", écris : `Authorization`
   - Dans "Value", écris : `Bearer TON_TOKEN_COPIÉ_ICI` (attention à l'espace après Bearer).
5. Va dans l'onglet **Body** (JSON) et ajoute les infos de la fontaine :
   ```json
   {
     "latitude": 48.8566,
     "longitude": 2.3522,
     "type": "fountain",
     "description": "Fontaine Wallace près du parc"
   }
   ```
6. Clique sur **Send**.
7. 👉 *Résultat attendu : Status 201 "Lieu ajouté avec succès !"*

Teste bien l'ajout et le fait de récupérer la liste (`GET /api/locations` avec le header Authorization). Si tout est bon, on aura fini la partie la plus standard, et on pourra attaquer **LA vraie difficulté métier de ton projet : Le système d'Avis avec le calcul des 300 mètres !**

---
---
---

### 2 corrections :

Commençons par corriger la BDD, car cela pourrait bloquer tes tests d'ajout de lieux de toute façon.

---

### Problème 1 : Corriger la BDD (Passer de INT à FLOAT)

Les coordonnées GPS ont besoin de beaucoup de chiffres après la virgule. On va dire à MySQL de changer le type des colonnes `loc_latitude` et `loc_longitude`.

**1. Dans MySQL Workbench :**
1. Ouvre un nouvel onglet SQL (l'icône avec la petite page blanche "SQL").
2. Copie-colle exactement ce code :
   ```sql
   USE oase_db; /* Ou le nom de ta base si c'est gogues */
   ALTER TABLE location MODIFY loc_latitude DOUBLE NOT NULL;
   ALTER TABLE location MODIFY loc_longitude DOUBLE NOT NULL;
   ```
3. Clique sur l'éclair ⚡ pour exécuter.
*(En bas dans la console "Output" de Workbench, tu devrais voir un feu vert t'indiquant que la table a été modifiée).*

**2. Mettre à jour Prisma (dans VS Code) :**
Maintenant que la BDD a changé, ton backend doit être mis au courant.
Dans le terminal de VS Code (fais `Ctrl+C` pour arrêter ton serveur temporairement) :
1. Tape : `npx prisma db pull` *(pour lire la nouvelle structure)*
2. Tape : `npx prisma generate` *(pour mettre à jour le code TypeScript)*

Voilà ! Ton application est maintenant capable de stocker des coordonnées GPS réelles.

---

### Problème 2 : L'erreur "403 Token invalide ou expiré"

Cette erreur signifie que la fonction `jwt.verify()` a échoué. Il y a 3 causes principales, on va les vérifier une par une :

**Cause A : Le serveur n'a pas lu le fichier `.env`**
Quand on modifie le fichier `.env` (comme on l'a fait pour ajouter `JWT_SECRET`), le serveur Node.js ne le prend parfois pas en compte automatiquement.
👉 **Solution :** Si tu avais coupé ton serveur pour la commande Prisma juste au-dessus, relance-le avec `npm run dev`. S'il tournait encore, coupe-le (`Ctrl+C`) et relance-le.

**Cause B : Problème de copier-coller du Token**
Dans Thunder Client, un espace en trop ou des guillemets ruinent le token.
👉 **Solution :**
1. Refais un `POST /api/auth/login` pour avoir un token tout neuf.
2. Copie **uniquement** le texte du token (sans les guillemets `" "` qui l'entourent dans la réponse JSON).
   *(Exemple : copie `eyJhbGciOiJIUz...` mais pas `"eyJhbGciOiJIUz..."`)*

**Cause C : Mauvaise configuration du Header dans Thunder Client**
Vérifie bien comment tu l'as écrit dans l'onglet **Headers** de ta requête `POST /api/locations` :
- Case de gauche (Header) : `Authorization` *(Attention à la majuscule et l'orthographe)*
- Case de droite (Value) : `Bearer eyJhbGciOiJI...` *(Il faut impérativement le mot "Bearer", suivi d'**un seul espace**, suivi de ton token)*.

---

### Refais le Test 2 !

1. Assure-toi que le serveur tourne (`npm run dev`).
2. Log-toi, récupère le token.
3. Va sur ta requête d'ajout de lieu, mets bien le header `Authorization`.
4. Envoie le Body (avec tes latitude/longitude à virgule).

Dis-moi si tu obtiens bien le `201 Created` cette fois-ci ! Si c'est bon, on attaque le gros morceau du projet (la règle des 300m) !

---

### Le Test 2 :

### Étape 1 : Faire la requête de Connexion (Login)

Puisque tu as déjà *inscrit* Thomas (Register), son compte existe dans ta base de données. Maintenant, il doit se *connecter* (Login) pour prouver qui il est et obtenir son "badge" (le Token).

1. Ouvre **Thunder Client** et crée une **New Request**.
2. Règle la méthode sur **POST**.
3. Mets l'URL : `http://localhost:3000/api/auth/login`
4. Va dans l'onglet **Body**, clique sur **JSON**, et tape les identifiants que tu avais utilisés pour l'inscrire :
   ```json
   {
     "email": "thomas@sportsman.com",
     "password": "motdepassesupersecret"
   }
   ```
5. Clique sur **Send**.

### Étape 2 : Trouver et copier le Token

Regarde la fenêtre de **réponse** (à droite dans Thunder Client). Si tout va bien, le serveur (grâce au code qu'on a fait dans `authController.ts`) va te répondre un JSON qui ressemble exactement à ça :

```json
{
  "message": "Connexion réussie !",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiVGhvbWFzIiwiaWF0IjoxNzEzNDU2Nzg5LCJleHAiOjE3MTYwNDg3ODl9.Xyz123Abc456Def789Ghi...",
  "user": {
    "id": 1,
    "username": "Thomas"
  }
}
```

👉 **Le fameux Token, c'est la très longue suite de lettres et de chiffres** qui commence généralement par `eyJ...` (la valeur associée à la clé `"token"`).
1. Sélectionne **uniquement le texte du token** (sans les guillemets `" "` au début et à la fin).
2. Fais **Ctrl+C** (Copier).

---

### Étape 3 : Utiliser le Token pour ajouter un point (Test 2)

Maintenant, tu es "Thomas" et tu as ton badge en main. Tu vas le présenter au "videur" (notre middleware) pour avoir le droit d'ajouter un point d'eau.

1. Crée une **NOUVELLE requête** dans Thunder Client (ou modifie celle qui avait échoué).
2. Règle sur **POST**.
3. Mets l'URL : `http://localhost:3000/api/locations`
4. 👉 **Le secret est ici :** Va dans l'onglet **Headers** (juste à côté de Body).
   - Dans la colonne "Header", tape exactement : `Authorization`
   - Dans la colonne "Value", tape le mot `Bearer`, mets **un espace**, puis **colle ton Token** (Ctrl+V).
   - *Ça doit ressembler à ça : `Bearer eyJhbGciOiJIUzI...`*
5. Va dans l'onglet **Body** (JSON) et mets les coordonnées (remarque qu'on met des nombres à virgule maintenant, vu qu'on a réparé la BDD !) :
   ```json
   {
     "latitude": 48.8566,
     "longitude": 2.3522,
     "type": "fountain",
     "description": "Super fontaine à Paris"
   }
   ```
6. Clique sur **Send**.

Si tu as bien mis l'espace après `Bearer` et que ton serveur tourne, tu vas voir le magnifique message :
`Status 201 : Lieu ajouté avec succès !` 🟢

---
---
---

### Le 20/03/2026 :


