import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import loginService from '../services/login';
import persistentUserService from '../services/persistentUser';

const useUserStore = create((set) => {
  return {
    user: null,
    token: '',
    actions: {
      loginUser: async (userDetails) => {
        const userResponse = await loginService.login(userDetails);
        if (userResponse) {
          set({
            user: userResponse,
            token: `Bearer ${userResponse.token}`,
          });
          persistentUserService.saveUser(userResponse);
          return true;
        }
        return false;
      },
      logoutUser: async () => {
        persistentUserService.removeUser();
        set({
          user: null,
          token: '',
        });
      },
      checkUserPresent: async () => {
        const user = persistentUserService.getUser()
        if (user) {
          set({
            user: user,
            token: `Bearer ${user.token}`,
          });
        }
      },
    },
  };
});

export const useUserStoreData = () =>
  useUserStore(
    useShallow((state) => ({ user: state.user, token: state.token }))
  );

export const useUserStoreActions = () => useUserStore((state) => state.actions);

export default useUserStore;
