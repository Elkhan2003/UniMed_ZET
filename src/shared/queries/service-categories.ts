import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import toast from 'react-hot-toast'

export const useGetServiceCategories = (category: string) => {
	return useQuery({
		queryKey: ['service-categories', category],
		queryFn: async () => {
			try {
				const response = await api.get(`/service-categories`, {
					params: {
						category,
					},
				})
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении категорий'
				)
			}
		},
		enabled: !!category,
	})
}

export const useGetServiceSubCategories = (id: number) => {
	return useQuery({
		queryKey: ['service-sub-categories', id],
		queryFn: async () => {
			try {
				const response = await api.get(`/service-categories/${id}/subcategories`)
				return response.data
			} catch (error: any) {
				toast.error(error?.response?.data?.message || 'Ошибка при получении подкатегорий')
			}
		},
		enabled: !!id,
	})
}
