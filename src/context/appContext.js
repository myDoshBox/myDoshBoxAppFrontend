import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [initiateEscrowProductForm, setInitiateEscrowProductForm] = useState();

  const storeInitiateEscrowProductForm = (values) => {
    setInitiateEscrowProductForm(values);
  };

  const values = { initiateEscrowProductForm, storeInitiateEscrowProductForm };
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
