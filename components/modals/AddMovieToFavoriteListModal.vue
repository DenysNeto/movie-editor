<template>
  <div
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
    @click.self="closeModal">
    <div class="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
      <button
        @click="closeModal"
        class="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
        aria-label="Закрыть">
        &times;
      </button>

      <h2 class="text-2xl font-bold text-white mb-4">
        {{ $t("add_movie_modal.title", { movieTitle: movie.title }) }}
      </h2>

      <!-- Переключение между выбором списка и созданием нового -->
      <div v-if="user" class="flex justify-center mb-4 space-x-4">
        <button
          @click="showCreateNewListForm = false"
          :class="[
            'py-2 px-4 rounded-lg transition-colors duration-200',
            !showCreateNewListForm
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
          ]">
          {{ $t("add_movie_modal.select_existing_tab") }}
        </button>
        <button
          @click="showCreateNewListForm = true"
          :class="[
            'py-2 px-4 rounded-lg transition-colors duration-200',
            showCreateNewListForm
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600',
          ]">
          {{ $t("add_movie_modal.create_new_tab") }}
        </button>
      </div>

      <!-- Форма для создания нового списка -->
      <div v-if="showCreateNewListForm">
        <h3 class="text-xl font-bold text-white mb-3">
          {{ $t("add_movie_modal.create_new_list_heading") }}
        </h3>
        <input
          type="text"
          v-model="newListName"
          :placeholder="$t('add_movie_modal.new_list_name_placeholder')"
          class="border border-gray-600 bg-gray-700 text-white p-2 rounded-md w-full mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <p v-if="nameExistsError" class="text-red-500 text-sm mb-2">
          {{ $t("add_movie_modal.list_name_exists_error") }}
        </p>
        <p v-if="createListError" class="text-red-500 text-sm mb-2">
          {{ createListError }}
        </p>
        <button
          @click="handleCreateNewList"
          :disabled="!newListName.trim()"
          :class="[
            'w-full py-2 px-4 rounded-lg transition-colors duration-200',
            newListName.trim()
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed',
          ]">
          {{ $t("add_movie_modal.create_list_button") }}
        </button>
      </div>

      <!-- Выбор существующего списка -->
      <div v-else>
        <div v-if="isLoading" class="text-center text-gray-400">
          {{ $t("add_movie_modal.loading_lists") }}
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          {{ $t("add_movie_modal.error_prefix") }} {{ error }}
        </div>
        <div
          v-else-if="favoriteLists.length === 0"
          class="text-center text-gray-400">
          {{ $t("add_movie_modal.no_lists_found") }}
        </div>
        <div v-else class="space-y-3 max-h-60 overflow-y-auto pr-2">
          <div
            v-for="list in favoriteLists"
            :key="list.id"
            @click="selectedListId = list.id"
            :class="[
              'p-3 rounded-md cursor-pointer transition-colors duration-200',
              selectedListId === list.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-700 hover:bg-gray-600 text-gray-200',
            ]">
            <h3 class="font-semibold">{{ list.name }}</h3>
            <p class="text-sm text-gray-400">
              {{
                $t("add_movie_modal.movie_count", { count: list.items.length })
              }}
            </p>
          </div>
        </div>

        <p v-if="addError" class="text-red-500 text-sm mt-4">{{ addError }}</p>

        <div class="mt-6 flex justify-end space-x-3">
          <NuxtLink v-if="!user" to="/auth">
            <button
              class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
              {{ $t("add_movie_modal.login_register_button") }}
            </button>
          </NuxtLink>
          <button
            v-if="user"
            @click="closeModal"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
            {{ $t("add_movie_modal.cancel_button") }}
          </button>
          <button
            v-if="user"
            @click="handleAddToFavoriteList"
            :disabled="!selectedListId"
            :class="[
              'font-bold py-2 px-4 rounded-lg transition-colors duration-200',
              selectedListId
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed',
            ]">
            {{ $t("add_movie_modal.add_button") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import useFavoriteLists from "~/composables/useFavoriteLists";
import useToast from "~/composables/useToast";
import { useNuxtApp } from "#app";
import useUser from "~/composables/useUser";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { user } = useUser();

const props = defineProps({
  movie: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.id && value.title && value.posterUrl;
    },
  },
});

const emit = defineEmits(["close", "movie-added"]);

const {
  favoriteLists,
  isLoading,
  error,
  fetchFavoriteLists,
  addMovieToFavoriteList,
  addFavoriteList,
} = useFavoriteLists();
const { showToast } = useToast();

const { $auth } = useNuxtApp();

const selectedListId = ref(null);
const addError = ref(null);
const showCreateNewListForm = ref(false);
const newListName = ref("");
const nameExistsError = ref(false);
const createListError = ref(null);

const closeModal = () => {
  emit("close");
};

const handleAddToFavoriteList = async () => {
  addError.value = null;
  if (!selectedListId.value) {
    addError.value = t("add_movie_modal.select_list_error");
    return;
  }

  const success = await addMovieToFavoriteList(
    selectedListId.value,
    props.movie
  );

  if (success) {
    emit("movie-added", { listId: selectedListId.value, movie: props.movie });
    showToast(
      t("add_movie_modal.movie_added_success", {
        movieTitle: props.movie.title,
      }),
      "success"
    );
    closeModal();
  } else {
    addError.value = error.value || t("add_movie_modal.failed_to_add_movie");
    showToast(addError.value, "error");
  }
};

const handleCreateNewList = async () => {
  nameExistsError.value = false;
  createListError.value = null;

  const trimmedName = newListName.value.trim();
  if (trimmedName === "") {
    createListError.value = t("add_movie_modal.list_name_empty_error");
    return;
  }

  const newList = await addFavoriteList(trimmedName);

  if (newList) {
    selectedListId.value = newList.id;
    newListName.value = "";
    showCreateNewListForm.value = false;
    showToast(
      t("add_movie_modal.list_created_success", { listName: newList.name }),
      "success"
    );
    await handleAddToFavoriteList();
  } else {
    if (
      error.value &&
      error.value.includes(t("add_movie_modal.list_name_exists_error"))
    ) {
      nameExistsError.value = true;
      showToast(t("add_movie_modal.list_name_exists_error"), "error");
    } else {
      createListError.value =
        error.value || t("add_movie_modal.failed_to_create_list");
      showToast(createListError.value, "error");
    }
  }
};

onMounted(() => {
  if ($auth.currentUser) {
    fetchFavoriteLists();
  } else {
    addError.value = t("add_movie_modal.auth_required_info");
    showToast(addError.value, "info");
  }
});

watch(
  favoriteLists,
  (newLists) => {
    if (newLists.length > 0 && !selectedListId.value) {
      selectedListId.value = newLists[0].id;
    }
  },
  { immediate: true }
);
</script>

<style scoped></style>
