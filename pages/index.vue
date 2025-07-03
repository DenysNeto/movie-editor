<template>
  <div class="container mx-auto p-4 text-white">
    <div v-if="pending">
      <p class="text-center text-xl text-gray-400">
        {{ $t("home.loading_movies") }}
      </p>
    </div>
    <div v-else-if="error">
      <p class="text-center text-xl text-red-500">
        {{ $t("home.error_loading_movies") }} {{ error.message }}
      </p>
    </div>
    <div v-else>
      <MovieSectionList
        v-if="nowPlayingMovies.length"
        :movies="nowPlayingMovies"
        :title="$t('home.now_playing')"
        class="mb-8" />

      <MovieSectionList
        v-if="upcomingMovies.length"
        :movies="upcomingMovies"
        :title="$t('home.upcoming_movies')"
        class="mb-8" />

      <MovieSectionList
        v-if="topRatedMovies.length"
        :movies="topRatedMovies"
        :title="$t('home.top_rated_movies')"
        class="mb-8" />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useTmdbApi } from "~/composables/useTmdbApi";
import MovieSectionList from "~/components/ui/MovieSectionList.vue";
import { useI18n } from "vue-i18n";

const {
  getNowPlayingMovies,
  getUpcomingMovies,
  getTopRatedMovies,
  handlePosterUrl,
} = useTmdbApi();
const { locale } = useI18n();

const { data, pending, error } = useAsyncData(
  () => `home-movies-${locale.value}`,
  async () => {
    const [nowPlayingResponse, upcomingResponse, topRatedResponse] =
      await Promise.all([
        getNowPlayingMovies(locale.value),
        getUpcomingMovies(locale.value),
        getTopRatedMovies(locale.value),
      ]);

    return {
      nowPlayingMovies: handlePosterUrl(nowPlayingResponse?.results || []),
      upcomingMovies: handlePosterUrl(upcomingResponse?.results || []),
      topRatedMovies: handlePosterUrl(topRatedResponse?.results || []),
    };
  },
  {
    watch: [locale],
  }
);

const nowPlayingMovies = computed(() => data.value?.nowPlayingMovies || []);
const upcomingMovies = computed(() => data.value?.upcomingMovies || []);
const topRatedMovies = computed(() => data.value?.topRatedMovies || []);
</script>

<style scoped></style>
