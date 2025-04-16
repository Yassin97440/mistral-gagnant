<template>
        <v-dialog v-model="dialogLocalOpen" max-width="500px" >
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
</template>

<script setup lang="ts">

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
  },
  value: {
    type: String,
    default: ''
  }

});
const emit = defineEmits(
    ['update:modelValue', 
    'save',
    'update:dialogOpen']);

// Utiliser une variable computed pour la liaison bidirectionnelle
const dialogLocalOpen = computed({
  get: () => props.dialogOpen,
  set: (value) => emit('update:dialogOpen', value)
});

// Utiliser une variable computed pour la liaison bidirectionnelle
const tempValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Annuler l'édition
const cancelEdit = () => {
  emit('update:dialogOpen', false);
};

// Sauvegarder et fermer
const saveAndClose = () => {
  emit('save');
  emit('update:dialogOpen', false);
};

</script>