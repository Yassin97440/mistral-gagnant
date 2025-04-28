# 🔍 Module Core (RAG)

Ce module constitue le cœur de la fonctionnalité RAG (Retrieval-Augmented Generation) de Mistral-Gagnant. Il gère la création d'embeddings, la récupération de contextes pertinents et l'interaction avec les différents LLMs.

## 📋 Structure du module

```
core/
├── src/
│   ├── agents/         # Implémentations des agents conversationnels
│   ├── data/           # Connexions aux bases de données (Supabase, Chroma)
│   ├── graph/          # Création des graphs pour les agents
│   ├── LLM/            # Intégrations avec les modèles (Mistral, Ollama)
│   ├── processing/     # Traitement des documents (Notion, embeddings, storage)
│   ├── tools/          # Création des tools pour les agents
│   ├── types/          # Définitions de types TypeScript
│   ├── utils/          # Fonctions utilitaires
│   └── index.ts        # Point d'entrée principal du module
├── tests/             # Tests unitaires et d'intégration
└── dist/              # Code compilé (généré)
```

## ⚙️ Configuration

1. **Variables d'environnement**

Copiez le fichier `.env.exemple` en `.env` et configurez les variables suivantes :

```
HUGGING_FACE_API_KEY=votre_clé_hf     # Clé API Hugging Face pour les embeddings
LANGSMITH_TRACING=true                # Activer le traçage LangSmith (optionnel)
LANGSMITH_API_KEY=votre_clé_langsmith # Clé API LangSmith (optionnel)
MISTRAL_API_KEY=votre_clé_mistral     # Clé API Mistral (si utilisation de l'API)
NOTION_API_KEY=votre_clé_notion       # Clé API Notion
NOTION_DATABASE_ID=votre_db_id        # ID de la base de données Notion
SUPABASE_PRIVATE_KEY=votre_clé_supabase # Clé privée Supabase
SUPABASE_URL=votre_url_supabase       # URL de votre instance Supabase
```

2. **Modèles Ollama**

Assurez-vous d'avoir les modèles requis installés via Ollama :

```bash
ollama pull mistral
ollama pull hermes3
ollama pull cogito
```

## 🚀 Utilisation

### En tant que dépendance

Le module core peut être utilisé comme dépendance dans d'autres projets :

```bash
npm install @mistral-gagnant/core
```

Exemple d'utilisation :

```typescript
import { ChatGraph, updateRetrieverConfig } from "@mistral-gagnant/core";

//mise à jour de la configuration du retriever
updateRetrieverConfig(chatParams.credentials);

//création du graph
const graphManager = ChatGraph.getInstance(chatParams.model || "mistral", chatParams.temperature || 0.1);
const graph = graphManager.getGraph();

//utilisation du graph
const response = await graph.invoke({ messages: lastMessage as Messages, history: chatParams.activeChat.messages }, memoryConfig);
```
Voir le fichier `./front/services/Chat/Main.ts` pour voir plus d'exemples.

### En développement local

1. Installer les dépendances :
```bash
npm install
```

2. Lancer en mode développement :
```bash
npm run dev
```

3. Construire le package :
```bash
npm run build
```

4. Exécuter les tests :
```bash
npm test
```

## 🧩 Fonctionnalités principales

### Gestion des embeddings

Le module utilise les modèles Sentence Transformers via l'API Hugging Face pour générer des embeddings de haute qualité pour les documents et les requêtes utilisateur.

### Intégration Notion

L'intégration avec Notion permet de charger automatiquement vos bases de connaissances et de les rendre disponibles pour le RAG.

### Stockage vectoriel

Le module prend en charge deux types de stockage vectoriel :
- **Supabase** pour un stockage persistant des embeddings et des métadonnées
- Prochainement : **ChromaDB** pour un stockage local et des recherches rapides

### Agents conversationnels

Plusieurs agents sont disponibles :
- **ChatAgent** - Agent de conversation standard avec RAG
- Prochainement : **ToolAgent** - Agent capable d'utiliser des outils externes (recherche web, recherche contextuelle, etc.)

## 🔧 Développement

### Ajouter un nouveau loader

Pour ajouter un nouveau chargeur de documents (par exemple, pour intégrer une nouvelle source de données) :

1. Créez une nouvelle classe dans `src/loaders/` qui implémente l'interface `DocumentLoader`
2. Implémentez la méthode `loadDocuments()` qui renvoie un tableau de `Document`
3. Exportez votre loader depuis `src/loaders/index.ts`

### Ajouter un nouveau modèle LLM

Pour intégrer un nouveau modèle de langage :

1. Créez un nouveau wrapper dans `src/llm/` qui étend la classe `BaseLLM`
2. Implémentez les méthodes d'appel et de streaming
3. Ajoutez le modèle à la factory LLM dans `src/llm/llmFactory.ts`

## 📊 Évaluation des performances

Des scripts d'évaluation sont disponibles dans `tests/evaluation/` pour mesurer les performances du système RAG sur différents jeux de données et avec différentes configurations. 