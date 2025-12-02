import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import usersAuthReducer from "./slices/userSlices/allUsersAuthSlice";
import profileAuthReducer from "./slices/profileSlice/profileAuthslice";
import escrowProductReducer from "./slices/escrowProductSlices/escrowProductContentSlice";
import paymentReducer from "./slices/paymentSlices/paymentSlice";
import disputeReducer from "./slices/disputeSlices/disputeContentSlice";
import { usersAPISlice } from "./slices/userSlices/allUsersAPISlice";
import { profileAPISlice } from "./slices/profileSlice/profileAPISlice";
import { escrowProductsAPISlice } from "./slices/escrowProductSlices/escrowProductsAPISlice";
import { disputeAPISlice } from "./slices/disputeSlices/disputeAPISlice";
import { paymentAPISlice } from "./slices/paymentSlices/paymentAPISlice";

// Combine all reducers
const appReducer = combineReducers({
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

// Root reducer that handles logout action
const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Reset all state to undefined (forces reinitialize with initialState)
    state = undefined;

    // Clear persisted storage
    storage.removeItem("persist:root");

    // Clear localStorage userInfo
    localStorage.removeItem("userInfo");
  }

  return appReducer(state, action);
};

// Persist config
const persistConfig = {
  key: "root",
  storage,
  // Optionally blacklist RTK Query cache to prevent stale data
  blacklist: [
    usersAPISlice.reducerPath,
    profileAPISlice.reducerPath,
    escrowProductsAPISlice.reducerPath,
    disputeAPISlice.reducerPath,
    paymentAPISlice.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    })
      .concat(usersAPISlice.middleware)
      .concat(profileAPISlice.middleware)
      .concat(escrowProductsAPISlice.middleware)
      .concat(disputeAPISlice.middleware)
      .concat(paymentAPISlice.middleware),
  devTools: true,
});

export const persistor = persistStore(store);
