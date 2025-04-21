# 🧠 Mistral-Gagnant

## À propos
Mistral-Gagnant est un assistant personnel IA conçu autour des modèles Mistral AI avec implémentation de techniques RAG (Retrieval-Augmented Generation). Le projet a été développé avec une philosophie "light" et privilégie l'utilisation locale au maximum pour un assistant personnalisé, simple et minimaliste.

## ⚡ Fonctionnalités principales
- Interface utilisateur intuitive et épurée
- Système RAG (Retrieval-Augmented Generation) pour enrichir les réponses avec des données personnelles
- Intégration avec Notion comme base de connaissances externe
- Stockage efficace des conversations et vecteurs dans Supabase
- Compatibilité avec les modèles Mistral, Hermes et Cogito via Ollama

## 🚀 Guide d'utilisation

### Prérequis
- Docker
- Base de données Notion (pour l'intégration des connaissances)
- Base de données Supabase (pour le stockage des conversations et vecteurs)
- Clé API Hugging Face (pour les embeddings)
- Ollama avec les modèles suivants installés :
  - mistral
  - hermes3
  - cogito
- Minimum 16 Go de RAM recommandé

### Installation et démarrage

1. Clonez le repository
```bash
git clone https://github.com/votre-username/mistral-gagnant.git
cd mistral-gagnant
```

2. Configurez les variables d'environnement dans les fichiers `.env` de `core/` et `front/` (voir les fichiers `.env.exemple`)

3. Lancez l'application avec Docker
```bash
docker-compose up -d
```

4. Accédez à l'interface utilisateur sur [http://localhost:3000](http://localhost:3000)

## 💻 Guide de développement

### Prérequis
- Node.js (v18+) et npm
- L'utilisation de WSL est recommandée pour le développement sur Windows
- Base de données Notion
- Base de données Supabase
- Clé API Hugging Face
- Ollama avec les modèles : mistral, hermes3, cogito, etc.

### Structure du projet
- `core/` : Package npm contenant la logique RAG et les intégrations
- `front/` : Application Nuxt 3 / Vuetify / Tailwind
- `RAG_TS/` : Implémentations et expérimentations RAG en TypeScript

### Installation pour le développement

#### Core (Module RAG)
```bash
cd core
npm install
npm run dev
```

#### Front (Interface utilisateur)
```bash
cd front
npm install
npm run dev
```

## 📚 Documentation détaillée
Pour plus d'informations sur les composants individuels du projet, consultez les documents suivants :
- [Documentation du module Core](./core/README.md)
- [Documentation du Frontend](./front/README.md)

## 🔄 Contribuer au projet
Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add some amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📝 Licence
Apache 2.0