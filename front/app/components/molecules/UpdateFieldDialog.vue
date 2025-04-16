<template>
    <v-dialog v-model="dialogLocalOpen" max-width="500px">
        <v-card class="bg-interface-bg">
            <v-card-title class="text-h6 pb-0 mt-1">
                Éditer {{ label }}
            </v-card-title>

            <v-card-text>
                <v-text-field v-model="localValue" :label="label" :prepend-inner-icon="icon" variant="outlined"
                    hide-details="auto" class="mb-3" color="primary" />
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey-darken-1" variant="text" @click="cancelEdit">
                    Annuler
                </v-btn>
                <v-btn color="primary" variant="text" @click="saveAndClose">
                    Enregistrer
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps({
    dialogOpen: {
        type: Boolean,
        default: false
    },
    modelValue: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: 'mdi-key-variant'
    },
    hasValue: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'save', 'update:dialogOpen']);

// Variable locale pour stocker la valeur temporaire
const localValue = ref('');

// Variable computed pour le dialogue
const dialogLocalOpen = computed({
    get: () => props.dialogOpen,
    set: (value) => emit('update:dialogOpen', value)
});

// Initialiser la valeur locale quand le dialogue s'ouvre
watch(() => props.dialogOpen, (isOpen) => {
    if (isOpen) {
        localValue.value = props.modelValue || '';
    }
}, { immediate: true });

// Annuler l'édition
const cancelEdit = () => {
    emit('update:dialogOpen', false);
};

// Sauvegarder et fermer
const saveAndClose = () => {
    if (localValue.value) {
        emit('update:modelValue', localValue.value);
        emit('save');
    }
    emit('update:dialogOpen', false);
};
</script>