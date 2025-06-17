import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const countryService = createApi({
	reducerPath: 'countryApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['country'],
	endpoints: (builder) => ({
		getCountry: builder.query<any, void>({
			query: () => 'geographic-units',
			providesTags: ['country'],
		}),
		getGeographicUnitById: builder.query<any, { geographicUnitId: number }>({
			query: ({ geographicUnitId }) => ({
				url: `geographic-units/${geographicUnitId}`, 
				method: 'GET',
			}),
		}),

		postCountry: builder.mutation<any, any>({
			query: ({ body, parentId }) => {
				return {
					url: `geographic-units?parentId=${parentId}`,
					method: 'POST',
					body: body,
				}
			},
			invalidatesTags: ['country'],
		}),
		postCountrySetting: builder.mutation<any, any>({
			query: ({ body }) => {
				return {
					url: `geographic-units?parentId=`,
					method: 'POST',
					body: body,
				}
			},
			invalidatesTags: ['country'],
		}),
		deleteCountry: builder.mutation({
			query: ({ geographicUnitId }) => {
				return {
					url: `geographic-units/${geographicUnitId}`,
					method: 'DELETE',
				}
			},
			invalidatesTags: ['country'],
		}),
		putCountry: builder.mutation<any, any>({
			query: ({
				geographicUnitId,
				body,
			}: {
				geographicUnitId: number
				body: any
			}) => ({
				url: `geographic-units/${geographicUnitId}`,
				method: 'PUT',
				body: body,
			}),
			invalidatesTags: ['country'],
		}),
	}),
})

export default countryService

export const {
	useGetCountryQuery,
	useGetGeographicUnitByIdQuery,
	usePostCountryMutation,
	useDeleteCountryMutation,
	usePutCountryMutation,
	usePostCountrySettingMutation
} = countryService
