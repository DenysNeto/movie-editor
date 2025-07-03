<!-- components/ui/MoviePersonList.vue -->
<template>
  <div v-if="people.length" class="mb-4">
    <h2 class="text-2xl font-bold mb-2">{{ title }}:</h2>
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="person in visiblePeople"
        :key="person.id"
        class="text-center cursor-pointer transform transition-transform duration-200 hover:scale-105 hover:shadow-lg rounded-lg p-2"
        @click="goToPersonDetails(person.id)">
        <img
          v-if="person.profile_path"
          :src="`https://image.tmdb.org/t/p/w185${person.profile_path}`"
          :alt="person.name"
          class="w-24 h-24 object-cover rounded-full mx-auto mb-2 border-2 border-gray-700" />
        <div
          v-else
          class="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-400 text-xs">
          Нет фото
        </div>
        <p class="text-sm font-semibold">{{ person.name }}</p>
        <p v-if="person.character" class="text-xs text-gray-400">
          {{ person.character }}
        </p>
      </div>
    </div>
    <button
      v-if="people.length > initialCount"
      @click="toggleShowAll"
      class="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
      {{ showAll ? `↓ ${title.toLowerCase()}` : `↑  ${title.toLowerCase()}` }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  people: {
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

const router = useRouter();
const showAll = ref(false);

const visiblePeople = computed(() => {
  return showAll.value
    ? props.people
    : props.people.slice(0, props.initialCount);
});

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const goToPersonDetails = (personId) => {
  router.push(`/person/${personId}`);
};
</script>

<style scoped></style>
