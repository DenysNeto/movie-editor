<template>
  <div class="min-h-screen bg-gray-900 overflow-x-hidden">
    <Header />
    <NuxtPage />
    <FooterC />
    <ToastNotification
      :message="toastMessage"
      :type="toastType"
      :duration="toastDuration"
      v-model:show="isToastVisible" />
  </div>
</template>

<script setup>
import Header from "~/components/ui/Header.vue";
import FooterC from "~/components/ui/FooterC.vue";
import { computed } from "vue";
import useToast from "~/composables/useToast";
import ToastNotification from "~/components/ui/ToastNotification.vue";

const { message, type, duration, isVisible } = useToast();

const toastMessage = computed(() => message.value);
const toastType = computed(() => type.value);
const toastDuration = computed(() => duration.value);
const isToastVisible = computed({
  get: () => isVisible.value,
  set: (val) => {
    isVisible.value = val;
    if (!val) {
      useToast().hideToast();
    }
  },
});
</script>
