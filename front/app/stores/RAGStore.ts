// stores/user.ts
import { defineStore } from 'pinia'
import type DocumentProcessingParams from '../../../core/dist/types/DocumentProcessingParams'

interface RAGStore {
    processingHistorics: {title: string, status: string, date: string, databaseId: string}[] | undefined
    processingStatus: string | null
    isProcessing: boolean
}

export const useRAGStore = defineStore('RAG', {
    state: (): RAGStore => ({
        processingHistorics: [],
        processingStatus: null,
        isProcessing: false
    }),

    actions: {
        async runProcessingDocuments() {
            try {
                this.isProcessing = true;
                this.processingStatus = "Traitement en cours...";

                const credentials = useCredentialsStore().credentials;
                const processingConfig: DocumentProcessingParams = {
                    huggingfaceApiKey: credentials.huggingfaceApiKey,
                    mistralApiKey: credentials.mistralApiKey,
                    notionApiKey: credentials.notionApiKey,
                    notionDatabaseId: credentials.notionDatabaseId,
                    supabaseApiKey: credentials.supabaseApiKey,
                    supabaseUrl: credentials.supabaseUrl,
                    chunkSize: 500,
                    chunkOverlap: 50
                }
                
                const response = await fetch('/api/runProcessingDocuments', {
                    method: 'POST',
                    body: JSON.stringify(processingConfig),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Erreur: ${response.status}`);
                }
                
                const result = await response.text();
                this.processingStatus = "Traitement terminé avec succès!";
                this.newProcessingHistory("Processing n°" + this.processingHistorics?.length + 1, "success", "databaseId");
                return result;
            } catch (error) {
                console.error("Erreur lors du traitement des documents:", error);
                this.processingStatus = "Erreur lors du traitement des documents";
                this.newProcessingHistory("Processing n°" + this.processingHistorics?.length + 1, "error", "databaseId");
                throw error;
            } finally {
                this.isProcessing = false;
            }
        },
        async newProcessingHistory(title: string, status: string, databaseId: string) {
            if (!this.processingHistorics) {
                this.processingHistorics = [];
            }

            this.processingHistorics.push({
                title: title,
                status: status,
                date: new Date().toLocaleString(),
                databaseId: databaseId
            });
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: ['processingHistorics'],
      },
})
