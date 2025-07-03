<template>
  <div
    v-if="isVisible"
    :class="[
      'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white transition-all duration-300 transform',
      toastTypeClasses,
      { 'translate-y-0 opacity-100': isVisible },
      { 'translate-y-full opacity-0': !isVisible },
    ]"
    style="z-index: 1000">
    <div class="flex items-center">
      <svg
        v-if="type === 'success'"
        class="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <svg
        v-else-if="type === 'error'"
        class="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2A9 9 0 111 10a9 9 0 0118 0z"></path>
      </svg>
      <svg
        v-else-if="type === 'info'"
        class="w-6 h-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <p class="font-semibold">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "info", // 'success', 'error', 'info'
    validator: (value) => ["success", "error", "info"].includes(value),
  },
  duration: {
    type: Number,
    default: 3000,
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:show"]);

const isVisible = ref(props.show);
let timeoutId = null;

const toastTypeClasses = computed(() => {
  switch (props.type) {
    case "success":
      return "bg-green-500";
    case "error":
      return "bg-red-500";
    case "info":
    default:
      return "bg-blue-500";
  }
});

const hideToast = () => {
  isVisible.value = false;
  emit("update:show", false);
};

watch(
  () => props.show,
  (newVal) => {
    isVisible.value = newVal;
    if (newVal) {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        hideToast();
      }, props.duration);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId);
});
</script>

<style scoped></style>
