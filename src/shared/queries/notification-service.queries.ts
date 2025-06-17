import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { apiTemplate } from '../api'

export const useGetNotificationsCount = (path: string) => {
	return useQuery({
		queryKey: ['notifications-count', path],
		queryFn: async () => {
			try {
				const response = await apiTemplate.get('/notifications/sent/count')
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
		refetchInterval: 10000,
	})
}

export const useGetNotifications = (
	notificationStatus: string,
	appointmentStatuses: string[],
	page: number,
	size: number
) => {
	return useQuery({
		queryKey: [
			'notifications',
			notificationStatus,
			appointmentStatuses,
			page,
			size,
		],
		queryFn: async () => {
			try {
				const response = await apiTemplate.get('/notifications', {
					params: {
						notificationStatus,
						appointmentStatuses,
						page,
						size,
					},
				})
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
	})
}

export const useReadNotificationById = (appointmentId: number) => {
	return useMutation({
		mutationFn: async () => {
			try {
				const response = await apiTemplate.patch(
					`/notifications/appointments/${appointmentId}/read`
				)
				if (response.status === 200) {
					toast.success('Уведомление прочитано')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
	})
}
