<template>
  <div
    class="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-8 text-center">
      Login
    </h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-6">
        <label
          for="loginEmail"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Email:</label
        >
        <input
          type="email"
          id="loginEmail"
          v-model="email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
          required
          autocomplete="email"
          placeholder="example@example.com" />
      </div>
      <div class="mb-6">
        <label
          for="loginPassword"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Password:</label
        >
        <input
          type="password"
          id="loginPassword"
          v-model="password"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-200 ease-in-out"
          required
          autocomplete="current-password"
          placeholder="123456" />
      </div>
      <div class="flex items-center justify-center">
        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading">
          <span v-if="!loading">Enter</span>
          <span v-else>Loading...</span>
        </button>
      </div>
      <p v-if="error" class="text-red-600 text-sm mt-4 text-center font-medium">
        {{ error }}
      </p>
      <p
        v-if="success"
        class="text-green-600 text-sm mt-4 text-center font-medium">
        {{ success }}
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";
import { signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const error = ref(null);
const success = ref(null);
const loading = ref(false);

const handleLogin = async () => {
  error.value = null;
  success.value = null;
  loading.value = true;
  try {
    const { $auth } = useNuxtApp();
    await signInWithEmailAndPassword($auth, email.value, password.value);
    success.value = "login sucessfully!";
    email.value = "";
    password.value = "";
    navigateTo("/");
  } catch (err) {
    console.error("Error login:", err.message);

    if (
      err.code === "auth/invalid-email" ||
      err.code === "auth/user-not-found" ||
      err.code === "auth/wrong-password"
    ) {
      error.value = "Wrong email or pasword.";
    } else {
      error.value = `Error Login: ${err.message}`;
    }
  } finally {
    loading.value = false;
  }
};
</script>
