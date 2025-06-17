import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const serviceCategoryService = createApi({
	reducerPath: 'serviceCategoryService',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getServiceCategory: builder.query<any, any>({
			query: ({ category }) => `service-categories?category=${category}`,
		}),
	}),
})

export default serviceCategoryService

export const { useGetServiceCategoryQuery } = serviceCategoryService
