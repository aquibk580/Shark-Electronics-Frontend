import { useContext, createContext,useState } from "react";

const RefreshContext = createContext();

const RefProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  return (
    <RefreshContext.Provider value={[refresh, setRefresh]}>
      {children}
    </RefreshContext.Provider>
  );
};

const useRefresh = () => useContext(RefreshContext);

export { useRefresh, RefProvider };
