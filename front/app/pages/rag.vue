<template>
    <div class="rag-container">
        <h1>RAG</h1>

        <div class="action-section">
            <button @click="processDocuments" class="futuristic-button" :disabled="ragStore.isProcessing">
                <span class="button-content">
                    <span v-if="!ragStore.isProcessing">Traiter les documents</span>
                    <span v-else class="loading-spinner"></span>
                </span>
            </button>
        </div>

        <div v-if="ragStore.processingStatus" class="status-message"
            :class="{ 'success': ragStore.processingStatus.includes('succès'), 'error': ragStore.processingStatus.includes('Erreur') }">
            {{ ragStore.processingStatus }}
        </div>

        <v-divider class="text-primary"></v-divider>

        <v-data-table :items="items" class="rounded-lg  border-2 border-opacity-60 border-primary text-primary" :headers="headers" hover>
            <template v-slot:item.status="{ item }" >
                <v-icon :icon="item.status === 'success' ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline'"></v-icon>
                <span class="text-primary">{{ item.status }}</span>

            </template>
        </v-data-table>
      
    </div>
</template>

<script setup lang="ts">
import { useRAGStore } from "~/stores/RAGStore";

definePageMeta({
    layout: 'rag'
});

const ragStore = useRAGStore();

const items = computed(() => {
    return ragStore.processingHistorics;
});


const headers = ref([
    { title: 'Titre', key: 'title' },
    { title: 'Statut', key: 'status' },
    { title: 'Base de données Notion', key: 'databaseId' },
    { title: 'Date', key: 'date' }
]);

const processDocuments = async () => {
    try {
        await ragStore.runProcessingDocuments();
    } catch (error) {
        console.error("Erreur lors du traitement:", error);
    }
};
</script>

<style scoped>
.rag-container {
    height: 100%;
    padding: 2rem;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
}

.action-section {
    margin: 2rem 0;
}

.futuristic-button {
    background: linear-gradient(135deg, #4b6cb7, #182848);
    color: white;
    border: none;
    border-radius: 30px;
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    min-width: 220px;
    min-height: 50px;
    cursor: pointer;
}

.futuristic-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg, #5a79c9, #1e3154);
}

.futuristic-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    background: linear-gradient(135deg, #3b568f, #172236);
}

.futuristic-button::before {
    content: "";
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    z-index: -1;
    background: linear-gradient(90deg, #00d2ff, #3a7bd5);
    border-radius: 35px;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.futuristic-button:hover::before {
    opacity: 0.4;
}

.button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
}

.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s linear infinite;
}

.status-message {
    margin-top: 1rem;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: 500;
    max-width: 80%;
    text-align: center;
    animation: fadeIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.success {
    background-color: rgba(39, 174, 96, 0.2);
    color: #27ae60;
    border-left: 4px solid #27ae60;
}

.error {
    background-color: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
    border-left: 4px solid #e74c3c;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.rag-nav-list {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
}

.rag-list-item {
    border-radius: 4px;
    transition: background-color 0.3s ease;
}

.rag-list-item:hover {
    background-color: rgba(var(--v-theme-accent), 0.05) !important;
}

.rag-list-item.active {
    background-color: rgba(var(--v-theme-accent), 0.1) !important;
    border-left: 2px solid rgb(var(--v-theme-accent));
}

.rag-list-item.active:hover {
    background-color: rgba(var(--v-theme-accent), 0.15) !important;
    box-shadow: 0 0 10px rgba(var(--v-theme-accent), 0.2);
}

:deep(.v-data-table) {
    background-color: rgba(var(--v-theme-secondary), 0.23);
}

:deep(.v-data-table-header) {
    background-color: rgba(var(--v-theme-secondary), 0.45);
}

:deep(.v-data-table-row:hover) {
    background-color: rgba(var(--v-theme-secondary), 0.78) !important;
}
</style>