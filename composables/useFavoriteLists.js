import { ref } from "vue";
import { useNuxtApp } from "#app";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
} from "firebase/firestore";

export default function useFavoriteLists() {
  const { $auth, $db } = useNuxtApp();
  const favoriteLists = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchFavoriteLists = async () => {
    isLoading.value = true;
    error.value = null;
    const user = $auth.currentUser;
    if (!user) {
      favoriteLists.value = [];
      isLoading.value = false;
      return;
    }

    try {
      const q = query(
        collection($db, "favoriteLists"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      favoriteLists.value = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          items: data.items || [],
        };
      });
    } catch (e) {
      console.error("Ошибка при загрузке списков избранного:", e);
      error.value = "Не удалось загрузить списки избранного.";
    } finally {
      isLoading.value = false;
    }
  };

  const addFavoriteList = async (listName) => {
    error.value = null;
    const user = $auth.currentUser;
    if (!user) {
      error.value = "Пользователь не авторизован.";
      return null;
    }

    const trimmedName = listName.trim();
    if (trimmedName === "") {
      error.value = "Название списка не может быть пустым.";
      return null;
    }

    if (
      favoriteLists.value.some(
        (list) => list.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      error.value = "Список с таким именем уже существует!";
      return null;
    }

    try {
      const newListRef = await addDoc(collection($db, "favoriteLists"), {
        userId: user.uid,
        name: trimmedName,
        items: [],
        createdAt: Date.now(),
      });
      const newListItem = {
        id: newListRef.id,
        name: trimmedName,
        items: [],
        createdAt: Date.now(),
      };
      favoriteLists.value.push(newListItem);
      return newListItem;
    } catch (e) {
      console.error("Ошибка при добавлении списка:", e);
      error.value = "Не удалось добавить список.";
      return null;
    }
  };

  const isMovieInMainList = (movieId) => {
    const mainList = favoriteLists.value[0];
    return mainList
      ? mainList.items.some((item) => item.id === movieId)
      : false;
  };

  const toggleMovieInMainList = async (movie) => {
    error.value = null;
    const user = $auth.currentUser;
    if (!user) {
      error.value = "Пользователь не авторизован.";
      return;
    }

    let mainList = favoriteLists.value[0];

    if (!mainList) {
      const newDefaultList = await addFavoriteList("Мой список просмотра");
      if (newDefaultList) {
        mainList = newDefaultList;
      } else {
        console.error("Не удалось создать список 'Мой список просмотра'.");
        return;
      }
    }

    const movieExists = mainList.items.some((item) => item.id === movie.id);
    const listDocRef = doc($db, "favoriteLists", mainList.id);

    try {
      if (movieExists) {
        await updateDoc(listDocRef, {
          items: arrayRemove(movie),
        });

        mainList.items = mainList.items.filter((item) => item.id !== movie.id);
      } else {
        await updateDoc(listDocRef, {
          items: arrayUnion(movie),
        });
        mainList.items.push(movie);
      }
    } catch (e) {
      console.error("Ошибка при переключении фильма в избранном:", e);
      error.value = "Не удалось обновить избранное.";
    }
  };

  const addMovieToFavoriteList = async (listId, movie) => {
    error.value = null;
    const user = $auth.currentUser;
    if (!user) {
      error.value = "Пользователь не авторизован.";
      return false;
    }

    const listToUpdate = favoriteLists.value.find((list) => list.id === listId);
    if (!listToUpdate) {
      error.value = "Выбранный список не найден.";
      return false;
    }

    if (listToUpdate.items.some((item) => item.id === movie.id)) {
      error.value = "Этот фильм уже есть в выбранном списке.";
      return false;
    }

    const listDocRef = doc($db, "favoriteLists", listId);
    try {
      await updateDoc(listDocRef, {
        items: arrayUnion(movie),
      });
      listToUpdate.items.push(movie);
      return true;
    } catch (e) {
      console.error("Ошибка при добавлении фильма в список:", e);
      error.value = "Не удалось добавить фильм в список.";
      return false;
    }
  };

  return {
    favoriteLists,
    isLoading,
    error,
    fetchFavoriteLists,
    addFavoriteList,
    isMovieInMainList,
    toggleMovieInMainList,
    addMovieToFavoriteList,
  };
}
