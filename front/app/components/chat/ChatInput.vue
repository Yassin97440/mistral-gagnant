<template>
  <div class="chat-input-container">
    <v-card flat class="mx-auto">
      <v-form @submit.prevent="sendMessage">
        <v-textarea
          v-model="userMessage"
          variant="outlined"
          placeholder="Écrivez votre message ici..."
          rows="3"
          auto-grow
          hide-details
          class="chat-textarea"
          @keydown.enter.prevent="handleEnterPress"
        ></v-textarea>

        <div class="d-flex justify-end align-center pa-2">
          <v-btn
            :disabled="!userMessage.trim() || chatStore.isLoading"
            :loading="chatStore.isLoading"
            color="primary"
            @click="sendMessage"
            class="px-4"
            prepend-icon="mdi-send"
          >
            Envoyer
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useChatStore } from "~/stores/ChatStore";

const activeChat = computed(() => {
  return chatStore.activeChat;
});

const chatStore = useChatStore();
const userMessage = ref("");

const sendMessage = async () => {
  if (!userMessage.value.trim() || chatStore.isLoading) return;

  const messageContent = userMessage.value;
  userMessage.value = "";

  const newMessage: Message = {
    role: "user",
    content: messageContent,
  };
  chatStore.addMessages(newMessage, activeChat.value.id);

  // Envoyer au backend et recevoir la réponse
  try {
    const response = await chatStore.sendMessage(
      newMessage,
      activeChat.value.id
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);
    // chatStore.chats[props.chatId]?.messages.push({
    //   role: "assistant",
    //   content: "Une erreur est survenue. Veuillez réessayer.",
    // });
  }
};

const handleEnterPress = (e: KeyboardEvent) => {
  if (e.shiftKey) return; // Permettre les sauts de ligne avec Shift+Enter
  sendMessage();
};
</script>

<style scoped>
  .chat-input-container {
    width: 100%;
    position: sticky;
    bottom: 0;
    padding: 10px 20px;
    background-color: var(--color-interface-background);
    border-top: 1px solid var(--color-interface-border);
  }
  
  .chat-textarea {
  border-radius: 8px;
}
</style>
