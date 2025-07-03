<template>
  <div v-if="movies.length" class="mb-4">
    <h2 class="pb-4 text-center text-2xl font-bold mb-2">{{ title }}:</h2>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <NuxtLink
        v-for="movie in visibleMovies"
        :key="movie.id"
        :to="`/movies/${movie.id}`"
        class="block">
        <MovieCard
          :movie="movie"
          @add-to-favorite="openAddMovieToFavoriteModal" />
      </NuxtLink>

      <AddMovieToFavoriteListModal
        v-if="showAddMovieToFavoriteModal"
        :movie="selectedMovie"
        @close="closeAddMovieToFavoriteModal"
        @movie-added="handleMovieAdded" />
    </div>
    <button
      v-if="movies.length > initialCount"
      @click="toggleShowAll"
      class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 mx-auto block">
      {{
        showAll
          ? `&uarr; ${title.toLowerCase()}`
          : `&darr;  ${title.toLowerCase()}`
      }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import MovieCard from "~/components/ui/MovieCard.vue";
import AddMovieToFavoriteListModal from "~/components/modals/AddMovieToFavoriteListModal.vue";

const props = defineProps({
  movies: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  initialCount: {
    type: Number,
    default: 5,
  },
});

const showAll = ref(false);
const showAddMovieToFavoriteModal = ref(false);
const selectedMovie = ref(null);

const visibleMovies = computed(() => {
  return showAll.value
    ? props.movies
    : props.movies.slice(0, props.initialCount);
});

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

function openAddMovieToFavoriteModal(movie) {
  showAddMovieToFavoriteModal.value = true;
  selectedMovie.value = movie;
}

function closeAddMovieToFavoriteModal() {
  showAddMovieToFavoriteModal.value = false;
}
</script>

<style scoped></style>
