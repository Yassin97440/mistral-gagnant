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
    <MoleculesUpdateFieldDialog
      v-model:dialogOpen="dialogOpen"
      :modelValue="modelValue"
      :label="label"
      :icon="icon"
      :hasValue="hasValue"
      @update:modelValue="updateValue"
      @save="saveValue"
    />

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

// Ouvrir le dialogue
const openDialog = () => {
  dialogOpen.value = true;
};

// Mise à jour de la valeur
const updateValue = (newValue: string) => {
  emit('update:modelValue', newValue);
};

// Sauvegarde et notification
const saveValue = () => {
  emit('save');
};
</script> 