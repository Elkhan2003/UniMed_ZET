import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import toast from 'react-hot-toast'

export const useGetMasterByBranches = (branchId: number) => {
	return useQuery({
		queryKey: ['masters', branchId],
		queryFn: async () => {
			try {
				const response = await api.get(`/masters/branches/${branchId}`)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
		enabled: !!branchId,
	})
}
