<!-- pages/person/[id].vue -->
<template>
  <div class="container mx-auto p-4 text-white">
    <div v-if="person" class="flex flex-col md:flex-row gap-8">
      <!-- Фото человека -->
      <div class="md:w-1/3">
        <img
          v-if="person.profile_path"
          :src="`https://image.tmdb.org/t/p/w500${person.profile_path}`"
          :alt="person.name"
          class="rounded-lg shadow-lg w-full" />
        <div
          v-else
          class="w-full h-auto bg-gray-700 rounded-lg shadow-lg flex items-center justify-center text-gray-400 text-xl p-8">
          {{ $t("person.no_photo") }}
        </div>
      </div>

      <!-- Информация о человеке -->
      <div class="md:w-2/3">
        <h1 class="text-4xl font-bold mb-2">{{ person.name }}</h1>
        <p v-if="person.birthday" class="text-gray-300 mb-2">
          {{ $t("person.date_of_birth") }}
          {{ new Date(person.birthday).toLocaleDateString("ru-RU") }}
        </p>
        <p v-if="person.place_of_birth" class="text-gray-300 mb-4">
          {{ $t("person.place_of_birth") }} {{ person.place_of_birth }}
        </p>

        <h2 class="text-2xl font-bold mb-2">{{ $t("person.biography") }}</h2>
        <p class="text-gray-300 mb-4">
          {{ person.biography || $t("person.biography_unavailable") }}
        </p>

        <!-- Фильмография -->
        <div v-if="movieCredits.length" class="mb-4">
          <h2 class="text-2xl font-bold mb-2">
            {{ $t("person.filmography") }}
          </h2>
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <NuxtLink
              v-for="credit in visibleMovieCredits"
              :key="credit.id"
              :to="`/movies/${credit.id}`"
              class="block">
              <MovieCard :movie="credit" />
            </NuxtLink>
          </div>
          <button
            v-if="movieCredits.length > initialMovieCreditCount"
            @click="toggleShowAllMovieCredits"
            class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
            {{
              showAllMovieCredits
                ? $t("person.hide")
                : $t("person.show_all_movies")
            }}
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-xl text-gray-400">
      {{ $t("person.loading_person_info") }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useTmdbApi } from "~/composables/useTmdbApi";
import MovieCard from "~/components/ui/MovieCard.vue";
import { useI18n } from "vue-i18n";

const route = useRoute();
const { getPersonDetails, getPersonMovieCredits } = useTmdbApi();
const { t } = useI18n();

const person = ref(null);
const movieCredits = ref([]);

const initialMovieCreditCount = 5;
const showAllMovieCredits = ref(false);

const visibleMovieCredits = computed(() => {
  return showAllMovieCredits.value
    ? movieCredits.value
    : movieCredits.value.slice(0, initialMovieCreditCount);
});

const toggleShowAllMovieCredits = () => {
  showAllMovieCredits.value = !showAllMovieCredits.value;
};

onMounted(async () => {
  const personId = route.params.id;

  if (personId) {
    try {
      const personData = await getPersonDetails(personId, "ru-RU");
      person.value = personData;

      const creditsData = await getPersonMovieCredits(personId, "ru-RU");
      if (creditsData && creditsData.cast) {
        movieCredits.value = creditsData.cast.sort((a, b) => {
          const dateA = a.release_date ? new Date(a.release_date) : new Date(0);
          const dateB = b.release_date ? new Date(b.release_date) : new Date(0);
          return dateB - dateA;
        });

        movieCredits.value = movieCredits.value.map((el) => {
          return {
            ...el,
            posterUrl: el.poster_path
              ? `https://image.tmdb.org/t/p/w92${el.poster_path}`
              : null,
          };
        });
      }
    } catch (error) {
      console.error("Ошибка при загрузке данных о человеке:", error);
    }
  }
});
</script>

<style scoped>
/* Дополнительные стили, если нужны */
</style>
