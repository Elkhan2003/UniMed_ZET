import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'
import { IPostSchedules, IScheduleEntity } from '../../common/schedules'

const V2schedulesService = createApi({
	reducerPath: 'V2schedulesApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['schedules'],
	endpoints: (builder) => ({
		postSchedules: builder.mutation({
			query: (body: IPostSchedules) => {
				return {
					url: '/schedule-slots',
					method: 'POST',
					body: body,
				}
			},
			invalidatesTags: ['schedules'],
		}),
		getSchedulesEntities: builder.query<
			IScheduleEntity,
			{ branchId: number; startWeek: string; entity: string }
		>({
			query: ({ branchId, startWeek, entity }) => {
				return {
					url: `/schedules/branches/${branchId}/entities`,
					method: 'GET',
					params: {
						startWeek: startWeek,
						entityType: entity,
					},
				}
			},
			providesTags: ['schedules'],
		}),
		putSchedulesDays: builder.mutation<
			any,
			{ scheduleId: number; startTime: string; endTime: string }
		>({
			query: ({ scheduleId, startTime, endTime }) => {
				return {
					url: `/schedules/days/${scheduleId}`,
					method: 'PUT',
					params: {
						startTime,
						endTime,
					},
				}
			},
			invalidatesTags: ['schedules'],
		}),
		deleteSchedulesDays: builder.mutation<any, { scheduleId: number }>({
			query: ({ scheduleId }) => {
				return {
					url: `/schedules/days/${scheduleId}`,
					method: 'DELETE',
				}
			},
			invalidatesTags: ['schedules'],
		}),
		getSchedulesEntitiesWeekly: builder.query<
			any,
			{ entityId: number; startWeek: string; entity: string }
		>({
			query: ({ entityId, startWeek, entity }) => {
				return {
					url: `/schedule-slots/entities/${entityId}/weekly`,
					method: 'GET',
					params: {
						startWeek: startWeek,
						entityType: entity,
					},
				}
			},
			providesTags: ['schedules'],
		}),
		getSlots: builder.query<any, any>({
			query: ({ entityId, entityType }) =>
				`/schedule-slots/entities/${entityId}/slots?entityType=${entityType}`,
			providesTags: ['schedules'],
		}),
		deleteSlots: builder.mutation<any, any>({
			query: (id) => {
				return {
					url: `/schedule-slots/${id}`,
					method: 'DELETE',
				}
			},
			invalidatesTags: ['schedules'],
		}),
	}),
})

export default V2schedulesService

export const {
	usePostSchedulesMutation,
	useGetSchedulesEntitiesQuery,
	useDeleteSchedulesDaysMutation,
	usePutSchedulesDaysMutation,
	useGetSchedulesEntitiesWeeklyQuery,
	useLazyGetSchedulesEntitiesWeeklyQuery,
	useGetSlotsQuery,
	useDeleteSlotsMutation,
} = V2schedulesService
