import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { api } from '../api'

export const useCreateFile = () => {
	return useMutation({
		mutationFn: async (image: File) => {
			try {
				const formData = new FormData()
				formData.append('file', image)
				const response = await api.post(`/files`, formData)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при создании продукта'
				)
				throw error
			}
		},
	})
}

export const useCreateMultipleFiles = (images: File[]) => {
	return useMutation({
		mutationFn: async () => {
			try {
				const formData = new FormData()
				images.forEach((image) => {
					formData.append('files', image)
				})
				const response = await api.post(`/files`, formData)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при создании продукта'
				)
				throw error
			}
		},
	})
}
