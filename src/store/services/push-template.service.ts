import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauthTemp } from '../../shared/api/api.base-query-template'
import { ITemplate } from '../../common/template'

const templateService = createApi({
	reducerPath: 'tamplateApi',
	baseQuery: baseQueryWithReauthTemp,
	endpoints: (builder) => ({
		getTemplate: builder.query<any, any>({
			query: (branchId: number) => `/push-templates/branches/${branchId}`,
		}),
		getTemplateByType: builder.query<
			ITemplate,
			{ masterId: number | string; type: string }
		>({
			query: ({ masterId, type }) =>
				`/push-templates/masters/${masterId}/by-type?pushTemplateType=${type}`,
		}),
		getNotifications: builder.query<
			any,
			{
				id: number
				status: string
				appSatus: string[]
				page: number
				size: number
			}
		>({
			query: ({ id, status, appSatus, page, size }) => {
				const middle: any = {
					notificationStatus: status,
					page: page,
					size: size,
				}
				if (appSatus.length) middle.appointmentStatuses = appSatus
				return {
					url: `/notifications`,
					method: 'GET',
					params: middle,
					extraOptions: { skipAuth: true },
				}
			},
		}),
		putTemplate: builder.mutation<any, any>({
			query: ({ id, body }) => {
				return {
					url: `/push-templates/${id}`,
					method: 'PUT',
					body: body,
				}
			},
		}),
		getNotificationsCount: builder.query<any, void>({
			query: () => ({
				url: `/notifications/sent/count`,
				method: 'GET',
				extraOptions: { skipAuth: true },
			}),
		}),
		readNotificationsAll: builder.mutation<any, void>({
			query: () => {
				return {
					url: '/notifications/read-all',
					method: 'PATCH',
				}
			},
		}),
		readNotification: builder.mutation({
			query: (id) => {
				return {
					url: `/notifications/${id}/read'`,
					method: 'PATCH',
				}
			},
		}),
		readOneNotification: builder.mutation({
			query: (id) => {
				return {
					url: `/notifications/appointments/${id}/read`,
					method: 'PATCH',
				}
			},
		}),
		postTemplate: builder.mutation({
			query: ({ branchId, body }) => {
				return {
					url: `/push-templates/branches/${branchId}`,
					method: 'POST',
					body: body,
				}
			},
		}),
	}),
})

export default templateService

export const {
	useGetTemplateQuery,
	useLazyGetTemplateQuery,
	useGetTemplateByTypeQuery,
	useGetNotificationsQuery,
	useGetNotificationsCountQuery,
	useReadNotificationMutation,
	useReadNotificationsAllMutation,
	usePutTemplateMutation,
	useReadOneNotificationMutation,
	usePostTemplateMutation,
} = templateService
