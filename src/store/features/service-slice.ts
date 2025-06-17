import { toast } from 'react-hot-toast'
import axiosInstance from '../../shared/api/axios-config'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface Iservice {
	serviceSelect: any
	isLoadingService: boolean
	serviceData:
		| {
				id: number
				name: string
				icon: string
				subCategoryServices:
					| {
							id: number
							name: string
							serviceResponses:
								| {
										id: number
										name: string
										price: number
										duration: number
								  }[]
								| []
					  }[]
					| []
		  }[]
		| []
	serviceAdminBranchIdData: {
		id: number
		name: string
		icon: string
		subCategoryServices: {
			id: number
			name: string
			serviceResponses: {
				id: number
				name: string
				price: number
				duration: number
				description?: string | null
				image: string
			}[]
		}[]
	}[]
	servicePopularData: {
		id: number
		name: string
		price: number
		duration: number
		description: string
		image: string
	}[]
	serviceInfoData: {
		id: number
		name: string
		price: number
		duration: number
		description: string | null
		image: string
	} | null
}

interface IputServices {
	branchId: string | number | undefined
	servicesId: number | string | undefined
	servicesData: {
		name: string
		price: number | string
		duration: number
		description: string
		image: any
	}
}
interface IdeleteServices {
	branchId?: string | number | undefined
	servicesId: number | string | undefined
}

interface IpostServices {
	branchId?: string | number | undefined
	servicesId: string | number | undefined
	countTime: number
	serviceData: {
		name: string
		price: number | undefined
		duration: string
		description: string
		image: string
	} | null
	file?: any
}

interface postServicesAdminProps {
	dataServices: {
		name: string
		price: number | string
		duration: number
		description: string
		image: any
		type: boolean
		branchId: number
		categoryId: number
	}
	subCategoryId: number | undefined
	branchId: number
}

