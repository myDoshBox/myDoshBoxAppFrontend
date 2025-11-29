import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import usersAuthReducer from "./slices/userSlices/allUsersAuthSlice";
import profileAuthReducer from "./slices/profileSlice/profileAuthslice";
import escrowProductReducer from "./slices/escrowProductSlices/escrowProductContentSlice";
import paymentReducer from "./slices/paymentSlices/paymentSlice";
import { usersAPISlice } from "./slices/userSlices/allUsersAPISlice";
import { profileAPISlice } from "./slices/profileSlice/profileAPISlice";
import { escrowProductsAPISlice } from "./slices/escrowProductSlices/escrowProductsAPISlice";
import { disputeAPISlice } from "./slices/disputeSlices/disputeAPISlice";
import { paymentAPISlice } from "./slices/paymentSlices/paymentAPISlice";
import disputeReducer from "./slices/disputeSlices/disputeContentSlice";

const reducers = combineReducers({
  // users
  usersauth: usersAuthReducer,
  profileAuth: profileAuthReducer,
  [usersAPISlice.reducerPath]: usersAPISlice.reducer,
  [profileAPISlice.reducerPath]: profileAPISlice.reducer,

  // products
  escrowProductInfo: escrowProductReducer,
  [escrowProductsAPISlice.reducerPath]: escrowProductsAPISlice.reducer,

  // disputes
  disputeInfo: disputeReducer,
  [disputeAPISlice.reducerPath]: disputeAPISlice.reducer,

  // payment
  payment: paymentReducer,
  [paymentAPISlice.reducerPath]: paymentAPISlice.reducer,
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
      .concat(profileAPISlice.middleware)
      .concat(escrowProductsAPISlice.middleware)
      .concat(disputeAPISlice.middleware)
      .concat(paymentAPISlice.middleware),

  devTools: true,
});

export const persistor = persistStore(store);
