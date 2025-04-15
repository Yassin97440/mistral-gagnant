// stores/user.ts
import { defineStore } from 'pinia'
import type { Messages } from '@langchain/langgraph'
import type ChatParams from '../../../core/src/types/ChatParams'
import type DocumentProcessingParams from '../../../core/dist/types/DocumentProcessingParams'

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
            const baseParams: DocumentProcessingParams = {
                huggingfaceApiKey: useCredentialsStore().credentials.huggingfaceApiKey,
                mistralApiKey: useCredentialsStore().credentials.mistralApiKey,
                notionApiKey: useCredentialsStore().credentials.notionApiKey,
                notionDatabaseId: useCredentialsStore().credentials.notionDatabaseId,
                supabaseApiKey: useCredentialsStore().credentials.supabaseApiKey,
                supabaseUrl: useCredentialsStore().credentials.supabaseUrl,
            }
            const chatParams: ChatParams = {
                credentials: baseParams,
                MistralApiKey: useCredentialsStore().credentials.mistralApiKey,
                MistralModel: "mistral-large-latest",
                activeChat: this.activeChat as Chat
            }
            try {
                const chainResponse: any = await $fetch('/api/askQuestion', {
                    method: 'POST',
                    body: chatParams,
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