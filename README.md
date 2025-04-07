# 🧠 Mistral-Gagnant

## À propos
Un projet d'assistant personnel IA utilisant **Mistral AI** avec implémentation de techniques RAG (Retrieval-Augmented Generation) et fine-tuning.

## 📚 Structure du projet
- **front/** : Application frontend basée sur Nuxt.js et Vuetify
- **RAG_TS/** : Implémentation du système RAG en TypeScript avec LangChain
- **python_experimentation/** : Notebooks d'exploration et visualisation des embeddings

## 🚀 Guide de démarrage

### Prérequis
- Node.js (version récente)
- NPM/Yarn
- Clés API requises:
  - Mistral AI
  - Hugging Face (pour les embeddings)
  - Notion (optionnel, pour l'intégration)

### Configuration des variables d'environnement
- Pour le frontend: Copier `.env.exemple` vers `.env` dans le dossier `front/`
- Pour le RAG: Copier `varEnv.exemple.ts` vers `varEnv.ts` dans le dossier `RAG_TS/`

### Frontend (Nuxt.js)
```bash
cd front
npm install
npm run dev
```

### Module RAG
```bash
cd RAG_TS
npm install
npm start
docker pull chromadb/chroma:0.6.3 
```

## 🔧 Technologies utilisées
- **LLM**: Mistral AI API
- **RAG**: LangChain.js, ChromaDB
- **Embeddings**: Sentence Transformers via Hugging Face
- **Frontend**: Nuxt.js, Vuetify, TailwindCSS
- **Intégrations**: API Notion

## 📊 Expérimentations Python
Le dossier `python_experimentation/` contient plusieurs notebooks:
- `embeddings_visualizer.ipynb`: Visualisation des embeddings
- `run-local-llm.ipynb`: Expérimentations avec LLM local
- `auto-rag.ipynb` et `poc-rag.ipynb`: Exploration des techniques RAG

## 📝 Licence
Apache 2.0