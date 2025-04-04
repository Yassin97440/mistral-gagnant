<template>
  <div class="confluence-page">
    <div v-if="loading">Chargement de la page...</div>
    <div v-else-if="error">Erreur: {{ error }}</div>
    <div v-else>
      <!-- <h1>{{ page.title }}</h1> -->
      <div v-html="page.value.data"></div>
    </div>
    <!-- <div>
      <button @on-click="call()"></button>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  pageId: {
    type: String,
    required: true,
  },
});

const { getPage } = useConfluence();
const page = ref(null);
const loading = ref(true);
const error = ref(null);

// const call = () => {
//   page.value = getPage(props.pageId);
//   console.log("koikoi", page.value);
// };
onMounted(async () => {
  try {
    loading.value = true;
    page.value = await getPage(props.pageId);
  } catch (err) {
    error.value = err.message || "Une erreur est survenue";
  } finally {
    loading.value = false;
  }
});
</script>
