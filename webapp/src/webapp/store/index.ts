// Dependencias
import { configureStore } from "@reduxjs/toolkit";

// Slices
import userSlice from "./reducers/user";
import documentsSlice from "./reducers/documents";
import usersSlice from "./reducers/users";
import accountantSlice from "./reducers/accountant";
import modalSlice from "./reducers/modal";

export const createStore = (preloadedState) => {
  return configureStore({
    reducer: {
      [userSlice.name]: userSlice.reducer,
      [documentsSlice.name]: documentsSlice.reducer,
      [usersSlice.name]: usersSlice.reducer,
      [accountantSlice.name]: accountantSlice.reducer,
      [modalSlice.name]: modalSlice.reducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
    devTools: __DEV__ && __CLIENT__ && !__TEST__,
  });
};

export const store = createStore({});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
