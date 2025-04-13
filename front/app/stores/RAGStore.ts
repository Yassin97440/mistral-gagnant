// stores/user.ts
import { defineStore } from 'pinia'

interface RAGStore {
    documents: Document[] | undefined
    processingStatus: string | null
    isProcessing: boolean
}

export const useRAGStore = defineStore('RAG', {
    state: (): RAGStore => ({
        documents: undefined,
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
                return result;
            } catch (error) {
                console.error("Erreur lors du traitement des documents:", error);
                this.processingStatus = "Erreur lors du traitement des documents";
                throw error;
            } finally {
                this.isProcessing = false;
            }
        }
    }
})
