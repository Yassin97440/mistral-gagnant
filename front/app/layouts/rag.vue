<template>
  <v-app bg-color="interface-bg">
    <!-- Même app bar que Default.vue -->
    <v-app-bar flat color="transparent" class="glass-panel px-4">
      <div class="d-flex align-center">
        <div class="logo-container me-3">
          <svg width="32" height="32" viewBox="0 0 32 32" class="reactive-logo">
            <circle cx="16" cy="16" r="14" fill="transparent" stroke="rgba(var(--v-theme-primary), 0.3)"
              stroke-width="1" />
            <circle cx="16" cy="16" r="10" fill="transparent" stroke="rgba(var(--v-theme-primary), 0.5)"
              stroke-width="1" />
            <circle cx="16" cy="16" r="6" fill="rgb(var(--v-theme-primary))" class="pulse" />
            <path d="M12 16 L16 16 L20 16" stroke="white" stroke-width="2" />
            <path d="M16 12 L16 20" stroke="white" stroke-width="2" />
          </svg>
        </div>
        <h1 class="text-h6 font-weight-medium tech-text">Mistral Gagnant</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn variant="text" 
             class="mx-2 rag-button glow-hover" 
             :to="'/'" 
             prepend-icon="mdi-chat-processing">
        CHAT
      </v-btn>


      <v-btn icon variant="text" class="mx-1 glow-hover text-primary">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-btn icon variant="text" class="mx-1 glow-hover text-primary">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer  location="left" class="side-navigation rag-panel text-primary">
      <v-list-item prepend-icon="mdi-key" title="Mes clés API" to="/AccessConfig"></v-list-item>
      <v-list-item prepend-icon="mdi-database-settings" title="RAG" to="/RAG"></v-list-item>
    </v-navigation-drawer>

    <v-main class="bg-interface-bg max-h-screen">
      <v-container fluid class="fill-height pa-0">
        <v-row no-gutters class="fill-height">

            <!-- Navbar latérale spécifique à RAG -->
            <!-- <v-col cols="12" sm="3" md="2" lg="2" class="side-navigation rag-panel">
              <div class="pa-4">
              <v-btn block  prepend-icon="mdi-key" :to="'/AccessConfig'" class="mb-4 flex justify-center rag-nav-button bg-primary">
                <span>Mes accès API</span>
              </v-btn>

              <div class="rag-section-header mt-2 mb-3">
                <div class="rag-line"></div>
                <txt class="text-caption text-accent mx-2">MES RAG</txt>
                <div class="rag-line"></div>
              </div>
              
              
            </div>
            <v-divider class="border-opacity-10"></v-divider>
            <div class="pa-4 app-info">
              <div class="d-flex align-center">
                <div class="core-dot me-2 accent-dot"></div>
                <span class="text-caption text-accent">CORE v1.0.0</span>
              </div>
              <v-btn variant="text" density="compact" class="rag-text-button" size="small"
                href="https://github.com/votre-repo" target="_blank">
                <v-icon size="small" class="me-1">mdi-github</v-icon> GitHub
              </v-btn>
            </div>
          </v-col>
           -->
          <!-- Contenu principal -->
          <div cols="12" sm="9" md="10" lg="10" class="main-content pa-0">
            <div class="rag-border"></div>
            <slot />
          </div>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">



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
  border-bottom: 1px solid rgba(var(--v-theme-accent), 0.1);
  position: static;
  top: 0;
  z-index: 10;
}

.rag-panel {
  background: rgba(var(--v-theme-interface-bg), 0.9);
  border-right: 1px solid rgba(var(--v-theme-accent), 0.15);
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
  background: linear-gradient(
    90deg, 
    transparent, 
    rgba(var(--v-theme-primary), 0.2), 
    transparent
  );
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