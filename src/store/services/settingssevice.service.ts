import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const settingsSuperService = createApi({
	reducerPath: 'superService',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['superService'],
	endpoints: (builder) => ({

		getSuperServic: builder.query({
			query: ({category}) => ({
				url: `service-categories?category=${category}`, 
				method: 'GET',
			}),
      providesTags: ['superService']
		}),
		postSuperService: builder.mutation({
			query: ({ body }) => ({
				url: 'service-categories', // Текст катары берүү
				method: 'POST',
				body: body,
			}),
			invalidatesTags: ['superService'],
		}),
				deleteSuperService: builder.mutation({
			query: ({id}) => {
				return {
					url: `service-categories/${id}`,
					method: 'DELETE',
				}
			},
			invalidatesTags: ['superService'],
		}),
		putSuperService: builder.mutation<any, any>({
			query: ({	id,	body,	}) => ({
				url: `/service-categories/${id}`,
				method: 'PUT',
				body: body,
			}),
			invalidatesTags: ['superService'],
		}),
	}),
})

export default settingsSuperService

export const {
useGetSuperServicQuery,
usePostSuperServiceMutation,
useDeleteSuperServiceMutation,
usePutSuperServiceMutation
} = settingsSuperService
