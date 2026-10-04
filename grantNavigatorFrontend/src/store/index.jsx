import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { grantNavigatorApi } from './apis/grantNavigatorApi';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [grantNavigatorApi.reducerPath]: grantNavigatorApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(grantNavigatorApi.middleware),
});

setupListeners(store.dispatch);

// Eksporterer alt fra auth og API-filerne så alt kan importeres direkte fra '../store'
export * from './slices/authSlice';
export * from './apis/grantNavigatorApi';