import {
  useState,
  useCallback,
  type FC,
  type PropsWithChildren,
  useEffect,
} from "react";
import { UserContext } from "./context";
import LocalStorageService from "@/services/storage";
import type { UserPreference } from "@/services/preference";
import UserPreferenceService from "@/services/preference";
import UserService from "@/services/user";
import type { User } from "@/types";

const USER_KEY = "user";
const PREF_KEY = "user_preferences";

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState(() => ({
    user: LocalStorageService.read<User | undefined>(USER_KEY),
    preference: LocalStorageService.read<UserPreference | undefined>(PREF_KEY),
  }));

  const setPreference = useCallback((preference: UserPreference) => {
    LocalStorageService.write(PREF_KEY, preference);
    setState((s) => ({ ...s, preference }));
  }, []);

  const setUser = useCallback((user: User) => {
    LocalStorageService.write(USER_KEY, user);
    setState((s) => ({ ...s, user }));
  }, []);

  const setDirectories = useCallback(
    (directories: string[]) => {
      setPreference({
        ...((state.preference ?? {}) as unknown as UserPreference),
        directories,
      });
    },
    [state.preference, setPreference],
  );

  useEffect(() => {
    (async () => {
      const [user, preference] = await Promise.all([
        UserService.get(),
        UserPreferenceService.get(),
      ]);

      setUser(user);
      setPreference(preference);
    })();
  }, [setPreference, setUser]);

  return (
    <UserContext.Provider
      value={{
        username: state.user?.username ?? "",
        email: state.user?.email ?? "",
        preference: state.preference,
        directories: state.preference?.directories ?? [],
        setPreference,
        setDirectories,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
