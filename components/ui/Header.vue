<template>
  <header class="bg-gray-800 text-white p-4 shadow-md">
    <div class="container mx-auto flex items-center">
      <div class="flex justify-center space-x-6">
        <NuxtLink
          to="https://ndd-webstudio-biu4.vercel.app/"
          class="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200 flex-shrink-0">
          <img
            src="../../assets/img/webstudio_logo.png"
            alt="Постер"
            class="w-20 h-15 object-cover rounded mr-3" />
        </NuxtLink>
      </div>

      <NuxtLink
        to="/"
        class="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-200 flex-shrink-0">
        {{ user ? user.email : "Movie Explorer" }}
      </NuxtLink>

      <!-- Search Bar (Center) -->
      <div
        class="flex-grow flex justify-center mx-4 relative"
        ref="searchContainer">
        <div class="relative w-full max-w-md">
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <!-- Search Icon -->
            <svg
              class="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <input
            type="text"
            :placeholder="$t('header.search_placeholder')"
            v-model="searchQuery"
            @focus="showResults = true"
            class="p-2 pl-10 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />

          <!-- Autocomplete Results -->
          <div
            v-if="showResults && searchResults.length > 0"
            class="absolute z-10 w-full bg-gray-700 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
            <NuxtLink
              v-for="movie in searchResults"
              :key="movie.id"
              :to="`/movies/${movie.id}`"
              @click="clearSearch"
              class="flex items-center p-2 hover:bg-gray-600 cursor-pointer">
              <img
                v-if="movie.poster_path"
                :src="`https://image.tmdb.org/t/p/w92${movie.poster_path}`"
                :alt="movie.title"
                class="w-10 h-15 rounded mr-2 flex-shrink-0" />
              <div class="flex-grow">
                <div class="font-semibold">{{ movie.title }}</div>
                <div v-if="movie.release_date" class="text-sm text-gray-400">
                  {{ new Date(movie.release_date).getFullYear() }}
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Navigation (Right) -->
      <nav class="flex-shrink-0">
        <ul class="flex space-x-4 items-center">
          <li>
            <NuxtLink
              to="/"
              class="hover:text-blue-400 transition-colors duration-200"
              >{{ $t("header.home") }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              v-if="user"
              to="/favorites"
              class="hover:text-blue-400 transition-colors duration-200"
              >{{ $t("header.favorites") }}</NuxtLink
            >
          </li>
          <li>
            <NuxtLink
              to="/about"
              class="hover:text-blue-400 transition-colors duration-200"
              >{{ $t("header.about") }}</NuxtLink
            >
          </li>
          <!-- Language Selector -->
          <li class="relative">
            <button
              @click="toggleLanguageDropdown"
              class="flex items-center hover:text-blue-400 transition-colors duration-200">
              {{ currentLanguageDisplay }}
              <svg
                class="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div
              v-if="showLanguageDropdown"
              class="absolute right-0 mt-2 w-32 bg-gray-700 rounded-md shadow-lg z-10">
              <a
                @click="setLanguage('ru')"
                class="block px-4 py-2 text-sm text-white hover:bg-gray-600 cursor-pointer"
                >{{ $t("header.language_ru") }}</a
              >
              <a
                @click="setLanguage('uk')"
                class="block px-4 py-2 text-sm text-white hover:bg-gray-600 cursor-pointer"
                >{{ $t("header.language_uk") }}</a
              >
              <a
                @click="setLanguage('en')"
                class="block px-4 py-2 text-sm text-white hover:bg-gray-600 cursor-pointer"
                >{{ $t("header.language_en") }}</a
              >
            </div>
          </li>
          <!-- Кнопка "Выйти" -->
          <li v-if="user">
            <button
              @click="handleLogout"
              class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
              {{ $t("header.logout_button") }}
            </button>
          </li>
          <li v-else>
            <NuxtLink to="/auth">
              <button
                class="bg-green-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                {{ $t("header.login_button") }}
              </button>
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useTmdbApi } from "~/composables/useTmdbApi";
import { useNuxtApp } from "#app";
import useUser from "~/composables/useUser";

const { locale, t } = useI18n();
const { searchMovies, handlePosterUrl } = useTmdbApi();
const { $auth } = useNuxtApp();
const { user } = useUser();

const showLanguageDropdown = ref(false);
const searchQuery = ref("");
const searchResults = ref([]);
const showResults = ref(false);
const searchContainer = ref(null);

let searchTimer = null;

watch(searchQuery, (newQuery) => {
  if (searchTimer) {
    clearTimeout(searchTimer);
  }
  if (newQuery.length > 2) {
    searchTimer = setTimeout(async () => {
      try {
        const response = await searchMovies(newQuery, locale.value);
        searchResults.value = handlePosterUrl(response?.results || []);
        showResults.value = true;
      } catch (e) {
        console.error("Ошибка при поиске фильмов:", e);
        searchResults.value = [];
      }
    }, 300);
  } else {
    searchResults.value = [];
    showResults.value = false;
  }
});

const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
  showResults.value = false;
};

const handleClickOutside = (event) => {
  if (searchContainer.value && !searchContainer.value.contains(event.target)) {
    showResults.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const currentLanguageDisplay = computed(() => {
  switch (locale.value) {
    case "ru":
      return t("header.language_ru");
    case "uk":
      return t("header.language_uk");
    case "en":
      return t("header.language_en");
    default:
      return t("header.language_display");
  }
});

const toggleLanguageDropdown = () => {
  showLanguageDropdown.value = !showLanguageDropdown.value;
};

const setLanguage = (lang) => {
  locale.value = lang;
  showLanguageDropdown.value = false;
};

const handleLogout = async () => {
  try {
    await $auth.signOut();
    navigateTo("/");
  } catch (error) {
    console.error("Ошибка при выходе из системы:", error);
  }
};
</script>

<style scoped></style>
