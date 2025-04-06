<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" permanent location="left" width="300" class="bg-interface-bg">
      <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg" title="Mon espace de chat">
      </v-list-item>

      <v-divider></v-divider>

      <v-btn block color="primary" class="ma-2 text-white font-medium" prepend-icon="mdi-plus"
        @click="chatStore.createNewChat">
        Nouvelle conversation
      </v-btn>

      <v-btn block color="secondary" class="ma-2 text-white font-medium" prepend-icon="mdi-plus"
        @click="callTestChroma">
        TEST CHROMA DB
      </v-btn>

      <v-list nav>
        <v-list-item v-if="activeChat" v-for="(chat, index) in chatStore.chats" :key="index" :value="index"
          :title="chat.title" :prepend-icon="activeChat?.id === chat.id ? 'mdi-chat' : 'mdi-chat-outline'
            " @click="chatStore.selectChat(chat.id)" :active="activeChat?.id === chat.id"
          :class="{ 'active-chat': activeChat?.id === chat.id, 'rounded-message': true }">
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" density="compact" class="text-white">
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>BioRAG Chat</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <slot></slot>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useChatStore } from "~/stores/ChatStore";

const chatStore = useChatStore();

const drawer = ref(true);

const callTestChroma = async () => {
  console.log("on appelle le bac")
  const res = await $fetch("/api/getDbTest", {
    method: "POST",
    body: {},
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(res);
};

const activeChat = computed(() => {
  return chatStore.activeChat;
});
</script>

<style scoped>
.active-chat {
  background-color: rgba(var(--v-theme-primary), 0.1);
}
</style>
