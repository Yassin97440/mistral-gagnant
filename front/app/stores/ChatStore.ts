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
        async sendMessage(content: Messages, chatId: number) {
            this.isLoading = true
            try {
                const chainResponse: any = await $fetch('/api/askQuestion', {
                    method: 'POST',
                    body: this.activeChat?.messages,
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

        addMessages(message: Messages, chatId: number) {
            const actualChat = this.chats.find(chat => chat.id === chatId)
            console.log("choose chat for message", actualChat)
            actualChat?.messages.push(message)
        },

        selectChat(chatId: number) {
            this.activeChat = this.chats.find(chat => chat.id === chatId)
            return this.activeChat
        },

        createNewChat() {
            const newChatId = this.chats.length + 1;

            const systemPrompt: Messages[] = [];
            this.chats.push({
                id: newChatId,
                title: `Chat ${newChatId}`,
                messages: systemPrompt
            });

            this.selectChat(newChatId);

            return newChatId;
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