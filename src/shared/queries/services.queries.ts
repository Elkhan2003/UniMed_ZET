import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../api'

export const useGetServicesQueryBybranchId = (
	branchId: number,
	category: string,
	search: string
) => {
	return useQuery({
		queryKey: ['services', branchId, category, search],
		queryFn: async () => {
			try {
				const response = await api.get(`/services/branches/${branchId}`, {
					params: {
						category,
						// search,
					},
				})
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
		enabled: !!category && !!branchId,
	})
}

