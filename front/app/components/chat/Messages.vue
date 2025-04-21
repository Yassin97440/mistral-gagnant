<template>
  <div class="messages-container bg-interface-bg">
    <v-container fluid>
      <div v-if="!activeChat || activeChat.messages.length === 0" class="text-center my-12">
        <v-icon size="64" color="grey">mdi-chat-question-outline</v-icon>
        <div class="text-h5 mt-4 text-grey">
          Commencez une nouvelle conversation
        </div>
      </div>
      <template v-else>
        <div v-for="(message, index) in filteredMessages" :key="index" class="message-wrapper my-4" :class="message.role === 'user' ? 'user-message' : 'assistant-message'
          ">
          <v-card :class="message.role === 'user' ? 'bg-user-bg' : 'bg-interface-bg'" class="message-card">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar :class="message.role === 'user' ? 'bg-user-bg' : 'bg-assistant-bg '" class="mr-3">
                  <v-icon color="white">
                    {{ message.role === "user" ? "mdi-account" : "mdi-robot" }}
                  </v-icon>
                </v-avatar>
                <div>
                  <div class="text-subtitle-1 font-weight-bold">
                    {{ message.role === "user" ? "Vous" : "Assistant" }}
                  </div>
                  <div class="message-content">{{ message.content }}</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </template>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/ChatStore";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const chatStore = useChatStore();
const activeChat = computed(() => {
  return chatStore.activeChat as { messages: Message[] } | null;
});



const filteredMessages = computed(() => {
  return activeChat.value?.messages.filter(msg => msg.role !== 'system') ?? [];
});
</script>

<style scoped>
.messages-container {
  height: 100%;
  overflow-y: auto;
  width: 100%;
}

.message-wrapper {
  max-width: 80%;
}

.user-message {
  margin-left: auto;
}

.assistant-message {
  margin-right: auto;
}

.message-card {
  border-radius: 12px;
}

.message-content {
  white-space: pre-wrap;
}
</style>
