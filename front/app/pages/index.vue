<template>
  <div class="chat-page">
    <v-container fluid class="pa-0 fill-height d-flex flex-column">
      <ChatMessages />
      <ChatInput />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from "~/stores/ChatStore";
import { useRoute } from "vue-router";

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
}
</style>
