import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

export const singleBranchService = createApi({
	reducerPath: 'singleBranch',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getSingleBranch: builder.query<any, number>({
			query: (branchId) => `branches/${branchId}`,
		}),
	}),
})

export const { useGetSingleBranchQuery } = singleBranchService
