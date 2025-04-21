<template>
  <v-app bg-color="interface-bg">
    <!-- Même app bar que Default.vue -->
    <v-app-bar flat color="transparent" class="glass-panel px-4">
      <div class="d-flex align-center">
        <div class="logo-container me-3">
          <img src="/logo.svg" alt="Logo">
        </div>
        <h1 class="text-h6 font-weight-medium tech-text">Mistral Gagnant</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn variant="text" class="mx-2 rag-button glow-hover" :to="'/'" prepend-icon="mdi-chat-processing">
        CHAT
      </v-btn>


      <v-btn icon variant="text" class="mx-1 glow-hover text-primary">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-btn icon variant="text" class="mx-1 glow-hover text-primary">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
      <v-btn icon variant="text" class="mx-1 glow-hover text-primary" @click="settingsDialogOpen = true">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
    <SettingsDialog v-model:openDialog="settingsDialogOpen" />


    <v-navigation-drawer location="left" class="side-navigation rag-panel text-primary ">
      <v-list-item prepend-icon="mdi-database-settings" title="RAG" to="/RAG"></v-list-item>
    </v-navigation-drawer>

    <v-main class="bg-interface-bg min-h-screen">
      <v-container fluid class=" pa-0">


        <div class="main-content pa-0">
          <div class="rag-border"></div>
          <slot />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">

const settingsDialogOpen = ref(false);


</script>

<style scoped>
.bg-interface-bg {
  background-color: rgb(var(--v-theme-interface-bg));
  background-image:
    radial-gradient(circle at 15% 50%, rgba(var(--v-theme-accent), 0.05) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(var(--v-theme-accent), 0.03) 0%, transparent 25%);
}

.glass-panel {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-interface-bg), 0.7);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
  position: static;
  top: 0;
  z-index: 10;
}

.rag-panel {
  background: rgba(var(--v-theme-interface-bg), 0.9);
  border-right: 1px solid rgba(var(--v-theme-primary), 0.15);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: sticky;
  overflow: hidden;
}

.rag-panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(var(--v-theme-accent), 0.2) 50%, transparent);
}

.rag-nav-button {
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(var(--v-theme-accent), 0.3);
  transition: all 0.5s ease;
}

.rag-nav-button:hover {
  box-shadow: 0 0 15px rgba(var(--v-theme-accent), 0.5);
}


.main-content {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.rag-border {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(var(--v-theme-accent), 0.1), transparent);
}


.rag-section-header {
  display: flex;
  align-items: center;
}

.rag-line {
  flex: 1;
  height: 1px;
  background: rgba(var(--v-theme-accent), 0.15);
}

.tech-text {
  letter-spacing: 0.5px;
  position: relative;
  color: rgb(var(--v-theme-primary));
}

.accent-dot {
  background: rgb(var(--v-theme-accent));
  box-shadow: 0 0 10px rgba(var(--v-theme-accent), 0.5);
}

.core-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.5);
  animation: pulse 2s infinite;
}

.reactive-logo {
  filter: drop-shadow(0 0 3px rgba(var(--v-theme-primary), 0.5));
}

.pulse {
  animation: pulse 2s infinite;
}

.glow-hover:hover {
  filter: drop-shadow(0 0 2px rgba(var(--v-theme-primary), 0.7));
}

.rag-button {
  color: rgb(var(--v-theme-primary));
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  background: rgba(var(--v-theme-primary), 0.1);
  position: relative;
  overflow: hidden;
}

.rag-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
      transparent,
      rgba(var(--v-theme-primary), 0.2),
      transparent);
  transition: left 0.5s ease;
}

.rag-button:hover::before {
  left: 100%;
}

.rag-button:hover {
  background: rgba(var(--v-theme-primary), 0.15);
  box-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.3);
}

@keyframes pulse {
  0% {
    opacity: 0.7;
    filter: drop-shadow(0 0 2px rgba(var(--v-theme-accent), 0.5));
  }

  50% {
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(var(--v-theme-accent), 0.8));
  }

  100% {
    opacity: 0.7;
    filter: drop-shadow(0 0 2px rgba(var(--v-theme-accent), 0.5));
  }
}
</style>