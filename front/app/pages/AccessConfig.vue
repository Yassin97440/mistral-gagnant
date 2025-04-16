<template>
    <v-container class="flex justify-center">
        <v-card class="pa-4 mb-6 bg-interface-bg w-9/12 ">
            <v-card-title class="text-h5 font-weight-bold mb-4">Clés d'accès API</v-card-title>
            
            <v-form ref="form" @submit.prevent="saveAll">
                <v-row>
                    <v-col cols="12" v-for="(field, index) in apiFields" :key="index" class="m-1 bg-secondary rounded-lg">
                        <MoleculesApiKeyField
                            v-model="apiValues[field.key]"
                            :label="field.label"
                            :icon="field.icon"
                            :hasValue="hasValue(field.key)"
                            @save="saveField(field.key)"
                        />
                    </v-col>
                </v-row>

            </v-form>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">

definePageMeta({
  layout: 'rag'
})

const form = ref(null)
const credentialsStore = useCredentialsStore()

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
</script>

<style scoped>
.custom-input .v-field__input {
  color: white; /* Texte saisi */
}

.custom-input .v-label,
.custom-input .v-field__outline {
  color: var(--v-theme-primary); /* Label + bordure */
  border-color: var(--v-theme-primary); /* Bordure pour `outlined` */
}

/* Si tu veux que la bordure reste colorée même sans focus */
.custom-input .v-field--variant-outlined .v-field__outline__notch {
  border-color: var(--v-theme-primary) !important;
}
</style>