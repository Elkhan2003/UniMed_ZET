import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const reportService = createApi({
	reducerPath: 'reportApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['expense', 'salary'],
	endpoints: (builder) => ({
		getSalaries: builder.query<any, any>({
			query: ({ branchId, start, end }) =>
				`/salaries/branches/${branchId}/table?start=${start}&end=${end}`,
			providesTags: ['salary'],
		}),
		postSalary: builder.mutation<any, any>({
			query: ({ SalaryRateId, body }) => {
				return {
					url: `/salaries/${SalaryRateId}`,
					method: 'POST',
					body: body,
				}
			},
			invalidatesTags: ['salary'],
		}),
		getSalariesMasters: builder.query<any, any>({
			query: ({ branchId, start, end, page, size, search }) =>
				`/salaries/branches/${branchId}/masters?page=${page}&size=${size}${search ? `&search=${search}` : ''}&start=${start}&end=${end}`,
		}),
		getExpenses: builder.query<any, any>({
			query: ({ branchId, start, end, page, size, search }) =>
				`/expenses/branches/${branchId}?page=${page}&size=${size}&search=${search}&start=${start}&end=${end}`,
			providesTags: ['expense'],
		}),
		postExpenses: builder.mutation<any, any>({
			query: ({ branchId, body }) => {
				return {
					url: `/expenses/branches/${branchId}`,
					method: 'POST',
					body: body,
				}
			},
			invalidatesTags: ['expense'],
		}),
		editExpenses: builder.mutation<any, any>({
			query: ({ expenseId, body }) => {
				return {
					url: `/expenses/${expenseId}`,
					method: 'PUT',
					body: body,
				}
			},
			invalidatesTags: ['expense'],
		}),
		deleteExpenses: builder.mutation<any, any>({
			query: ({ expenseId }) => {
				return {
					url: `/expenses/${expenseId}`,
					method: 'DELETE',
				}
			},
			invalidatesTags: ['expense'],
		}),
		getCommonReport: builder.query<any, any>({
			query: ({ branchId, startDate, endDate }) =>
				`/branches/${branchId}/reports/invoices?startDate=${startDate}&endDate=${endDate}`,
		}),
		getReportPayments: builder.query<any, any>({
			query: ({ branchId, startDate, endDate, page, size }) =>
				`/branches/${branchId}/reports/payments?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`,
		}),
		getReportDiscount: builder.query<any, any>({
			query: ({ branchId, start, end, page, size }) =>
				`/branches/${branchId}/reports/discounts?page=${page}&size=${size}&start=${start}&end=${end}`,
		}),

		getMastersSalaryRateAdmin: builder.query<any, any>({
			query: ({ companyId }) => `/salary-rates/companies/${companyId}/admins`,
		}),
		getMarketings: builder.query<any, any>({
			query: ({ branchId, status, page, size }) =>
				`/marketings?branchId=${branchId}&status=${status}&page=${page}&size=${size}`,
		}),
		getReportEmployees: builder.query<any, any>({
			query: ({ branchId, startDate, endDate }) =>
				`/branches/${branchId}/reports/performance?start=${startDate}&end=${endDate}`,
		}),
		pdfReportInvoices: builder.query<any, any>({
			query: ({ api, branchId, startDate, endDate }) =>
				`/pdf/report/${api}?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`,
		}),
	}),
})

export default reportService

export const {
	useGetSalariesQuery,
	useGetSalariesMastersQuery,
	useGetExpensesQuery,
	usePostExpensesMutation,
	usePostSalaryMutation,
	useGetCommonReportQuery,
	useGetReportPaymentsQuery,
	useGetReportDiscountQuery,
	useDeleteExpensesMutation,
	useGetMastersSalaryRateAdminQuery,
	useEditExpensesMutation,
	useGetMarketingsQuery,
	useGetReportEmployeesQuery,
	usePdfReportInvoicesQuery,
	useLazyPdfReportInvoicesQuery,
} = reportService
