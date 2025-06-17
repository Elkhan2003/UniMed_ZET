import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../api'
import toast from 'react-hot-toast'

//for inventory categories
export const useGetInventoryCategories = () => {
	return useQuery({
		queryKey: ['inventory-categories'],
		queryFn: async () => {
			try {
				const response = await api.get('/inventory/categories')
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
	})
}

export const useGetInventoryCategoryById = (id: number) => {
	return useQuery({
		queryKey: ['inventory-category', id],
		queryFn: async () => {
			try {
				const response = await api.get(`/inventory/categories/${id}`)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении категории'
				)
			}
		},
		enabled: !!id,
	})
}

export const usePostInventoryCategory = (onSuccess: () => void) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (name: string) => {
			try {
				const response = await api.post(`/inventory/categories?name=${name}`)
				if (response.status === 201) {
					toast.success('Категория успешно создана')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['inventory-categories'] })
			onSuccess()
		},
	})
}

export const useUpdateInventoryCategory = (onSuccess: () => void) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ id, name }: { id: number; name: string }) => {
			try {
				const response = await api.put(`/inventory/categories/${id}`, name)
				if (response.status === 200) {
					toast.success('Категория успешно обновлена')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при обновлении категории'
				)
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['inventory-categories'] })
			onSuccess()
		},
	})
}

export const useDeleteInventoryCategory = () => {
	return useMutation({
		mutationFn: async (id: number) => {
			try {
				const response = await api.delete(`/inventory/categories/${id}`)
				if (response.status === 200) {
					toast.success('Категория успешно удалена')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при удалении категории'
				)
			}
		},
	})
}

//for inventory products
export const useGetInventoryProducts = (id: number) => {
	return useQuery({
		queryKey: ['inventory-products', id],
		queryFn: async () => {
			try {
				const response = await api.get(`/products/${id}`)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
		enabled: !!id,
	})
}

export const useDeleteInventoryProducts = (id: number) => {
	return useMutation({
		mutationFn: async () => {
			try {
				const response = await api.delete(`/products/${id}`)
				if (response.status === 200) {
					toast.success('Продукт успешно удален')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при удалении продукта'
				)
			}
		},
	})
}

export const useUpdateInventoryProducts = (id: number) => {
	return useMutation({
		mutationFn: async (data: any) => {
			try {
				const response = await api.put(`/products/${id}`, data)
				if (response.status === 200) {
					toast.success('Продукт успешно обновлен')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при обновлении продукта'
				)
			}
		},
	})
}

export const useGetProductsByBranch = (branchId: number, search: string) => {
	return useQuery({
		queryKey: ['products-by-branch', branchId, search],
		queryFn: async () => {
			try {
				const response = await api.get(
					`/products/branches/${branchId}/search`,
					{
						params: { search },
					}
				)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении продуктов'
				)
			}
		},
		enabled: !!branchId,
	})
}

export const useGetProductsSearchCategory = (
	branchId: number,
	categoryIds = []
) => {
	return useQuery({
		queryKey: ['products-by-branch-category', branchId, categoryIds],
		queryFn: async () => {
			try {
				const params = new URLSearchParams()
				categoryIds.forEach((id: number) =>
					params.append('categoryIds', id.toString())
				)
				const response = await api.get(
					`/products/branches/${branchId}/search?${params.toString()}`
				)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message ||
						'Ошибка при получении продуктов по категории'
				)
			}
		},
		enabled: !!branchId || !!categoryIds?.length,
	})
}

export const useCreateProduct = (branchId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (newProduct: any) => {
			try {
				const response = await api.post(
					`/products/branches/${branchId}`,
					newProduct
				)
				if (response.status === 201) {
					toast.success('Продукт успешно создан')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при создании продукта'
				)
				throw error
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['products-by-branch'] })
		},
	})
}

export const useGetProductsByBranchSecondary = ({
	branchId,
	categoryId,
	status,
	search,
	page = 1,
	size = 10,
	sort = ['createdAt,desc'],
}: any) => {
	return useQuery({
		queryKey: [
			'products-by-branch',
			branchId,
			categoryId,
			status,
			search,
			page,
			size,
			sort,
		],
		queryFn: async () => {
			try {
				const response = await api.get(`/products/branches/${branchId}`, {
					params: {
						categoryId,
						status,
						search,
						page,
						size,
						sort,
					},
					paramsSerializer: (params) => {
						const query = new URLSearchParams()
						Object.entries(params).forEach(([key, value]) => {
							if (Array.isArray(value)) {
								value.forEach((v) => query.append(key, v))
							} else if (value !== undefined) {
								query.append(key, String(value))
							}
						})
						return query.toString()
					},
				})
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении продуктов'
				)
				throw error
			}
		},
		enabled: !!branchId,
	})
}

// for inventory archive

export const useArchiveProduct = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (ids: number[]) => {
			try {
				const params = new URLSearchParams()
				ids.forEach((id) => params.append('ids', id.toString()))

				const response = await api.patch(
					`/products/archive?${params.toString()}`
				)

				if (response.status === 200) {
					toast.success('Продукт успешно архивирован')
				}

				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при архивации продукта'
				)
				throw error
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['products-archive', 'products-by-branch'],
			})
		},
	})
}

export const useUnArchiveProduct = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (ids: number[]) => {
			try {
				const params = new URLSearchParams()
				ids.forEach((id) => params.append('ids', id.toString()))

				const response = await api.patch(
					`/products/unarchive?${params.toString()}`
				)
				if (response.status === 200) {
					toast.success('Продукт успешно архивирован')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при архивации продукта'
				)
				throw error
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['products-archive', 'products-by-branch'],
			})
		},
	})
}

export const useGetArchiveProduct = (
	branchId: number,
	page: number,
	size: number
) => {
	return useQuery({
		queryKey: ['products-archive', 'products-by-branch', branchId, page, size],
		queryFn: async () => {
			try {
				const response = await api.get('/products/unarchive', {
					params: { page, size },
				})
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении продуктов'
				)
			}
		},
		enabled: !!branchId,
	})
}

export const useInventoryOperation = (branchId: number) => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (body: any) => {
			try {
				const response = await api.post(
					`/inventory/operations/branches/${branchId}`,
					body
				)
				if (response.status === 201) {
					toast.success('Поступление успешно создано')
				}
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при послуплении товара'
				)
				throw error
			}
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['products-archive', 'products-by-branch'],
			})
		},
	})
}

export const useGetInventoryOperations = ({
	branchId,
	page,
	size,
	startDate,
	endDate,
	sort,
	search,
}: any) => {
	return useQuery({
		queryKey: [
			'products-archive',
			'products-by-branch',
			branchId,
			page,
			size,
			startDate,
			endDate,
			sort,
			search,
		],
		queryFn: async () => {
			try {
				const response = await api.get(
					`/inventory/operations/branches/${branchId}`,
					{
						params: { page, size, startDate, endDate, sort, search },
					}
				)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении продуктов'
				)
			}
		},
		enabled: !!branchId,
	})
}

export const useGetInventoryOperationsById = (id: number) => {
	return useQuery({
		queryKey: ['inventory-products', id],
		queryFn: async () => {
			try {
				const response = await api.get(`/inventory/operations/${id}`)
				return response.data
			} catch (error: any) {
				toast.error(
					error?.response?.data?.message || 'Ошибка при получении данных'
				)
			}
		},
		enabled: !!id,
	})
}
