<template>
  <v-app bg-color="interface-bg">
    <v-app-bar flat color="transparent" class="glass-panel px-4">
      <div class="d-flex align-center">
        <div class="logo-container me-3">
          <img src="/logo.svg" alt="Logo">
        </div>
        <h1 class="text-h6 font-weight-medium tech-text">Mistral Gagnant</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn variant="text" class="mx-2 rag-button glow-hover" :to="'/rag'" prepend-icon="mdi-database-sync">
        RAG
      </v-btn>

      <div class="status-indicator mx-3">
        <span class="status-dot"></span>
        <span text-primary class="text-caption text-primary/50">{{ useChatStore().model }}</span>
      </div>

      <v-btn icon variant="text" class="mx-1 glow-hover text-primary">
        <v-icon>mdi-theme-light-dark</v-icon>
      </v-btn>
      <v-btn icon variant="text" class="mx-1 glow-hover text-primary" @click="settingsDialogOpen = true">
        <v-icon>mdi-cog</v-icon>
      </v-btn>
    </v-app-bar>
    <SettingsDialog v-model:openDialog="settingsDialogOpen" />

    <v-navigation-drawer location="left" class="side-navigation rag-panel text-primary z-0">
      <div class="pa-4">
        <v-btn block color="primary" prepend-icon="mdi-plus" class="mb-4 flex justify-center tech-button "
          @click="chatStore.createNewChat()">
          <span class="">Nouveau chat</span>
        </v-btn>
      </div>

      <div class="tech-section-header mt-2 mb-3">
        <div class="tech-line"></div>
        <span class="text-caption   text-primary mx-2 ">CONVERSATIONS</span>
        <div class="tech-line"></div>
      </div>

      <div class="chat-list">
        <v-list à density="compact" bg-color="transparent" color="flex justify-start">
          <v-list-item v-for="chat in chatStore.chats" :key="chat.id" :title="`${chat.title}`"
            prepend-icon="mdi-chat-outline" active-color="primary" class="mb-1 tech-list-item relative text-white"
            :class="{ 'active-chat': chat.id === activeChat?.id }" @click="chatStore.selectChat(chat.id)">
            <template v-slot:append>
              <div class="chat-actions">
                <v-btn icon size="small" variant="text" class="action-btn edit-btn" @click.stop="editChatTitle(chat)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text" class="action-btn delete-btn"
                  @click.stop="confirmDeleteChat(chat)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
              <MoleculesUpdateFieldDialog v-model:dialogOpen="dialogOpen" v-model="tempValue" :label="label"
                :icon="icon" :hasValue="hasValue" @save="() => saveChatTitle(currentEditingChat)" />
            </template>
          </v-list-item>
        </v-list>
      </div>
    </v-navigation-drawer>

    <v-main class="bg-interface-bg max-h-screen">
      <div class="tech-border"></div>
      <slot />
    </v-main>

    <!-- <v-footer class="bg-interface-bg ">
      <div class="pa-4 app-info">

        <div class="d-flex align-center">
          <div class="core-dot me-2"></div>
          <span class="text-caption text-primary">CORE v1.0.0</span>
        </div>
        <v-btn variant="text" density="compact" class="tech-text-button" size="small"
          href="https://github.com/votre-repo" target="_blank">
          <v-icon size="small" class="me-1">mdi-github</v-icon> GitHub
        </v-btn>
      </div>

    </v-footer> -->
  </v-app>

</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/ChatStore";

const chatStore = useChatStore();

const dialogOpen = ref(false);
const settingsDialogOpen = ref(false);
const tempValue = ref('');
const label = ref('Nom de la conversation');
const icon = ref('mdi-pencil');
const hasValue = ref(false);
const currentEditingChat = ref<Chat | null>(null);

const activeChat = computed(() => {
  return chatStore.activeChat;
});

const editChatTitle = (chat: Chat) => {
  currentEditingChat.value = chat;
  label.value = 'Titre de la conversation';
  icon.value = 'mdi-pencil';
  hasValue.value = true;
  tempValue.value = chat.title;
  dialogOpen.value = true;
}

const saveChatTitle = (chat: Chat | null) => {
  if (chat && chat.id) {
    chatStore.renameChat(chat.id, tempValue.value)
  }
}

const confirmDeleteChat = (chat: Chat) => {
  chatStore.deleteChat(chat.id)
}
</script>

<style scoped>
.bg-interface-bg {
  background-color: rgb(var(--v-theme-interface-bg));
  background-image:
    radial-gradient(circle at 15% 50%, rgba(var(--v-theme-primary), 0.03) 0%, transparent 25%),
    radial-gradient(circle at 85% 30%, rgba(var(--v-theme-primary), 0.02) 0%, transparent 25%);
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

.glass-panel {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-interface-bg), 0.7);
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.1);
  position: static;
  top: 0;
  z-index: 10;
}

.tech-panel {
  background: rgba(var(--v-theme-interface-bg), 0.9);
  border-right: 1px solid rgba(var(--v-theme-primary), 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  position: sticky;
  overflow: hidden;
}

.tech-panel::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(var(--v-theme-primary), 0.2) 50%, transparent);
}

.text-button {
  border-radius: 4px;
  font-size: 0.75rem;
  /* ⬅️ réduit la taille du texte */
  line-height: 1.2;
  white-space: normal;
  /* permet les retours à la ligne */
  text-align: left;
}

.tech-button {
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.5s ease;


}

.tech-button:hover {
  box-shadow: 0 0 15px rgba(var(--v-theme-primary), 0.5);
}

.tech-list-item {
  border-radius: 4px;
  transition: background-color 0.3s ease;
  position: relative;
}

.tech-list-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}

.tech-list-item.active-chat {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  border-left: 2px solid rgb(var(--v-theme-primary));
}

.tech-list-item.active-chat:hover {
  background-color: rgba(var(--v-theme-primary), 0.15) !important;
  box-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.2);
}

.app-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.main-content {
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tech-border {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(var(--v-theme-primary), 0.1), transparent);
}

.chat-list {
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.tech-section-header {
  display: flex;
  align-items: center;
}

.tech-line {
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.tech-text {
  letter-spacing: 0.5px;
  position: relative;
  color: rgb(var(--v-theme-primary));
}

.core-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  box-shadow: 0 0 10px rgba(var(--v-theme-primary), 0.5);
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

@keyframes pulse {
  0% {
    opacity: 0.7;
    filter: drop-shadow(0 0 2px rgba(var(--v-theme-primary), 0.5));
  }

  50% {
    opacity: 1;
    filter: drop-shadow(0 0 5px rgba(var(--v-theme-primary), 0.8));
  }

  100% {
    opacity: 0.7;
    filter: drop-shadow(0 0 2px rgba(var(--v-theme-primary), 0.5));
  }
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

.chat-actions {
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  display: flex;
  gap: 4px;
}

.tech-list-item:hover .chat-actions {
  opacity: 1;
}

.action-btn {
  color: rgba(var(--v-theme-primary), 0.7);
}

.action-btn:hover {
  color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.1);
}

.edit-btn:hover {
  color: rgb(var(--v-theme-primary));
}

.delete-btn:hover {
  color: rgb(var(--v-theme-error));
}
</style>
