<template>
  <div
    class="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md dark:bg-gray-800">
    <h1
      class="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
      Movie Explorer
    </h1>
    <input
      v-model="query"
      @input="emitSearch"
      class="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
      placeholder="Search movies..." />
  </div>
</template>

<script setup>
const query = ref("");
const emit = defineEmits(["search"]);

function emitSearch() {
  emit("search", query.value);
}
</script>

<style scoped></style>
