import { useQuery } from '@tanstack/react-query'
import { useAdminStore } from '../states/admin.store'
import { toast } from 'react-hot-toast'
import { api } from '../api'

export const useGetStuffCurrent = () => {
	const setAdminData = useAdminStore((state) => state.setAdminData)
	return useQuery({
		queryKey: ['stuff-current'],
		queryFn: async () => {
			try {
				const response = await api.get('/branches/staff/current')
				setAdminData(response.data)
				return response.data
			} catch (error: any) {
				toast.error(error?.response?.data?.message || 'Ошибка при получении данных')
			}
		},
	})
}
