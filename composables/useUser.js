import { ref } from "vue";

const user = ref(null);
const hasAuthResolved = ref(false);

let resolveAuthPromise;
const authPromise = new Promise((resolve) => {
  resolveAuthPromise = resolve;
});

export default function useUser() {
  const setUser = (newUser) => {
    user.value = newUser;

    if (!hasAuthResolved.value) {
      hasAuthResolved.value = true;
      resolveAuthPromise();
    }
  };

  return {
    user,
    setUser,
    hasAuthResolved,
    authPromise,
  };
}
