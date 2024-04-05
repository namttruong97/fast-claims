import { createContext } from "react"
import useUserStateStore, { UserState } from "./userStateStore"

const UserStateStoreContext = createContext<UserState | undefined>(undefined);


//@ts-ignore
export const UserStateProvider: React.FC = ({ children }) => {
  const store = useUserStateStore();

  return (
    <UserStateStoreContext.Provider value={store}>
      {children}
    </UserStateStoreContext.Provider>
  );
};


export default UserStateStoreContext;
