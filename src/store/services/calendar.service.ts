import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const calendarService = createApi({
	reducerPath: 'calendarApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Calendar'],
	endpoints: (builder) => ({
		getCalendar: builder.query<any, any>({
			query: ({ startTime, endTime, masterID }) => {
				const masterIDsQueryParam = masterID
					.map((id: number) => `masterIds=${id}`)
					.join('&')
				const queryParams =
					masterIDsQueryParam === '' ? '' : `?${masterIDsQueryParam}`
				return {
					url: `appointments/calendar${queryParams}?startDay=${startTime}&endDay=${endTime}`,
					method: 'GET',
				}
			},
			providesTags: ['Calendar'],
		}),

		getAppointmentById: builder.query({
			query: (appointmentId: number) => `/appointments/${appointmentId}`,
		}),
		getCalendarMe: builder.query<any, any>({
			query: ({ startDay, endDay }) => {
				return {
					url: `appointments/calendar/masters/me?startDay=${startDay}&endDay=${endDay}`,
					method: 'GET',
				}
			},
			providesTags: ['Calendar'],
		}),

		getCalendarWeek: builder.query<any, any>({
			query: ({ startTime, endTime, masterID }) => {
				return {
					url: `appointments/calendar`,
					method: 'GET',
					params: {
						startDay: startTime,
						endDay: endTime,
						masterIds: [masterID],
					},
				}
			},
			providesTags: ['Calendar'],
		}),

		getCalendarMasterSchedule: builder.query<any, any>({
			query: ({ day, page, size }) => ({
				url: `appointments/calendar/masters?day=${day}&page=${page}&size=${size}`,
				method: 'GET',
			}),
			providesTags: ['Calendar'],
		}),

		postAppointmentAdminOrMaster: builder.mutation<any, any>({
			query: ({ postData }) => ({
				url: `/appointments`,
				method: 'POST',
				body: postData,
			}),
			invalidatesTags: ['Calendar'],
		}),

		putAppointmentData: builder.mutation<any, any>({
			query: ({ appointmentId, appointmentData }) => ({
				url: `appointments/${appointmentId}`,
				method: 'PUT',
				body: appointmentData,
			}),
			invalidatesTags: ['Calendar'],
		}),

		putCalendarDragAndDrop: builder.mutation({
			query: ({ appointmentIds, startTime, endTime, date }) => {
				return {
					url: `appointments/${appointmentIds}/reschedule?startTime=${startTime}&endTime=${endTime}&date=${date}`,
					method: 'PUT',
				}
			},
			invalidatesTags: ['Calendar'],
		}),
		getAppointmentPayment: builder.query({
			query: ({ appointmentId }) => `payments/appointments/${appointmentId}`,
		}),
		getAppointmentPaymentCalculate: builder.query({
			query: ({ appointmentId }) =>
				`payments/appointments/${appointmentId}/calculate`,
		}),
		cancelAppointment: builder.mutation({
			query: (appointmentId) => {
				return {
					url: `appointments/${appointmentId}/cancel`,
					method: 'PUT',
				}
			},
			invalidatesTags: ['Calendar'],
		}),
		postPaymentsClient: builder.mutation({
			query: (data) => {
				return {
					url: `payments/process`,
					method: 'POST',
					body: data,
				}
			},
			invalidatesTags: ['Calendar'],
		}),

		putAboutUs: builder.mutation({
			query: (body) => {
				return {
					url: 'companies/about',
					method: 'PUT',
					body: body,
				}
			},
		}),
		putSocialMedia: builder.mutation({
			query: (body) => {
				return {
					url: 'companies/about/social',
					method: 'PUT',
					body: body,
				}
			},
		}),
		getOneUser: builder.query({
			query: (userId: number) => `/users/${userId}`,
		}),
		getUserAppointments: builder.query({
			query: ({ userId, pagination, appStatus }) => {
				const middle: any = {
					page: pagination.page,
					size: pagination.size,
				}
				if (appStatus.length) middle.appointmentStatuses = appStatus
				return {
					url: `/user-appointments/by-user/${userId}`,
					method: 'GET',
					params: middle,
				}
			},
		}),
		getStuffAppointments: builder.query({
			query: ({ masterId, pagination, status = [] }) => {
				return {
					url: `appointments/details/master/${masterId}`,
					method: 'GET',
					params: {
						page: pagination.page,
						size: pagination.size,
						status: status,
					},
				}
			},
		}),
	}),
})

export default calendarService

export const {
	useGetCalendarMasterScheduleQuery,
	useLazyGetCalendarMasterScheduleQuery,
	useGetCalendarQuery,
	usePostAppointmentAdminOrMasterMutation,
	usePutAppointmentDataMutation,
	usePutCalendarDragAndDropMutation,
	useGetAppointmentPaymentQuery,
	useGetAppointmentPaymentCalculateQuery,
	useCancelAppointmentMutation,
	useGetCalendarWeekQuery,
	usePutAboutUsMutation,
	usePutSocialMediaMutation,
	useGetCalendarMeQuery,
	usePostPaymentsClientMutation,
	useGetAppointmentByIdQuery,
	useLazyGetAppointmentByIdQuery,
	useGetOneUserQuery,
	useGetUserAppointmentsQuery,
	useLazyGetAppointmentPaymentCalculateQuery,
	useGetStuffAppointmentsQuery,
} = calendarService
