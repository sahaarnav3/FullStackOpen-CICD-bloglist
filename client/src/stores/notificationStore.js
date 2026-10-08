import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const useNotificationStore = create((set) => {
  let timeoutId = null;

  return {
    message: '',
    severity: '',
    actions: {
      setNotificationMessage: (messageValue, severityValue) => {
        if (timeoutId) clearTimeout(timeoutId);

        set({ message: messageValue, severity: severityValue });

        timeoutId = setTimeout(() => {
          set({ message: '', severity: '' });
          timeoutId = null;
        }, 5000);
      },
      clearNotifications: () => {
        if (timeoutId) clearTimeout(timeoutId);
        set({ message: '', severity: '' });
      },
    },
  };
});

export const useNotificationData = () =>
  useNotificationStore(
    useShallow((state) => ({
      message: state.message,
      severity: state.severity,
    }))
  );
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

export default useNotificationStore;
