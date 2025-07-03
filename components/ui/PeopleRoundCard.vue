<template>
  <img
    v-if="path"
    :src="`https://image.tmdb.org/t/p/w185${path}`"
    :alt="name"
    class="w-24 h-24 object-cover rounded-full mx-auto mb-2 border-2 border-gray-700 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50" />
  <div
    v-else
    class="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-400 text-xs">
    No photo
  </div>
</template>

<script setup>
const props = defineProps({
  name: String,
  path: String,
});
</script>

<style scoped></style>
