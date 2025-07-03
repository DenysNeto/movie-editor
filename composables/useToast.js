import { ref } from "vue";

const message = ref("");
const type = ref("info"); // 'success', 'error', 'info'
const duration = ref(3000);
const isVisible = ref(false);
let timeoutId = null;

export default function useToast() {
  /**
   * Показывает всплывающее уведомление.
   * @param {string} msg - Сообщение для отображения.
   * @param {'success' | 'error' | 'info'} toastType - Тип уведомления (определяет цвет и иконку).
   * @param {number} [toastDuration=3000] - Продолжительность отображения уведомления в миллисекундах.
   */
  const showToast = (msg, toastType = "info", toastDuration = 3000) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    message.value = msg;
    type.value = toastType;
    duration.value = toastDuration;
    isVisible.value = true;
    timeoutId = setTimeout(() => {
      hideToast();
    }, duration.value);
  };

  const hideToast = () => {
    isVisible.value = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return {
    message,
    type,
    duration,
    isVisible,
    showToast,
    hideToast,
  };
}