export const getServices = createAsyncThunk(
	'services/getServices',
	async (branchId: string | number | undefined, { rejectWithValue }) => {
		try {
			const { data } = await axiosInstance.get(`v1/services/${branchId}`)
			return data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postServices = createAsyncThunk(
	'services/postServices',
	async (
		{ servicesId, serviceData, file, branchId, countTime }: IpostServices,
		{ rejectWithValue, dispatch }
	) => {
		try {
			if (file) {
				const formData = new FormData()
				formData.append('file', file)

				const res = await axiosInstance.post('files', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				const image = await res.data.link
				const response = await axiosInstance.post(`v1/services/${servicesId}`, {
					name: serviceData?.name,
					price: serviceData?.price,
					duration: countTime,
					description: serviceData?.description,
					image: image,
				})
				dispatch(getServicesBranchIdAdmin(branchId))
				toast.success(response.data.message)
			} else {
				const response = await axiosInstance.post(
					`v1/services/${servicesId}`,
					serviceData
				)
				toast.success(response.data.message)
				return response.data
			}
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postServicesAdmin = createAsyncThunk(
	'services/postServicesAdmin',
	async (
		{ dataServices, subCategoryId, branchId }: postServicesAdminProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			let link = ''
			if (dataServices.image) {
				const formData = new FormData()
				formData.append('file', dataServices.image)

				const res = await axiosInstance.post('/files', formData)

				link = await res.data.link
			}

			const response = await axiosInstance.post(
				`v1/services/${branchId}/${subCategoryId}`,
				{
					name: dataServices.name,
					price: dataServices.price,
					duration: dataServices.duration,
					description: dataServices.description,
					image: link,
				}
			)
			dispatch(getServices(branchId))
			toast.success('Услуга успешна добавлена')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postService = createAsyncThunk(
	'services/postService',
	async ({ dataServices }: any, { rejectWithValue }) => {
		try {
			let link = ''
			if (dataServices.image) {
				const formData = new FormData()
				formData.append('file', dataServices.image)

				const res = await axiosInstance.post('/files', formData)

				link = await res.data.link
			}

			const response = await axiosInstance.post(`/services`, {
				...dataServices,
				image: link,
			})
			toast.success('Услуга успешна добавлена')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const putServices = createAsyncThunk(
	'services/putServices',
	async (
		{ servicesData, branchId, servicesId }: IputServices,
		{ rejectWithValue, dispatch }
	) => {
		try {
			let image
			if (typeof servicesData.image === 'string') {
				image = servicesData.image
			} else {
				const formData = new FormData()
				formData.append('file', servicesData.image)
				const res = await axiosInstance.post('/files', formData)
				image = await res.data.link
			}
			const response = await axiosInstance.put(`services/${servicesId}`, {
				name: servicesData.name,
				price: servicesData.price,
				duration: servicesData.duration,
				description: servicesData.description,
				image: image,
				branchId,
				categoryId: servicesId,
			})
			dispatch(getServicesInfoId(servicesId))
			toast.success('Услуга успешна обновлена')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const deleteServices = createAsyncThunk(
	'services/deleteServices',
	async ({ servicesId }: IdeleteServices, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.delete(`services/${servicesId}`)
			toast.success('Услуга удалена')
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			return rejectWithValue((error as Error).message)
		}
	}
)

export const getServicesPopular = createAsyncThunk(
	'services/getServicesBranchId',
	async ({ branchId }: { branchId: any }, { rejectWithValue }) => {
		try {
			const { data } = await axiosInstance.get(
				`/v1/services/${branchId}/popular`
			)
			return data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getServicesBranchIdAdmin = createAsyncThunk(
	'services/getServicesBranchIdAdmin',
	async (branchId: string | number | undefined, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`v1/services/${branchId}/admin`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getServicesInfoId = createAsyncThunk(
	'services/getServicesInfoId',
	async (serviceId: string | number | undefined, { rejectWithValue }) => {
		try {
			const { data } = await axiosInstance.get(`v1/services/${serviceId}/info`)
			return data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getServiceSelect = createAsyncThunk(
	'service/getSelect',
	async (
		{ branchId }: { branchId: number | undefined | string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`/v1/services/${branchId}/select`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState: Iservice = {
	isLoadingService: false,
	serviceData: [],
	serviceAdminBranchIdData: [],
	serviceInfoData: null,
	servicePopularData: [],
	serviceSelect: [],
}

export const serviceSlice = createSlice({
	name: 'service',
	initialState,
	reducers: {},
	extraReducers: (builder) => [
		builder.addCase(getServices.pending, (state) => {
			state.isLoadingService = true
		}),
		builder.addCase(getServices.fulfilled, (state, { payload }) => {
			state.isLoadingService = false
			state.serviceData = payload
		}),
		builder.addCase(getServices.rejected, (state) => {
			state.isLoadingService = false
		}),

		builder.addCase(getServiceSelect.pending, (state) => {
			state.isLoadingService = true
		}),
		builder.addCase(getServiceSelect.fulfilled, (state, { payload }) => {
			state.isLoadingService = false
			state.serviceSelect = payload
		}),
		builder.addCase(getServiceSelect.rejected, (state) => {
			state.isLoadingService = false
		}),

		builder.addCase(getServicesBranchIdAdmin.pending, (state) => {
			state.isLoadingService = true
		}),
		builder.addCase(
			getServicesBranchIdAdmin.fulfilled,
			(state, { payload }) => {
				state.isLoadingService = false
				state.serviceAdminBranchIdData = payload
			}
		),
		builder.addCase(getServicesBranchIdAdmin.rejected, (state) => {
			state.isLoadingService = false
		}),

		builder.addCase(getServicesInfoId.pending, (state) => {
			state.isLoadingService = true
		}),
		builder.addCase(getServicesInfoId.fulfilled, (state, { payload }) => {
			state.isLoadingService = false
			state.serviceInfoData = payload
		}),
		builder.addCase(getServicesInfoId.rejected, (state) => {
			state.isLoadingService = false
		}),

		builder.addCase(getServicesPopular.pending, (state) => {
			state.isLoadingService = true
		}),
		builder.addCase(getServicesPopular.fulfilled, (state, { payload }) => {
			state.isLoadingService = false
			state.servicePopularData = payload
		}),
		builder.addCase(getServicesPopular.rejected, (state) => {
			state.isLoadingService = false
		}),
	],
})
