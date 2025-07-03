<template>
  <div>
    <h1>Проверка Firebase</h1>
    <p>Откройте консоль разработчика в браузере (F12) и посмотрите на вывод.</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useNuxtApp } from "#app";

onMounted(() => {
  const { $auth, $db } = useNuxtApp();

  if ($auth && $db) {
    console.log("Firebase Auth:", $auth);
    console.log("Firebase Firestore:", $db);
  } else {
    console.error("Ошибка: Firebase не инициализирован или не доступен.");
  }
});
</script>
