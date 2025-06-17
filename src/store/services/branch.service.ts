import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'
import { getBranchesOwner } from '../features/branch-slice'
import { Company } from '../../common/companies'

const branchService = createApi({
	reducerPath: 'branchApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['branchService'],
	endpoints: (builder) => ({
		getBranchesAdminMasterJwt: builder.query<any, void>({
			query: () => 'branches/adminMaster',
			providesTags: ['branchService'],
		}),
		getCopmanyOwner: builder.query<Company, void>({
			query: () => 'companies/current',
			providesTags: ['branchService'],
		}),
		getAdmin: builder.query<any, any>({
			query: ({ start, end, page, size, search }) =>
				`/salaries/admins?page=${page}&size=${size}${
					search ? `&search=${search}` : ''
				}&start=${start}&end=${end}`,
			providesTags: ['branchService'],
		}),
		getBranchesSelect: builder.query<any, void>({
			query: () => 'branches/select',
			providesTags: ['branchService'],
		}),
		getUnits: builder.query<any, void>({
			query: () => 'geographic-units',
			providesTags: ['branchService'],
		}),
		postBranch: builder.mutation<any, any>({
			query: ({ body, phoneNumber }) => {
				return {
					url: `/branches?phoneNumber=${phoneNumber}`,
					method: 'POST',
					body: body,
				}
			},
			invalidatesTags: ['branchService'],
		}),
		putBranch: builder.mutation<any, any>({
			query: ({ branchId, body }) => {
				return {
					url: `/branches/${branchId}`,
					method: 'PUT',
					body: body,
				}
			},
			invalidatesTags: ['branchService'],
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					await queryFulfilled
					dispatch(getBranchesOwner())
				} catch (error) {
					console.error('Ошибка при выполнении putBranch:', error)
				}
			},
		}),
		getOneBranch: builder.query<any, any>({
			query: (branchId) => `/branches/${branchId}`,
		}),
		deleteCompany: builder.mutation<any, void>({
			query: () => {
				return {
					url: '/companies',
					method: 'DELETE',
				}
			},
			invalidatesTags: ['branchService'],
		}),
		getBranchesOwner: builder.query<any, void>({
			query: () => '/branches/owner/list',
			providesTags: ['branchService'],
		}),
	}),
})

export default branchService

export const {
	useGetBranchesAdminMasterJwtQuery,
	useGetCopmanyOwnerQuery,
	useGetAdminQuery,
	useGetBranchesSelectQuery,
	useGetUnitsQuery,
	usePostBranchMutation,
	usePutBranchMutation,
	useGetOneBranchQuery,
	useDeleteCompanyMutation,
	useGetBranchesOwnerQuery,
} = branchService
