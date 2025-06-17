import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const serviceService = createApi({
	reducerPath: 'serviceApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getServices: builder.query<
			any,
			{ branchId: number | undefined; category: string | undefined }
		>({
			query: ({ branchId, category }) => {
				return {
					url: `/v1/services/${branchId}${category && `?category=${category}`}`,
				}
			},
		}),
		getServicesSelect: builder.query<any, any>({
			query: (branchId: number) => {
				return {
					url: `services/branches/${branchId}/list`,
				}
			},
		}),
		getCategoryService: builder.query<any, void>({
			query: () => 'category-service/select',
		}),
		getSubCategoryService: builder.query<any, any>({
			query: (id) => `sub-category-service/select/${id}`,
		}),
		getServiceCategories: builder.query<any, any>({
			query: (category) => `/service-categories?category=${category}`,
		}),
		postService: builder.mutation<any, any>({
			query: ({ branchId, subId, body }) => {
				return {
					url: `v1/services/${branchId}/${subId}`,
					method: 'POST',
					body: body,
				}
			},
		}),
		postMainService: builder.mutation<any, any>({
			query: (body) => {
				return {
					url: 'v1/services',
					method: 'POST',
					body: body,
				}
			},
		}),
	}),
})

export default serviceService

export const {
	useGetServicesQuery,
	useGetCategoryServiceQuery,
	useGetSubCategoryServiceQuery,
	usePostServiceMutation,
	useGetServiceCategoriesQuery,
	usePostMainServiceMutation,
	useGetServicesSelectQuery,
} = serviceService
