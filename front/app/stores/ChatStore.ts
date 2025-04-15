// stores/user.ts
import { defineStore } from 'pinia'
import type { Messages } from '@langchain/langgraph'

interface ChatStore {
    chats: Ref<Chat[]>,
    isLoading: Ref<boolean>,
    activeChat: Ref<Chat | undefined>
}

export const useChatStore = defineStore('chat', {
    state: (): ChatStore => ({
        chats: ref([]),
        isLoading: ref(false),
        activeChat: ref(undefined)
    }),

    actions: {
        async sendMessage(content: Messages, chatId: string) {
            this.isLoading = true
            try {
                const chainResponse: any = await $fetch('/api/askQuestion', {
                    method: 'POST',
                    body: this.activeChat,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log("mistral response", chainResponse)
                const res: Messages = { role: 'assistant', content: chainResponse.toString() }
                this.addMessages(res, chatId)
                return chainResponse;
            }
            catch (error) {
                console.error(error)
                return "Une erreur est survenue lors de la communication avec le serveur.";
            }
            finally {
                this.isLoading = false
            }
        },

        addMessages(message: Messages, chatId: string) {
            const actualChat = this.chats.find(chat => chat.id === chatId)
            console.log("choose chat for message", actualChat)
            actualChat?.messages.push(message)
        },

        selectChat(chatId: string) {
            this.activeChat = this.chats.find(chat => chat.id === chatId)
            return this.activeChat
        },

        async createNewChat() {
            const newChat: Chat = await $fetch('/api/createNewChat')

            this.chats.push(newChat);

            this.selectChat(newChat.id);

            return newChat;
        },

        deleteChat(chatId: number) {
            if (chatId >= 0 && chatId < this.chats.length) {
                this.chats.splice(chatId, 1);
            }
        },

        renameChat(chatId: number, newName: string) {
            const chat = this.chats[chatId];
            if (chatId >= 0 && chatId < this.chats.length && newName.trim() && chat) {
                chat.title = newName.trim();
            }
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: ['chats'],
      },
    
}
)