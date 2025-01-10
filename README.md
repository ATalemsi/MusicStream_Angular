
# MusicStream 🎵

MusicStream est une application web de streaming musical développée avec Angular, permettant aux utilisateurs de gérer et écouter leur musique locale avec une interface moderne et intuitive.

## 🌟 Fonctionnalités

### Gestion des Tracks
- ✨ Système CRUD complet avec NgRx
- 📝 Métadonnées complètes (titre, artiste, description, etc.)
- 🏷️ Catégorisation musicale
- 🖼️ Support des images de couverture
- ⏱️ Calcul automatique de la durée

### Lecteur Audio
- ▶️ Contrôles de lecture (play, pause, next, previous)
- 🔊 Contrôle du volume
- 📊 Barre de progression
- 🎯 Gestion d'état avancée avec NgRx

### Interface Utilisateur
- 📚 Bibliothèque musicale avec recherche
- 🎵 Page détaillée par track
- 🎨 Design moderne et responsive
- 🌓 Support du mode sombre/clair

## 🛠️ Technologies Utilisées

- **Frontend**: Angular 17+
- **State Management**: NgRx
- **Storage**: IndexedDB
- **Tests**: Jasmine
- **Containerisation**: Docker
- **Styles**: SCSS/Tailwind CSS

## 📋 Prérequis

- Node.js (v18+)
- Angular CLI
- Docker (optionnel)

## 🚀 Installation

1. Cloner le repository
```bash
git clone https://github.com/ATalemsi/musicstream.git
cd musicstream
```

2. Installer les dépendances


```shellscript
npm install
```

3. Lancer l'application en développement


```shellscript
ng serve
```

4. Ouvrir [http://localhost:4200](http://localhost:4200) dans votre navigateur


## 🐳 Docker

1. Construire l'image


```shellscript
docker build -t musicstream .
```

2. Lancer le conteneur


```shellscript
docker run -p 4200:80 musicstream
```

## 📝 Spécifications Techniques

### Gestion des Fichiers

- **Formats audio supportés**: MP3, WAV, OGG
- **Taille maximale**: 15MB
- **Formats image supportés**: PNG, JPEG
- **Stockage**: IndexedDB (audio + métadonnées)


### Validations

- Titre: max 50 caractères
- Description: max 200 caractères
- Validation des formats de fichiers
- Gestion des erreurs de upload/stockage


### États du Lecteur

- Playing
- Paused
- Buffering
- Stopped
- Loading
- Error
- Success


## 🧪 Tests

Lancer les tests unitaires:

```shellscript
ng test
```

## 📁 Structure du Projet

```plaintext
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── store/
│   ├── features/
│   │   ├── library/
│   │   └── player/
│   ├── shared/
│   └── app.component.ts
└── assets/
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request


## 📄 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ✨ Remerciements

- Angular Team
- NgRx Team
- Tous les contributeurs


## 📞 Contact

Votre Nom - [@votre_twitter](https://twitter.com/votre_twitter)

Lien du projet: [https://github.com/votre-username/musicstream](https://github.com/votre-username/musicstream)

```plaintext

```
