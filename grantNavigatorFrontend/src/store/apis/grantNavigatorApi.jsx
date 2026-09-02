import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Opretter en RTK Query API-slice til håndtering af kommunikationen med .NET Web API
const grantNavigatorApi = createApi({
  // Navnet på denne slice i Redux Storen
  reducerPath: 'grantNavigator',
  
  // Konfigurerer grundlæggende HTTP-request opsætning
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/' // HUSK: Opdater portnummeret til din .NET API port fra Swagger
  }),
  
  // Tags bruges til automatisk genhentning (cache-invalidering) af data
  tagTypes: ['SavedGrants'],
  
  endpoints(builder) {
    return {
      // Mutation: Slår virksomhed op via CVR (POST)
      lookupCompany: builder.mutation({
        query: (cvrNumber) => ({
          url: `Company/lookup/${cvrNumber}`,
          method: 'POST'
        })
      }),

      // Query: Henter alle matchede fonde baseret på virksomhedens CVR-nummer (GET)
      fetchMatchedGrants: builder.query({
        query: (cvrNumber) => ({
          url: `Grant/matched/${cvrNumber}`,
          method: 'GET'
        })
      }),

      // Query: Henter virksomhedens gemte favoritter (GET)
      // 'providesTags' markerer dette endpoint med mærket 'SavedGrants'
      fetchSavedGrants: builder.query({
        query: (cvrNumber) => ({
          url: `SavedGrants/${cvrNumber}`,
          method: 'GET'
        }),
        providesTags: ['SavedGrants']
      }),

      // Mutation: Gemmer en fond for en virksomhed (POST)
      // 'invalidatesTags' fortæller Redux, at 'fetchSavedGrants' skal genhentes automatisk efter gem
      saveGrant: builder.mutation({
        query: (body) => ({
          url: 'SavedGrants/save',
          method: 'POST',
          body
        }),
        invalidatesTags: ['SavedGrants']
      }),

      // Mutation: Fjerner en gemt fond (DELETE)
      // Tvinger også en genhentning af 'SavedGrants' mærket
      unsaveGrant: builder.mutation({
        query: ({ cvrNumber, grantId }) => ({
          url: `SavedGrants/unsave/${cvrNumber}/${grantId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['SavedGrants']
      })
    };
  }
});

// Eksporterer de autogenererede React Hooks til brug i komponenterne
export const {
  useLookupCompanyMutation,
  useFetchMatchedGrantsQuery,
  useFetchSavedGrantsQuery,
  useSaveGrantMutation,
  useUnsaveGrantMutation
} = grantNavigatorApi;

export { grantNavigatorApi };