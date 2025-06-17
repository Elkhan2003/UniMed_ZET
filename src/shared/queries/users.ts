import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import toast from 'react-hot-toast'

export const useGetUsersSelect = ({
	search,
	enabled,
}: {
	search: string
	enabled: boolean
}) => {
	return useQuery({
		queryKey: ['users', search],
		queryFn: async () => {
			try {
				const response = await api.get('users/select', {
					params: {
						search,
					},
				})
				return response.data
			} catch (error: any) {
				toast.error(error?.response?.data?.message || 'Произошла ошибка')
			}
		},
		enabled: enabled,
	})
}

export const useCreateUserByAdmin = (onSuccess: () => void) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (body: any) => {
			try {
				const response = await api.post('users/admin-registration', body)
				if (response.status === 201) {
					toast.success('Клиент успешно создан')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при создании клиента'
				)
			}
		},
		onSuccess: () => {
			onSuccess()
			queryClient.invalidateQueries({
				queryKey: ['users'],
			})
		},
	})
}
