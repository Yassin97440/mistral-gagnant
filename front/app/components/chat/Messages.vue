<template>
  <div  class="messages-container">
    <v-container fluid>
      <div
        v-if="!activeChat || activeChat.messages.length === 0"
        class="text-center my-12"
      >
        <v-icon size="64" color="grey">mdi-chat-question-outline</v-icon>
        <div class="text-h5 mt-4 text-grey">
          Commencez une nouvelle conversation
        </div>
      </div>
      <template v-else>
        <div
          v-for="(message, index) in activeChat.messages"
          :key="index"
          class="message-wrapper my-4"
          :class="
            message.role === 'user' ? 'user-message' : 'assistant-message'
          "
        >
          <v-card
            :color="message.role === 'user' ? 'bg-user-background' : 'grey-lighten-4'"
            class="message-card"
          >
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar
                  :color="message.role === 'user' ? 'bg-user-background' : 'bg-assistant-background '"
                  class="mr-3"
                >
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
import { computed } from "vue";

const chatStore = useChatStore();
const activeChat = computed(() => {
  return chatStore.activeChat;
});
</script>

<style scoped>
.messages-container {
  height: calc(100vh - 150px);
  overflow-y: auto;
  padding-bottom: 20px;
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
