import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const scheduleService = createApi({
	reducerPath: 'scheduleApi',
	baseQuery: baseQueryWithReauth,
	endpoints: (builder) => ({
		getFreeTimeScheduler: builder.query<any, any>({
			query: ({ masterID, startDate, serviceTime }) =>
				`/schedules/masters/${masterID}/available-slots?appointmentDate=${startDate}&serviceTime=${serviceTime}`,
		}),

		getScheduleBranchs: builder.query({
			query: ({ branchId, startWeek }) =>
				`/schedules/branches/${branchId}/entities?startWeek=${startWeek}&entityType=BRANCH`,
		}),
		getScheduleBranchsMasters: builder.query({
			query: ({
				branchId,
				startWeek,
			}: {
				branchId: number
				startWeek: string
			}) => `/schedules/branch's/${branchId}/masters?startWeek=${startWeek}`,
		}),
	}),
})

export default scheduleService

export const {
	useGetFreeTimeSchedulerQuery,
	useLazyGetFreeTimeSchedulerQuery,
	useGetScheduleBranchsQuery,
	useGetScheduleBranchsMastersQuery,
} = scheduleService
