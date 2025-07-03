<template>
  <div class="container mx-auto p-4">
    <h1
      class="text-white text-5xl font-extrabold mb-8 text-center tracking-wide">
      {{ $t("favorites.title") }}
    </h1>

    <div class="flex justify-end mb-6">
      <button
        @click="showAddListModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 flex items-center">
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        {{ $t("favorites.add_new_list_button") }}
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-400 py-12 text-xl">
      {{ $t("favorites.loading_lists") }}
    </div>
    <div v-else-if="error" class="text-center text-red-500 py-12 text-xl">
      {{ $t("favorites.error_prefix") }} {{ error }}
    </div>
    <div
      v-else-if="favoriteLists.length === 0"
      class="text-center text-gray-400 py-12">
      <svg
        class="mx-auto h-16 w-16 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
      </svg>
      <p class="mt-4 text-xl font-semibold">
        {{ $t("favorites.no_lists_title") }}
      </p>
      <p class="mt-2 text-lg">
        {{ $t("favorites.no_lists_cta") }}
      </p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="list in favoriteLists"
        :key="list.id"
        @click="openViewMoviesModal(list)"
        class="bg-gray-800 p-6 rounded-lg shadow-xl cursor-pointer hover:bg-gray-700 transition-all duration-300 border border-transparent hover:border-blue-500">
        <div class="flex items-center mb-2">
          <svg
            class="w-8 h-8 text-blue-400 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM11 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z"></path>
          </svg>
          <h2 class="text-2xl font-semibold text-white">{{ list.name }}</h2>
        </div>
        <p class="text-gray-300 text-lg">
          {{ $t("favorites.movie_count", { count: list.items.length }) }}
        </p>

        <div
          v-if="list.items.length > 0"
          class="flex mt-4 -space-x-2 overflow-hidden">
          <img
            v-for="item in list.items.slice(0, 3)"
            :key="item.id"
            :src="item.posterUrl"
            :alt="item.title"
            class="inline-block h-12 w-12 rounded-full ring-2 ring-gray-800 object-cover" />
          <span
            v-if="list.items.length > 3"
            class="flex items-center justify-center h-12 w-12 rounded-full bg-gray-700 text-gray-300 text-xs ring-2 ring-gray-800"
            >+{{ list.items.length - 3 }}</span
          >
        </div>
      </div>
    </div>

    <div
      v-if="showAddListModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div class="bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h3 class="text-3xl font-bold text-white mb-4 text-center">
          {{ $t("favorites.add_list_modal.title") }}
        </h3>
        <input
          type="text"
          v-model="newListName"
          :placeholder="$t('favorites.add_list_modal.input_placeholder')"
          class="border border-gray-700 bg-gray-800 text-white p-3 rounded-md w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p v-if="nameExistsError" class="text-red-500 text-sm mb-2">
          {{ $t("favorites.add_list_modal.name_exists_error") }}
        </p>
        <p v-if="addListError" class="text-red-500 text-sm mb-2">
          {{ addListError }}
        </p>
        <div class="flex justify-end space-x-4 mt-6">
          <button
            @click="closeAddListModal"
            class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
            {{ $t("favorites.add_list_modal.cancel_button") }}
          </button>
          <button
            @click="handleAddNewList"
            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
            {{ $t("favorites.add_list_modal.create_button") }}
          </button>
        </div>
      </div>
    </div>

    <ViewFavoriteListMoviesModal
      v-if="showViewMoviesModal"
      :favoriteList="selectedFavoriteList"
      @close="closeViewMoviesModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import useFavoriteLists from "~/composables/useFavoriteLists";
import ViewFavoriteListMoviesModal from "~/components/modals/ViewFavoriteListMoviesModal.vue";
import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

const showAddListModal = ref(false);
const newListName = ref("");
const nameExistsError = ref(false);
const addListError = ref(null);

const showViewMoviesModal = ref(false);
const selectedFavoriteList = ref(null);

const { favoriteLists, isLoading, error, fetchFavoriteLists, addFavoriteList } =
  useFavoriteLists();
const { $auth } = useNuxtApp();

const handleAddNewList = async () => {
  nameExistsError.value = false;
  addListError.value = null;

  const result = await addFavoriteList(newListName.value);

  if (result) {
    newListName.value = "";
    closeAddListModal();
  } else {
    if (
      error.value &&
      error.value.includes(t("favorites.errors.name_already_exists_partial"))
    ) {
      nameExistsError.value = true;
    } else {
      addListError.value = error.value;
    }
  }
};

const closeAddListModal = () => {
  showAddListModal.value = false;
  newListName.value = "";
  nameExistsError.value = false;
  addListError.value = null;
};

const openViewMoviesModal = (list) => {
  selectedFavoriteList.value = list;
  showViewMoviesModal.value = true;
};

const closeViewMoviesModal = () => {
  showViewMoviesModal.value = false;
  selectedFavoriteList.value = null;
};

const pluralize = (count, one, few, many) => {
  if (count === 1) {
    return one;
  }
  if (count >= 2 && count <= 4) {
    return few;
  }
  return many;
};

onMounted(() => {
  $auth.onAuthStateChanged((user) => {
    if (user) {
      fetchFavoriteLists();
    } else {
      favoriteLists.value = [];
    }
  });
  fetchFavoriteLists();
});
</script>

<style scoped></style>
