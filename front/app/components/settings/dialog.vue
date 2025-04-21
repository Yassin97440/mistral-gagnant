<template>
    <v-dialog v-model="dialog" class="pr-5 " @update:modelValue="handleDialogChange">
        <v-container class="flex justify-center ">
            <v-card class="pa-5 mb-6 background-color w-10/12 rounded-lg text-white">
                <v-card-title class="text-h5 font-weight-bold mb-4 ">Paramètres</v-card-title>

                <v-row>
                    <v-col cols="2" class="text-primary ">
                        <v-btn variant="text" class="mx-2 rag-button glow-hover" prepend-icon="mdi-database-sync"
                            @click="displayedSettings = 'apiKeys'">
                            Clés API
                        </v-btn>
                        <v-btn variant="text" class="mx-2 rag-button glow-hover" prepend-icon="mdi-brain"
                            @click="displayedSettings = 'models'">
                            Modèles
                        </v-btn>
                    </v-col>
                    <v-col cols="10">
                        <div v-if="displayedSettings === 'apiKeys'" class=" mb-4">
                            <h5 class="text-h7  font-weight-bold mb-4">Clés d'accès API</h5>
                            <v-form ref="form" @submit.prevent="saveAll" class="overflow-y-scroll max-h-52 p-2">
                                <v-row class="max-w-full">
                                    <v-col cols="12" v-for="(field, index) in apiFields" :key="index"
                                        class="m-1 bg-secondary rounded-lg">
                                        <MoleculesApiKeyField v-model="apiValues[field.key]" :label="field.label"
                                            :icon="field.icon" :hasValue="hasValue(field.key)"
                                            @save="saveField(field.key)" class="max-h-10 " />
                                    </v-col>
                                </v-row>

                            </v-form>
                        </div>
                        <div v-if="displayedSettings === 'models'" class=" mb-4">
                            <h3 class="text-h5  font-weight-bold mb-4">Modèles</h3>
                            <span>Sélectionnez le modèle avec qui vous voulez travailler</span>
                            <v-select v-model="selectedModel" :items="models" item-title="text" label="Modèle"
                                class="mt-4 custom-select" prepend-icon="mdi-brain" bg-color="interface-bg"></v-select>
                            <v-divider class="my-4 text-primary"></v-divider>
                            <div class=" mb-4">
                                <h3 class="text-h5  font-weight-bold mb-4">Température</h3>
                                <span>Sélectionnez la température avec laquelle vous voulez travailler</span>
                                <v-slider v-model="temperature" color="primary" :min="0" :max="1" :step="0.1"
                                    label="Température" class="mt-4 custom-slider" thumb-label bg-color="interface-bg">
                                </v-slider>
                            </div>
                        </div>
                    </v-col>
                </v-row>

                <v-card-actions>
                    <v-btn variant="text" class="mx-2 rag-button glow-hover" prepend-icon="mdi-close"
                        @click="handleDialogChange(false)">
                        Fermer
                    </v-btn>
                </v-card-actions>

            </v-card>
        </v-container>
    </v-dialog>
</template>
<script setup lang="ts">
const dialog = ref(false)

const props = defineProps({
    openDialog: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(['update:openDialog']);

const displayedSettings = ref('apiKeys')
const selectedModel = ref(useChatStore().model || 'mistral')
const temperature = ref(useChatStore().temperature || 0.1)
const models = ref([
    { text: 'Mistral:7b', value: 'mistral' },
    { text: 'Hermes3:8b', value: 'hermes3' },
    { text: 'cogito:8b', value: 'cogito' }
])
watch(() => props.openDialog, (newVal) => {
    dialog.value = newVal
});
watch(selectedModel, (newVal) => {
    useChatStore().model = newVal
})
watch(temperature, (newVal) => {
    useChatStore().temperature = newVal
})
const form = ref(null)
const credentialsStore = useCredentialsStore();

// Définition des champs API
type ApiKeyField = keyof typeof credentialsStore.credentials;

interface ApiFieldConfig {
    key: ApiKeyField;
    label: string;
    icon: string;
}

const apiFields: ApiFieldConfig[] = [
    { key: 'huggingfaceApiKey', label: 'Huggingface API Key', icon: 'mdi-key-variant' },
    { key: 'langsmithApiKey', label: 'Langsmith API Key', icon: 'mdi-key-variant' },
    { key: 'langsmithApiUrl', label: 'Langsmith API URL', icon: 'mdi-link-variant' },
    { key: 'mistralApiKey', label: 'Mistral API Key', icon: 'mdi-key-variant' },
    { key: 'notionApiKey', label: 'Notion API Key', icon: 'mdi-key-variant' },
    { key: 'notionDatabaseId', label: 'Notion Database ID', icon: 'mdi-database' },
    { key: 'supabaseApiKey', label: 'Supabase API Key', icon: 'mdi-key-variant' },
    { key: 'supabaseUrl', label: 'Supabase URL', icon: 'mdi-link-variant' }
]

// Objet réactif pour stocker les valeurs
const apiValues = ref({
    huggingfaceApiKey: credentialsStore.credentials.huggingfaceApiKey || '',
    langsmithApiKey: credentialsStore.credentials.langsmithApiKey || '',
    langsmithApiUrl: credentialsStore.credentials.langsmithApiUrl || '',
    mistralApiKey: credentialsStore.credentials.mistralApiKey || '',
    notionApiKey: credentialsStore.credentials.notionApiKey || '',
    notionDatabaseId: credentialsStore.credentials.notionDatabaseId || '',
    supabaseApiKey: credentialsStore.credentials.supabaseApiKey || '',
    supabaseUrl: credentialsStore.credentials.supabaseUrl || ''
})

// Fonction pour vérifier si un champ contient une valeur
const hasValue = (field: ApiKeyField) => {
    return !!credentialsStore.credentials[field]
}

// Fonction pour sauvegarder un champ spécifique
const saveField = (field: ApiKeyField) => {
    const currentCredentials = { ...credentialsStore.credentials }
    currentCredentials[field] = apiValues.value[field]
    credentialsStore.updateCredentials(currentCredentials)
}

// Fonction pour sauvegarder toutes les modifications
const saveAll = () => {
    credentialsStore.updateCredentials({
        huggingfaceApiKey: apiValues.value.huggingfaceApiKey,
        langsmithApiKey: apiValues.value.langsmithApiKey,
        langsmithApiUrl: apiValues.value.langsmithApiUrl,
        mistralApiKey: apiValues.value.mistralApiKey,
        notionApiKey: apiValues.value.notionApiKey,
        notionDatabaseId: apiValues.value.notionDatabaseId,
        supabaseApiKey: apiValues.value.supabaseApiKey,
        supabaseUrl: apiValues.value.supabaseUrl
    })
}

const handleDialogChange = (val: boolean) => {
    emit('update:openDialog', val);
}

// const updateTemperature = (val: number) => {
//     useChatStore().temperature = val
// }
</script>

<style scoped>
.background-color {
    background-color: rgba(var(--v-theme-interface-bg), 0.9);
}

.custom-input .v-field__input {
    color: white;
    /* Texte saisi */
}

.custom-input .v-label,
.custom-input .v-field__outline {
    color: var(--v-theme-primary);
    /* Label + bordure */
    border-color: var(--v-theme-primary);
    /* Bordure pour `outlined` */
}

/* Si tu veux que la bordure reste colorée même sans focus */
.custom-input .v-field--variant-outlined .v-field__outline__notch {
    border-color: var(--v-theme-primary) !important;
}
</style>