# 🎨 Frontend Mistral-Gagnant

Interface utilisateur de Mistral-Gagnant construite avec Nuxt 3, Vuetify et Tailwind CSS. Cette application fournit une expérience utilisateur élégante et intuitive pour interagir avec les modèles LLM et le système RAG.

## 📋 Structure de l'application

```
front/
├── app/
│   ├── components/       # Composants Vue basés sur Atomic Design
│   │   ├── atoms/        # Éléments UI de base (boutons, inputs, etc.)
│   │   ├── molecules/    # Combinaisons d'atoms (champs de formulaire, etc.)
│   │   ├── organisms/    # Blocs fonctionnels (chat, navigation, etc.)
│   │   └── common/       # Composants non-métier ou utilitaires
│   └── pages/            # Pages de l'application
├── assets/               # Ressources statiques (images, fonts, etc.)
├── services/             # Services pour les appels API et la logique métier
│   ├── api/              # Clients API pour le module core
│   ├── llm/              # Services d'interaction avec les LLMs
│   └── chat/             # Gestion des conversations
├── shared/               # Code partagé (types, utilitaires, etc.)
├── public/               # Fichiers publics statiques
├── server/               # Middlewares et API routes Nuxt
└── nuxt.config.ts        # Configuration Nuxt
```

## ⚙️ Configuration

1. **Variables d'environnement**

Copiez le fichier `.env.exemple` en `.env` et configurez les variables suivantes :

```
NUXT_PUBLIC_API_BASE_URL=http://localhost:8000  # URL de l'API core
NUXT_PUBLIC_SUPABASE_URL=votre_url_supabase     # URL de Supabase
NUXT_PUBLIC_SUPABASE_KEY=votre_clé_supabase     # Clé publique Supabase
NUXT_PUBLIC_DEFAULT_MODEL=mistral               # Modèle LLM par défaut
```

## 🚀 Installation et démarrage

### Développement local

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`.

### Production

```bash
# Construction pour la production
npm run build

# Démarrage en production
npm run start
```

### Docker

Un Dockerfile est fourni pour déployer l'application en production :

```bash
# Construction de l'image
docker build -t mistral-gagnant-front .

# Démarrage du conteneur
docker run -p 3000:3000 mistral-gagnant-front
```

## 🎨 Système de design

### Atomic Design

Le frontend suit l'approche Atomic Design pour l'organisation des composants :

- **Atoms** : Éléments UI fondamentaux (boutons, champs, icônes)
- **Molecules** : Combinaisons d'atomes formant des composants fonctionnels simples
- **Organisms** : Assemblages complexes formant des sections complètes de l'interface

### Theming Vuetify + Tailwind

L'application utilise une combinaison de Vuetify et Tailwind CSS :

- Vuetify pour les composants complexes (dialogs, navigation, etc.)
- Tailwind pour les styles utilitaires et la personnalisation rapide

Toutes les couleurs sont définies dans le thème centralisé (`tailwind.config.ts`) et les classes de couleur Vuetify (`bg-primary`, `text-secondary`, etc.) sont privilégiées pour maintenir la cohérence.

## 🧩 Fonctionnalités principales

### Interface de chat

L'interface de chat permet :
- Conversations fluides avec streaming de réponses
- Historique des conversations
- Sélection du modèle LLM
- Informations de contexte RAG
- Export des conversations

### Gestion des documents

Interface pour :
- Visualiser les documents dans la base de connaissances
- Ajouter de nouveaux documents
- Voir les documents similaires à la requête actuelle

### Paramètres et profil

Paramètres utilisateur pour :
- Configuration des modèles préférés
- Personnalisation de l'interface
- Gestion des clés API

## 🔧 Développement

### Création d'un nouveau composant

Pour créer un nouveau composant, suivez ces étapes :

1. Identifiez le niveau atomic approprié (atom, molecule, organism)
2. Créez un fichier `.vue` dans le dossier correspondant
3. Suivez les conventions de nommage et la structure existante
4. Utilisez les classes de couleur du thème pour la cohérence visuelle

Exemple d'un nouveau composant atom :

```vue
<template>
  <button 
    class="bg-primary text-white rounded-md px-4 py-2 hover:bg-primary-dark transition-colors"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
defineEmits(['click']);
</script>
```

### Appels API vers le module core

L'application communique avec le module core via les services API :

```typescript
// services/api/chatService.ts
import { useApiClient } from '~/services/api/client';

export function useChatService() {
  const apiClient = useApiClient();
  
  async function sendMessage(message: string, conversationId?: string) {
    return await apiClient.post('/chat', {
      message,
      conversationId
    });
  }
  
  return {
    sendMessage
  };
}
```

## 📱 Responsive design

L'interface s'adapte à différentes tailles d'écran :
- Mobile : Interface simplifiée avec navigation réduite
- Tablette : Affichage hybride
- Desktop : Interface complète avec panneaux latéraux

## Thème Tailwind CSS

Le projet utilise Tailwind CSS avec un thème personnalisé pour centraliser les couleurs et styles des composants.

### Structure des fichiers

- `tailwind.config.ts` : Configuration principale de Tailwind avec le thème défini

