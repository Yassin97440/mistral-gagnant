<template>
  <div class="chat-page max-h-screen" bg="interface-bg">
    <div v-if="!activeChatId" class="empty-state">
      <div class="text-center tech-welcome">
        <div class="reactor-container mb-6">
          <div class="reactor-ring"></div>
          <div class="reactor-core">
            <v-icon size="36" color="white">mdi-robot</v-icon>
          </div>
        </div>
        <h2 class="text-h5 font-weight-medium mb-2 tech-gradient-text">Bienvenue dans votre laboratoire IA</h2>
        <p class="text-body-2 text-primary/60 mb-6 ">
          Assistant personnel avec RAG intégré pour une intelligence augmentée
        </p>
        <v-btn color="primary" size="large" prepend-icon="mdi-plus" @click="chatStore.createNewChat()"
          class="tech-button">
          Initialiser une session
        </v-btn>
      </div>
    </div>
    <div v-else class="chat-container">
      <div class="conversations-container">
        <ChatMessages />
      </div>
      <div class="input-container w-full">
        <ChatInput />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/ChatStore";

const chatStore = useChatStore();
const activeChatId = computed(() => {
  return chatStore.activeChat;
});
</script>

<style scoped>
.chat-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(var(--v-theme-primary), 0.03) 0%, transparent 30%),
    radial-gradient(circle at 80% 80%, rgba(var(--v-theme-primary), 0.03) 0%, transparent 30%);
}

.chat-container {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.conversations-container {
  flex: 1;
  overflow: hidden;
  position: relative;
  padding-bottom: 16px;
}

.input-container {
  position: static;
  bottom: 0;
  flex-shrink: 0;
  padding: 16px;
  background: rgba(var(--v-theme-interface-bg), 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(var(--v-theme-primary), 0.1);
  z-index: 5;
}

.tech-welcome {
  max-width: 500px;
}

.tech-gradient-text {
  background: linear-gradient(90deg, #fff, rgb(var(--v-theme-primary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.tech-button {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 0 15px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.tech-button:hover {
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.5);
}

.reactor-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
}

.reactor-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid rgba(var(--v-theme-primary), 0.3);
  box-shadow: 0 0 20px rgba(var(--v-theme-primary), 0.5);
  animation: rotate 10s linear infinite;
}

.reactor-ring::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 40px;
  width: 10px;
  height: 10px;
  background-color: rgb(var(--v-theme-primary));
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.8);
}

.reactor-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background-color: rgba(var(--v-theme-primary), 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(var(--v-theme-primary), 0.5);
  animation: pulse 2s infinite;
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 15px rgba(var(--v-theme-primary), 0.5);
  }

  50% {
    box-shadow: 0 0 30px rgba(var(--v-theme-primary), 0.8);
  }

  100% {
    box-shadow: 0 0 15px rgba(var(--v-theme-primary), 0.5);
  }
}
</style>
