import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const dashboardService: any = createApi({
	reducerPath: 'dashboardApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getDashboard: builder.query<any, any>({
			query: ({ dateType, branchIds }) => `/heartbeat?dateType=${dateType}${branchIds ? `&branchIds=${branchIds}`: ''}`,
		}),
		getDashboardBranches: builder.query<any, void>({
			query: () => '/branches/select',
		}),
		postCompaniesAboutUs: builder.mutation<any, any>({
			query: ({body}) => {
				return {
					url: 'companies/about-us',
					method: "POST",
					body: body
				}
			}
		}),
		getCompaniesAboutUs: builder.query<any, void>({
			query: (branchId) => `companies/about-us/${branchId}` 		
		}),
		postPromocode: builder.mutation<any, any>({
			query: ({promocode}) => {
				return {
					url: `companies/promocodes?promocode=${promocode}`,
					method: 'PUT'
				}
			}
		})
	}),
})

export default dashboardService

export const { useGetDashboardQuery, useGetDashboardBranchesQuery, usePostCompaniesAboutUsMutation, useGetCompaniesAboutUsQuery, usePostPromocodeMutation} = dashboardService
