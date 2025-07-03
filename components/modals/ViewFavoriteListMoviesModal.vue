<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
    @click.self="closeModal">
    <div
      class="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-4xl relative h-5/6 flex flex-col">
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
        aria-label="Закрыть">
        &times;
      </button>

      <h2 class="text-2xl font-bold text-white mb-4">
        Фильмы в списке: "{{ favoriteList.name }}"
      </h2>

      <div
        v-if="favoriteList.items.length === 0"
        class="text-center text-gray-400 flex-grow flex items-center justify-center">
        <p>В этом списке пока нет фильмов.</p>
      </div>
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 flex-grow">
        <MovieCard
          v-for="movie in favoriteList.items"
          :key="movie.id"
          :movie="movie" />
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="closeModal"
          class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import MovieCard from "~/components/ui/MovieCard.vue";

const props = defineProps({
  favoriteList: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.id && value.name && Array.isArray(value.items);
    },
  },
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit("close");
};
</script>

<style scoped></style>
