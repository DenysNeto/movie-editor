<template>
  <div class="flex justify-center items-center space-x-2 my-8">
    <button
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
      {{ $t("previous") }}
    </button>

    <!-- Номера страниц -->
    <template v-for="page in pages" :key="page">
      <button
        v-if="page !== '...'"
        @click="goToPage(page)"
        :class="[
          'cursor-pointer px-4 py-2 rounded-lg transition-colors duration-200',
          page === currentPage
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-white hover:bg-gray-600',
        ]">
        {{ page }}
      </button>
      <span v-else class="px-4 py-2 text-gray-400">...</span>
    </template>

    <!-- Кнопка "Следующая" -->
    <button
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="cursor-pointer px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
      {{ $t("next") }}
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisibleButtons: {
    type: Number,
    default: 5,
  },
});

const emit = defineEmits(["page-changed"]);

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("page-changed", page);
  }
};

const pages = computed(() => {
  const range = [];
  const startPage = Math.max(
    1,
    props.currentPage - Math.floor(props.maxVisibleButtons / 2)
  );
  const endPage = Math.min(
    props.totalPages,
    startPage + props.maxVisibleButtons - 1
  );

  if (startPage > 1) {
    range.push(1);
    if (startPage > 2) {
      range.push("...");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    range.push(i);
  }

  if (endPage < props.totalPages) {
    if (endPage < props.totalPages - 1) {
      range.push("...");
    }
    range.push(props.totalPages);
  }

  return range;
});
</script>

<style scoped></style>
