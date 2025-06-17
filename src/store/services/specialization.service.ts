import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const specializationService = createApi({
  reducerPath: 'specializationsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Specialization'],
  endpoints: (builder) => ({
    getSpecialization: builder.query<any, any>({
      query: ({category}) => `specializations?category=${category}`,
    }),

    postSpecialization: builder.mutation({
      query: ({ name, categoryType }) => ({
        url: "specializations",
        method: 'POST',
        body: { name, categoryType },
      }),
      invalidatesTags: ['Specialization'],
    }),

    deleteSpecialization: builder.mutation({
      query: ({ id }) => ({
        url: `specializations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Specialization'],
    }),

    putSpecialization: builder.mutation({
      query: ({ id, name, categoryType }) => ({
        url: `specializations/${id}`,
        method: 'PUT',
        body: { name, categoryType },
      }),
      invalidatesTags: ['Specialization'],
    }),
  }),
})

export default specializationService

export const {
  useGetSpecializationQuery,
  usePostSpecializationMutation,
  useDeleteSpecializationMutation,
  usePutSpecializationMutation,
} = specializationService