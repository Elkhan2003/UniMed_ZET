import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const servicesOfMaster = createApi({
	reducerPath: 'masterApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Service'],
	endpoints: (builder) => ({
		getServiceByMaster: builder.query<
			any,
			{ branchId: number | undefined; category: string | undefined }
		>({
			query: ({ branchId, category }) => {
				return {
					url: `services/branches/${branchId}?category=${category}`,
				}
			},
			providesTags: ['Service'],
		}),

		addService: builder.mutation<any, any>({
			query: ({ dataServices }) => {
				return {
					url: 'services',
					method: 'POST',
					body: dataServices,
				}
			},
			invalidatesTags: ['Service'],
		}),
		deleteCategoryService: builder.mutation<any, any>({
			query: ({ servicesId }) => {
				return {
					url: `/services/${servicesId}`,
					method: 'DELETE',
				}
			},
			invalidatesTags: ['Service'],
		}),
		putCategoryService: builder.mutation<any, any>({
			query: ({ servicesData, branchId, servicesId }) => {
				return {
					url: `/services/${servicesId}`,
					method: 'PUT',
					body: {
						name: servicesData.name,
						price: servicesData.price,
						duration: servicesData.duration,
						description: servicesData.description,
						image: servicesData.image,
						branchId,
						categoryId: servicesData.id,
					},
				}
			},
			invalidatesTags: ['Service'],
		}),
		getMasterServiceSelect: builder.query({
			query: (masterId) => `/masters/${masterId}/services/select`
		})
	}),
})

export default servicesOfMaster

export const {
	useGetServiceByMasterQuery,
	useAddServiceMutation,
	useDeleteCategoryServiceMutation,
	usePutCategoryServiceMutation,
	useGetMasterServiceSelectQuery
} = servicesOfMaster
