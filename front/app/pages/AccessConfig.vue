<template>
    <v-container class="flex justify-center">
        <v-card class="pa-4 mb-6 bg-interface-bg w-9/12 ">
            <v-card-title class="text-h5 font-weight-bold mb-4">Clés d'accès API</v-card-title>
            
            <v-form ref="form" @submit.prevent="saveCredentials">
                <v-row class="">
                    <v-col cols="12" >
                        <v-text-field
                            v-model="huggingfaceApiKey"
                            label="Huggingface API Key"
                            variant="outlined"
                            prepend-inner-icon="mdi-key-variant"
                            hide-details="auto"
                            class="mb-3 "
                            color="primary"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="langsmithApiKey"
                            label="Langsmith API Key"
                            variant="outlined"
                            prepend-inner-icon="mdi-key-variant"
                            hide-details="auto"
                            class="mb-3"
                            color="primary"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="langsmithApiUrl"
                            label="Langsmith API URL"
                            variant="outlined"
                            prepend-inner-icon="mdi-link-variant"
                            hide-details="auto"
                            class="mb-3"
                            color="primary"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="mistralApiKey"
                            label="Mistral API Key"
                            variant="outlined"
                            prepend-inner-icon="mdi-key-variant"
                            hide-details="auto"
                            class="mb-3"
                            color="primary"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="notionApiKey"
                            label="Notion API Key"
                            variant="outlined"
                            prepend-inner-icon="mdi-key-variant"
                            hide-details="auto"
                            class="mb-3"
                            color="primary"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="notionDatabaseId"
                            label="Notion Database ID"
                            variant="outlined"
                            prepend-inner-icon="mdi-database"
                            hide-details="auto"
                            class="mb-3"
                            color="primary"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="supabaseApiKey"
                            label="Supabase API Key"
                            variant="outlined"
                            prepend-inner-icon="mdi-key-variant"
                            hide-details="auto"
                            class="mb-3"
                            color="primary"
                        />
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="supabaseUrl"
                            label="Supabase URL"
                            variant="outlined"
                            prepend-inner-icon="mdi-link-variant"
                            hide-details="auto"
                            class="mb-3"
                            color="primary"
                        />
                    </v-col>
                </v-row>

                <v-card-actions class="pt-4">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        type="submit"
                        prepend-icon="mdi-content-save"
                    >
                        Enregistrer
                    </v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'rag'
})

const form = ref(null)
const credentialsStore = useCredentialsStore()

// Utiliser des refs au lieu de computed pour permettre la modification
const huggingfaceApiKey = ref(credentialsStore.credentials.huggingfaceApiKey || '')
const langsmithApiKey = ref(credentialsStore.credentials.langsmithApiKey || '')
const langsmithApiUrl = ref(credentialsStore.credentials.langsmithApiUrl || '')
const mistralApiKey = ref(credentialsStore.credentials.mistralApiKey || '')
const notionApiKey = ref(credentialsStore.credentials.notionApiKey || '')
const notionDatabaseId = ref(credentialsStore.credentials.notionDatabaseId || '')
const supabaseApiKey = ref(credentialsStore.credentials.supabaseApiKey || '')
const supabaseUrl = ref(credentialsStore.credentials.supabaseUrl || '')

// Fonction pour sauvegarder les modifications
const saveCredentials = () => {
  credentialsStore.updateCredentials({
    huggingfaceApiKey: huggingfaceApiKey.value,
    langsmithApiKey: langsmithApiKey.value,
    langsmithApiUrl: langsmithApiUrl.value,
    mistralApiKey: mistralApiKey.value,
    notionApiKey: notionApiKey.value,
    notionDatabaseId: notionDatabaseId.value,
    supabaseApiKey: supabaseApiKey.value,
    supabaseUrl: supabaseUrl.value
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