import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import usersAuthReducer from "./slices/userSlices/allUsersAuthSlice";
import escrowProductReducer from "./slices/escrowProductSlices/escrowProductContentSlice";
// import { usersAPISlice } from "./slices/userSlices/usersAPISlice";
import { usersAPISlice } from "./slices/userSlices/allUsersAPISlice";
import { escrowProductsAPISlice } from "./slices/escrowProductSlices/escrowProductsAPISlice";

const reducers = combineReducers({
  // users
  usersauth: usersAuthReducer,
  [usersAPISlice.reducerPath]: usersAPISlice.reducer,

  // products
  escrowProductInfo: escrowProductReducer,
  [escrowProductsAPISlice.reducerPath]: escrowProductsAPISlice.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  // blacklist: ['',]
  // whitelist: ['']
};

const persistedReducer = persistReducer(persistConfig, reducers);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: [thunk],
//   devTools:
//     process.env.REACT_APP_ENV !== "development" ||
//     process.env.REACT_APP_ENV !== "production",
// });

export const store = configureStore({
  // reducer: {
  //   // users
  //   usersauth: usersAuthReducer,
  //   // users: usersAPISlice.reducer,
  //   [usersAPISlice.reducerPath]: usersAPISlice.reducer,

  //   // products
  //   // escrowProducts: escrowProductsAPISlice.reducer,
  //   [escrowProductsAPISlice.reducerPath]: escrowProductsAPISlice.reducer,
  // },
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersAPISlice.middleware)
      .concat(escrowProductsAPISlice.middleware),

  devTools: true,
});

export const persistor = persistStore(store);
