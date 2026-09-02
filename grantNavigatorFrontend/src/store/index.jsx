import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { grantNavigatorApi } from './apis/grantNavigatorApi';

// Konfigurerer den centrale Redux Store
export const store = configureStore({
  reducer: {
    // Tilføjer API-slicens reducer dynamisk via reducerPath ('grantNavigator')
    [grantNavigatorApi.reducerPath]: grantNavigatorApi.reducer
  },
  
  // Tilføjer RTK Query middleware (håndterer caching, re-fetching og subscriptions)
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(grantNavigatorApi.middleware);
  }
});

// Aktiverer automatiske refetch-events ved f.eks. tab-fokus eller genetableret netværk
setupListeners(store.dispatch);

// Central re-eksport af hooks, så komponenter blot kan importere direkte fra '../store'
export {
  useLookupCompanyMutation,
  useFetchMatchedGrantsQuery,
  useFetchSavedGrantsQuery,
  useSaveGrantMutation,
  useUnsaveGrantMutation
} from './apis/grantNavigatorApi';