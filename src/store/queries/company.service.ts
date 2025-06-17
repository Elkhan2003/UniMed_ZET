import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'
import { Company } from '../../common/companies'

const companyService = createApi({
	reducerPath: 'companyApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['company'],
	endpoints: (builder) => ({
		getCompanyCurrent: builder.query<any, void>({
			query: () => 'companies/current',
		}),
		getCompanies: builder.query<
			any,
			{
				tariffIds: number[]
				statuses: string[]
				page: number
				size: number
				isCompany: boolean
				search: string
			}
		>({
			query: ({ tariffIds, statuses, page, size, isCompany, search }) => {
				return {
					url: '/companies',
					method: 'GET',
					params: {
						tariffIds,
						statuses,
						page,
						size,
						isCompany,
						search,
					},
				}
			},
			providesTags: ['company'],
		}),
		getCompaniesSuperAdmin: builder.query<any, any>({
			query: (companyId) => `/companies/${companyId}/for-super-admin`,
			providesTags: ['company'],
		}),
		blockCompany: builder.mutation<any, any>({
			query: (companyId) => {
				return {
					url: `/blocking-management/companies/${companyId}/block`,
					method: 'PUT',
				}
			},
			invalidatesTags: ['company'],
		}),
		unblockCompany: builder.mutation<any, any>({
			query: (companyId) => {
				return {
					url: `/blocking-management/companies/${companyId}/unblock`,
					method: 'PUT',
				}
			},
			invalidatesTags: ['company'],
		}),
		deleteCompanyById: builder.mutation<any, any>({
			query: (companyId) => {
				return {
					url: `/companies/${companyId}`,
					method: 'DELETE',
				}
			},
		}),
		changeOwner: builder.mutation<any, any>({
			query: (data) => {
				return {
					url: '/owners/me',
					method: 'PUT',
					body: data,
				}
			},
		}),
		getAnalytics: builder.query<any, any>({
			query: ({ branchId, dateType, startDate, endDate }) =>
				`/analytics?dateType=${dateType}${branchId ? `&branchId=${branchId}` : ''}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`,
		}),
	}),
})

export default companyService

export const {
	useGetCompanyCurrentQuery,
	useLazyGetCompaniesQuery,
	useLazyGetCompanyCurrentQuery,
	useLazyGetCompaniesSuperAdminQuery,
	useBlockCompanyMutation,
	useUnblockCompanyMutation,
	useDeleteCompanyByIdMutation,
	useChangeOwnerMutation,
	useGetAnalyticsQuery
} = companyService
