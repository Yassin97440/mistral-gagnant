// stores/user.ts
import { defineStore } from 'pinia'

//
export interface Message {
    role: 'system' | 'user' | 'assistant'
    content: string
}

//conversation entre user et assistant
interface Chat {
    id: number
    title: string,
    messages: Array<Message>
}

interface ChatStore {
    chats: Chat[],
    isLoading: boolean,
    activeChat: Chat | undefined
}

export const useChatStore = defineStore('chat', {
    state: (): ChatStore => ({
        chats: [],
        isLoading: false,
        activeChat: undefined
    }),

    actions: {
        async sendMessage(content: Message, chatId: number) {
            this.isLoading = true
            try {
                const chainResponse: any = await $fetch('/api/chatTest', {
                    method: 'POST',
                    body: this.activeChat?.messages,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log("mistral response", chainResponse)
                const res: Message = { role: 'assistant', content: chainResponse.toString() }
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

        addMessages(message: Message, chatId: number) {
            const actualChat = this.chats.find(chat => chat.id === chatId)
            console.log("choose chat for message", actualChat)
            actualChat?.messages.push(message)
        },

        selectChat(chatId: number) {
            this.activeChat = this.chats.find(chat => chat.id === chatId)
            return this.activeChat
        },

        createNewChat() {
            let newChatId;
            if (!this.chats.length || this.chats.length == 0) {
                newChatId = 0;
            } else {
                newChatId = this.chats.length + 1;
            }
            const systemPrompt: Message[] = [{
                role: 'system',
                content: `-Tu es un chatbot. Tu es l'assistant de Yassin Abdulla. Ton role est d'etre un assistant de grande qualité pour des taches plus ou moins technique et plus ou moins complexes.
                 Sujets principaux software engineering, à lIA, en passanr par etude besoin, recherche de mission pour freelance développeur en France, gestion de projet, ...
                 -Répond dans la langue de l'interlocuteur.
                 -Soie une peu joviale pour créer de l'enthousiasme chez l'intérlocuteur (ça augmente la créativité)
                 -développe les idées que tu as de façon créative mais toujours avec une reflexion technique
                 -parle comme un jeune "cool" et sympa`
            }];
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

    // persist: {
    //     storage: persistedState.localStorage,
    // },
})