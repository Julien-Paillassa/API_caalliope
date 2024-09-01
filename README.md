# Projet Caaliope

Bienvenue dans le projet Caaliope ! Ce projet utilise Docker Compose pour gérer plusieurs services, y compris une API Node.js, une base de données PostgreSQL et une interface PgAdmin pour gérer la base de données.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- Docker
- Docker Compose

## Configuration et Installation

### Cloner le dépôt

Clonez ce dépôt sur votre machine locale :

```bash
git clone https://github.com/votre-utilisateur projet-caaliope.git
cd projet-caaliope
```

# Démarrer les services
Pour démarrer les services, suivez ces étapes :

Lancer les services avec Docker Compose

Utilisez Docker Compose pour construire et démarrer les services. Exécutez la commande suivante dans le répertoire racine du projet :

```bash
docker compose -f docker-compose.dev.yml up --build
```

Cette commande va :

Construire l'image Docker pour l'API Node.js (api_caaliope).
Démarrer les conteneurs pour l'API, la base de données PostgreSQL (database_caaliope_dev), et PgAdmin (interface_db_caaliope_dev).
Accéder aux services

API Node.js : http://localhost:3001
PgAdmin : http://localhost:5050
Utilisez les identifiants suivants pour vous connecter à PgAdmin :

Email : caaliope.dev@gmail.com
Mot de passe : caaliope_dev*2024!

### Liaison entre PostgreSQL et PgAdmin
Pour lier PostgreSQL et PgAdmin, suivez ces étapes :

Ouvrez PgAdmin dans votre navigateur à l'adresse http://localhost:5050.
Connectez-vous avec les identifiants fournis ci-dessus.
Une fois connecté, faites un clic droit sur "Servers" dans le panneau de gauche et sélectionnez "Create" > "Server...".

Dans la fenêtre "Create - Server",<vscode_annotation details='%5B%7B%22title%22%3A%22hardcoded-credentials%22%2C%22description%22%3A%22Embedding%20credentials%20in%20source%20code%20risks%20unauthorized%20access%22%7D%5D'> allez</vscode_annotation> à l'onglet "General" et donnez un nom à votre serveur, par exemple "CaaliopeDB".

Allez à l'onglet "Connection" et remplissez les champs comme suit :
Host name/address : db
Port : 5432
Maintenance database : database_caaliope_dev
Username : caaliope
Password : caaliope_dev*2024!
Cliquez sur "Save" pour créer le serveur.
Vous devriez maintenant voir votre base de données PostgreSQL apparaître sous "Servers" dans PgAdmin.

### Exécution des Fixtures
Les fixtures sont utilisées pour préremplir la base de données avec des données initiales ou de test. Voici comment exécuter les fixtures dans votre projet :

Entrer dans le conteneur api_caaliope

Exécutez la commande suivante pour ouvrir une session interactive à l'intérieur du conteneur api_caaliope :

```bash
docker exec -it api_caaliope /bin/sh
```
#### Exécuter les fixtures

Une fois dans le conteneur, exécutez la commande suivante :

```bash
npm run fixtures
```

Cette commande exécutera le script de fixtures et remplira la base de données avec des données de test.

#### Quitter le conteneur

Pour sortir du conteneur, utilisez :

```bash
exit
```

#### Arrêter les Services
Pour arrêter tous les services, exécutez :

``` bash
docker-compose down
```

Cette commande arrêtera et supprimera tous les conteneurs, réseaux et volumes créés par docker-compose up.