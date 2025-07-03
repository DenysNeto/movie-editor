<!-- pages/movies/[id].vue -->
<template>
  <div class="container mx-auto p-4 text-white">
    <div v-if="pending">
      <p class="text-center text-xl text-gray-400">
        {{ $t("movie.loading_movie_info") }}
      </p>
    </div>
    <div v-else-if="error">
      <p class="text-center text-xl text-red-500">
        {{ $t("movie.error_loading_data") }} {{ error.message }}
      </p>
    </div>
    <div v-else-if="movie">
      <!-- Основная информация о фильме (постер + детали) -->
      <div class="flex flex-col md:flex-row gap-8 mb-8">
        <!-- Постер фильма -->
        <div class="md:w-1/3">
          <img
            :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
            :alt="movie.title"
            class="rounded-lg shadow-lg w-full" />
        </div>

        <!-- Информация о фильме -->
        <div class="md:w-2/3">
          <h1 class="text-4xl font-bold mb-2">
            {{ movie.title }} ({{ new Date(movie.release_date).getFullYear() }})
          </h1>
          <p v-if="movie.tagline" class="text-xl italic text-gray-400 mb-4">
            "{{ movie.tagline }}"
          </p>

          <div class="flex items-center mb-4">
            <span class="text-yellow-500 text-2xl mr-2">⭐</span>
            <span class="text-xl font-semibold"
              >{{ movie.vote_average?.toFixed(1) }}/10</span
            >
            <span class="text-gray-400 ml-2"
              >({{ movie.vote_count }} {{ $t("movie.votes") }})</span
            >
          </div>

          <p class="text-gray-300 mb-4">{{ movie.overview }}</p>

          <div class="mb-4">
            <h2 class="text-2xl font-bold mb-2">{{ $t("movie.genres") }}:</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="genre in movie.genres"
                :key="genre.id"
                class="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                {{ genre.name }}
              </span>
            </div>
          </div>

          <!-- Актерский состав -->
          <div class="border-t pt-8 mt-8 border-gray-700">
            <MoviePersonList
              v-if="actors.length"
              :people="actors"
              :title="$t('movie.cast')" />
          </div>

          <!-- Режиссеры -->
          <div class="border-t pt-8 mt-8 border-gray-700">
            <MoviePersonList
              v-if="directors.length"
              :people="directors"
              :title="$t('movie.directors')" />
          </div>
        </div>
      </div>

      <!-- Трейлер фильма -->
      <div v-if="trailerUrl" class="border-t pt-8 mt-8 border-gray-700">
        <h2 class="text-center text-2xl font-bold mb-4">
          {{ $t("movie.trailer") }}
        </h2>
        <div class="bg-gray-800 p-4 rounded-lg shadow-xl">
          <div class="aspect-w-16 aspect-h-9">
            <iframe
              :src="trailerUrl"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full rounded-lg shadow-lg"></iframe>
          </div>
        </div>
      </div>

      <!-- Похожие фильмы -->
      <div class="border-t pt-8 mt-8 border-gray-700">
        <MovieSectionList
          v-if="similarMovies.length"
          :movies="similarMovies"
          :title="$t('movie.similar_movies')" />
      </div>

      <!-- Рекомендованные фильмы -->
      <div class="border-t pt-8 mt-8 border-gray-700">
        <MovieSectionList
          v-if="recommendedMovies.length"
          :movies="recommendedMovies"
          :title="$t('movie.recommended_movies')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useTmdbApi } from "~/composables/useTmdbApi";
import MoviePersonList from "~/components/ui/MoviePersonList.vue";
import MovieSectionList from "~/components/ui/MovieSectionList.vue";
import { useI18n } from "vue-i18n";

const route = useRoute();
const {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  getRecommendedMovies,
  getMovieVideos,
  handlePosterUrl,
} = useTmdbApi();
const { locale } = useI18n();

const { data, pending, error } = useAsyncData(
  () => `movie-${route.params.id}-${locale.value}`,
  async () => {
    const movieId = route.params.id;
    if (!movieId) {
      throw new Error("Movie ID is missing");
    }

    const [
      movieData,
      creditsData,
      similarResponse,
      recommendedResponse,
      videosData,
    ] = await Promise.all([
      getMovieDetails(movieId, locale.value),
      getMovieCredits(movieId, locale.value),
      getSimilarMovies(movieId, locale.value),
      getRecommendedMovies(movieId, locale.value),
      getMovieVideos(movieId, locale.value),
    ]);

    const trailer = videosData?.results?.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    return {
      movie: movieData,
      actors:
        creditsData?.cast?.filter(
          (person) => person.known_for_department === "Acting"
        ) || [],
      directors:
        creditsData?.crew?.filter((person) => person.job === "Director") || [],
      similarMovies: handlePosterUrl(similarResponse?.results || []),
      recommendedMovies: handlePosterUrl(recommendedResponse?.results || []),
      trailerKey: trailer ? trailer.key : null,
    };
  },
  {
    watch: [locale],
  }
);

const movie = computed(() => data.value?.movie);
const actors = computed(() => data.value?.actors || []);
const directors = computed(() => data.value?.directors || []);
const similarMovies = computed(() => data.value?.similarMovies || []);
const recommendedMovies = computed(() => data.value?.recommendedMovies || []);
const trailerKey = computed(() => data.value?.trailerKey);

const trailerUrl = computed(() => {
  return trailerKey.value
    ? `https://www.youtube.com/embed/${trailerKey.value}`
    : null;
});

watch([() => route.params.id, locale], () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
</script>

<style scoped>
/* Дополнительные стили, если нужны */
/* Для aspect-ratio */
.aspect-w-16 {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.aspect-w-16 iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
