// stores/user.ts
import { defineStore } from 'pinia'

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
                
                const response = await fetch('/api/runProcessingDocuments');
                
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
