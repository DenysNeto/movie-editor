<template>
  <div class="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
    <h2 class="text-2xl font-bold text-white mb-4">Фильтры поиска</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Поиск по названию -->
      <div>
        <label
          for="searchQuery"
          class="block text-gray-300 text-sm font-bold mb-2"
          >Название фильма:</label
        >
        <input
          type="text"
          id="searchQuery"
          v-model="searchQuery"
          @input="emitFilters"
          placeholder="Введите название фильма..."
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white" />
      </div>

      <!-- Фильтр по жанрам -->
      <div>
        <label for="genre" class="block text-gray-300 text-sm font-bold mb-2"
          >Жанр:</label
        >
        <select
          id="genre"
          v-model="selectedGenre"
          @change="emitFilters"
          class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white">
          <option value="">Все жанры</option>
          <option v-for="genre in genres" :key="genre.id" :value="genre.id">
            {{ genre.name }}
          </option>
        </select>
      </div>

      <!-- Дополнительные фильтры (пока заглушка) -->
      <!-- <div>
        <label for="actor" class="block text-gray-300 text-sm font-bold mb-2">Актер:</label>
        <input
          type="text"
          id="actor"
          v-model="searchActor"
          @input="emitFilters"
          placeholder="Введите имя актера..."
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
        />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useTmdbApi } from "~/composables/useTmdbApi";

const { getMovieGenres } = useTmdbApi();

const searchQuery = ref("");
const selectedGenre = ref("");
const genres = ref([]);

const emit = defineEmits(["filter-changed"]);

onMounted(async () => {
  try {
    const response = await getMovieGenres("ru-RU");
    if (response && response.genres) {
      genres.value = response.genres;
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
});

const emitFilters = () => {
  emit("filter-changed", {
    query: searchQuery.value,
    genre: selectedGenre.value,
    // actor: searchActor.value, а
  });
};
</script>

<style scoped></style>
