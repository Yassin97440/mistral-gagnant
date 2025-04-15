<template>
  <div>
    <!-- Affichage du champ avec bouton d'édition -->
    <v-list-item class="px-2 mb-2">
      <template v-slot:prepend>
        <v-icon :icon="icon" class="me-3" />
      </template>
      
      <v-list-item-title>{{ label }}</v-list-item-title>
      
      <v-list-item-subtitle v-if="hasValue" class="mt-1">
        <span class="text-primary">••••••••••••••••</span>
      </v-list-item-subtitle>
      
      <template v-slot:append>
        <v-btn 
          variant="text" 
          color="primary" 
          size="small"
          @click="openDialog"
          
        >
          <v-icon icon="mdi-pencil" />
        </v-btn>
      </template>
    </v-list-item>

    <!-- Dialog pour éditer la valeur -->
    <v-dialog v-model="dialogOpen" max-width="500px" >
      <v-card class="bg-interface-bg">
        <v-card-title class="text-h6 pb-0 mt-1">
          Éditer {{ label }}
        </v-card-title>
        
        <v-card-text>
          <v-text-field
            v-model="tempValue"
            :label="label"
            :prepend-inner-icon="icon"
            variant="outlined"
            hide-details="auto"
            class="mb-3"
            color="primary"
          />
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="grey-darken-1" 
            variant="text" 
            @click="cancelEdit"
          >
            Annuler
          </v-btn>
          <v-btn 
            color="primary" 
            variant="text" 
            @click="saveAndClose"
          >
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
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

const emit = defineEmits(['update:modelValue', 'save']);

// État local du dialogue
const dialogOpen = ref(false);
const tempValue = ref('');

// Ouvrir le dialogue (avec un champ vide)
const openDialog = () => {
  tempValue.value = '';
  dialogOpen.value = true;
};

// Annuler l'édition
const cancelEdit = () => {
  dialogOpen.value = false;
  tempValue.value = '';
};

// Sauvegarder et fermer
const saveAndClose = () => {
  if (tempValue.value) {
    emit('update:modelValue', tempValue.value);
    emit('save');
  }
  dialogOpen.value = false;
  tempValue.value = '';
};
</script> 