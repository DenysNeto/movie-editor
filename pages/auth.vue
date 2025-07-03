<template>
  <div
    class="container mx-auto py-10 px-4 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
      <h1 class="text-4xl font-extrabold text-center mb-8 text-gray-800">
        Welcome!
      </h1>

      <div class="flex justify-center mb-8 space-x-4">
        <button
          @click="showRegisterForm = false"
          :class="{
            'px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300': true,
            'bg-green-600 text-white shadow-md': !showRegisterForm,
            'bg-gray-200 text-gray-700 hover:bg-gray-300': showRegisterForm,
          }">
          Login
        </button>
        <button
          @click="showRegisterForm = true"
          :class="{
            'px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300': true,
            'bg-blue-600 text-white shadow-md': showRegisterForm,
            'bg-gray-200 text-gray-700 hover:bg-gray-300': !showRegisterForm,
          }">
          Register
        </button>
      </div>

      <Transition name="fade" mode="out-in">
        <LoginForm v-if="!showRegisterForm" key="login" />
        <RegisterForm v-else key="register" />
      </Transition>

      <div class="mt-8 text-center">
        <p class="text-gray-600 mb-4">or</p>
        <button
          @click="continueAsGuest"
          class="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1">
          Continue as Guest
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import RegisterForm from "~/components/RegisterForm.vue";
import LoginForm from "~/components/LoginForm.vue";

const showRegisterForm = ref(false);

definePageMeta({
  middleware: "auth",
  layout: "auth",
});

const continueAsGuest = () => {
  navigateTo("/");
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
