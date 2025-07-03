<template>
  <NuxtLink
    :to="`/movies/${movie.id}`"
    class="block bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 cursor-pointer">
    <img
      :src="movie.posterUrl"
      :alt="movie.title"
      class="w-full h-64 object-cover" />

    <div class="p-4 flex flex-col justify-between h-auto">
      <div>
        <h3 class="text-xl font-semibold text-white mb-1 truncate">
          {{ movie.title }}
        </h3>
        <p class="text-gray-400 text-sm">{{ movie.releaseYear }}</p>
      </div>
      <div v-if="movie.voteAverage" class="flex items-center mt-2">
        <svg
          class="w-4 h-4 text-yellow-400 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.729c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path>
        </svg>
        <span class="text-yellow-400 font-bold text-base">{{
          movie.voteAverage.toFixed(1)
        }}</span>
      </div>
      <button
        @click.prevent="$emit('add-to-favorite', movie)"
        class="cursor-pointer mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
        Добавить в избранное
      </button>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  movie: {
    type: Object,
    required: true,
    default: () => ({
      title: "Название фильма",
      posterUrl: "https://via.placeholder.com/300x450?text=No+Image",
      releaseYear: "Год",
      voteAverage: null,
    }),
  },
});

const emit = defineEmits(["add-to-favorite"]);
</script>

<style scoped></style>
