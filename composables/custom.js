import { ref } from "vue";

export function useCustom() {
  const count = ref(0);

  function increment() {
    count.value++;
  }

  return {
    increment,
    count,
  };
}
