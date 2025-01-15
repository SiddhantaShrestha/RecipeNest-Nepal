import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default is localStorage
import userReducer from "../slices/userSlice";
import recipeReducer from "../slices/recipeSlice";
import blogsReducer from "../slices/blogsSlice";
import authReducer from "../slices/authSlice";

// Create a persist config for user and auth reducers
const persistConfig = {
  key: "root",
  storage, // Use localStorage by default
  whitelist: ["user", "auth"], // Only persist user and auth slices
};

// Persist the reducers you want to persist
const persistedUserReducer = persistReducer(persistConfig, userReducer);
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    recipes: recipeReducer,
    auth: persistedAuthReducer, // Persist auth slice
    blogs: blogsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the actions that are causing the serializable value warning (such as the register function)
        ignoredActions: ["persist/PERSIST"],
        ignoredPaths: ["register"], // Ignore the specific path or action
      },
    }),
});

export const persistor = persistStore(store);

export default store;
