// stores/user.ts
import { defineStore } from 'pinia'

interface CredentialsStore {
    credentials: {
        huggingfaceApiKey: string ;
        langsmithApiKey: string;
        langsmithApiUrl: string;
        mistralApiKey: string;
        notionApiKey: string;
        notionDatabaseId: string;
        supabaseApiKey: string;
        supabaseUrl: string;
    };
}

export const useCredentialsStore = defineStore('credentials', {
    state: (): CredentialsStore => ({
        credentials: {
            huggingfaceApiKey: '',
            langsmithApiKey: '',
            langsmithApiUrl: '',
            mistralApiKey: '',
            notionApiKey: '',
            notionDatabaseId: '',
            supabaseApiKey: '',
            supabaseUrl: ''
        }
    }),

    actions: {
       updateCredentials(credentials: CredentialsStore['credentials']) {
        this.credentials = credentials
       }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: ['credentials'],
      },
})
