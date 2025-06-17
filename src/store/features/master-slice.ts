import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface MasterProps {
	dataMasterByServiceSelect: any
	dataMaster:
		| {
				id: number
				firstName: string
				lastName: string
				phoneNumber: string
				avatar: string
		  }[]
		| []
	dataMasterById: {
		id: number
		avatar: string
		firstName: string
		lastName: string
		phoneNumber: string
		description: string
		rating: number
	} | null
	dataMasterBranch:
		| {
				firstName: any
				avatar: any
				companyId: number
				companyName: string
				categoryType: string
				branchId: number
				address: string
				phoneNumber: string
				image: string
		  }[]
		| []
	dataMasterServices:
		| {
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
					}[]
				}[]
		  }[]
		| []
	isLoadingMaster: boolean
	dataMasterByService: any
}
interface deleteMasterProps {
	masterId: number
}
interface getMasterByIdProps {
	masterID: number | string | undefined
}
interface postMasterProps {
	masterData: {
		firstName: string
		lastName: string
		authInfoRequest: {
			phoneNumber: string
			password: string | number
		}
	}
	branchId: number
}
interface putMasterProps {
	masterData: {
		firstName: string
		lastName: string
		authInfoRequest: {
			phoneNumber: string
			password: string | number
		}
		description: string
	}
	masterId: number | string | undefined
}

interface putMasterServicesAddProps {
	masterId: number | string | undefined
	serviceIds: number[]
}

interface putAvatarMasterProps {
	masterID: number | undefined | string
	avatar: any
}

interface deleteMasterServicesProps {
	masterID: number | undefined | string
	serviceIds: number
}
export const getMaster = createAsyncThunk(
	'master/getMaster',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('/v1/masters')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getMasterById = createAsyncThunk(
	'master/getMasterById',
	async ({ masterID }: getMasterByIdProps, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`/v1/masters/${masterID}`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postMaster = createAsyncThunk(
	'master/postMaster',
	async (
		{ branchId, masterData }: postMasterProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.post(
				`/v1/masters/branches/${branchId}`,
				masterData
			)
			dispatch(getMaster())
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue((error as Error).message)
			}
		}
	}
)

export const deleteMaster = createAsyncThunk(
	'master/deleteMaster',
	async ({ masterId }: deleteMasterProps, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.delete(`/v1/masters/${masterId}`)
			dispatch(getMaster())
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			toast.error('У Специалиста есть запись')
			rejectWithValue((error as Error).message)
		}
	}
)

export const putMaster = createAsyncThunk(
	'master/putMaster',
	async (
		{ masterId, masterData }: putMasterProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.put(
				`/v1/masters/${masterId}`,
				masterData
			)
			dispatch(getMaster())
			dispatch(getMasterById({ masterID: masterId }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const getMasterByBranchId = createAsyncThunk(
	'master/getMasterByBranchId',
	async (branchId: number | string | undefined, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`/v1/masters/branches/${branchId}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getMasterServices = createAsyncThunk(
	'master/getMasterServices',
	async (
		{
			masterId,
			category,
		}: { masterId: string | number | undefined; category: string },
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`/v2/masters/${masterId}?category=${category}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)
export const getMasterServicesSelect = createAsyncThunk(
	'master/getMasterServicesSelect',
	async ({ masterId }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`/masters/${masterId}/services/select`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const putMasterServicesAdd = createAsyncThunk(
	'master/putMasterServicesAdd',
	async (
		{ masterId, serviceIds }: putMasterServicesAddProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const serviceArray = serviceIds
				.map((item) => {
					return `serviceIds=${item}`
				})
				.join('&')
			const response = await axiosInstance.put(
				`/masters/${masterId}/services/assign?${serviceArray}`
			)
			// dispatch(getMasterServices(masterId))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getMasterByServiceId = createAsyncThunk(
	'master/getMasterByserviceId',
	async ({ branchId, serviceId }: any, { rejectWithValue }) => {
		try {
			let serviceIdsParam = ''

			if (Array.isArray(serviceId) && serviceId.length > 0) {
				serviceIdsParam = `serviceIds=${serviceId.join('&serviceIds=')}`
			}

			const response = await axiosInstance.get(
				`/v2/masters/${branchId}/appointment?${serviceIdsParam}`
			)

			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const putAvatarMaster = createAsyncThunk(
	'master/putAvatarMaster',
	async (
		{ masterID, avatar }: putAvatarMasterProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const formData = new FormData()
			formData.append('file', avatar)

			const res = await axiosInstance.post('files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			const finalAvatar = await res.data

			const response = await axiosInstance.put(
				`/masters/${masterID}/avatar?avatar=${finalAvatar}`
			)
			toast.success('Фото профиля загружен')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)


export const deleteMasterServices = createAsyncThunk(
	'master/deleteMasterServices',
	async (
		{ masterID, serviceIds }: deleteMasterServicesProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(
				`/masters/${masterID}/services/remove?serviceIds=${serviceIds}`
			)
			toast.success(response.data.message)
			// dispatch(getMasterServices(masterID))
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState: MasterProps = {
	dataMaster: [],
	dataMasterBranch: [],
	dataMasterById: null,
	dataMasterServices: [],
	isLoadingMaster: false,
	dataMasterByService: [],
	dataMasterByServiceSelect: [],
}

export const masterSlice = createSlice({
	name: 'master',
	initialState,
	reducers: {},
	extraReducers: (builder) => [
		builder.addCase(getMasterServicesSelect.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(getMasterServicesSelect.fulfilled, (state, action) => {
			state.isLoadingMaster = false
			state.dataMasterByServiceSelect = action.payload
		}),
		builder.addCase(getMasterServicesSelect.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(getMasterByServiceId.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(getMasterByServiceId.fulfilled, (state, action) => {
			state.isLoadingMaster = false
			state.dataMasterByService = action.payload
		}),
		builder.addCase(getMasterByServiceId.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(getMasterServices.pending, (state) => {
			state.isLoadingMaster = false
		}),
		builder.addCase(getMasterServices.fulfilled, (state, action) => {
			state.isLoadingMaster = false
			state.dataMasterServices = action.payload
		}),
		builder.addCase(getMasterServices.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(getMasterByBranchId.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(getMasterByBranchId.fulfilled, (state, action) => {
			state.isLoadingMaster = false
			state.dataMasterBranch = action.payload
		}),
		builder.addCase(getMasterByBranchId.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(getMaster.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(getMaster.fulfilled, (state, action) => {
			state.isLoadingMaster = false
			state.dataMaster = action.payload
		}),
		builder.addCase(getMaster.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(getMasterById.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(getMasterById.fulfilled, (state, action) => {
			state.isLoadingMaster = false
			state.dataMasterById = action.payload
		}),
		builder.addCase(getMasterById.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(putMaster.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(putMaster.fulfilled, (state) => {
			state.isLoadingMaster = false
		}),
		builder.addCase(putMaster.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(putMasterServicesAdd.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(putMasterServicesAdd.fulfilled, (state) => {
			state.isLoadingMaster = false
		}),
		builder.addCase(putMasterServicesAdd.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(putAvatarMaster.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(putAvatarMaster.fulfilled, (state) => {
			state.isLoadingMaster = false
		}),
		builder.addCase(putAvatarMaster.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(postMaster.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(postMaster.fulfilled, (state) => {
			state.isLoadingMaster = false
		}),
		builder.addCase(postMaster.rejected, (state) => {
			state.isLoadingMaster = false
		}),

		builder.addCase(deleteMaster.pending, (state) => {
			state.isLoadingMaster = true
		}),
		builder.addCase(deleteMaster.fulfilled, (state) => {
			state.isLoadingMaster = false
		}),
		builder.addCase(deleteMaster.rejected, (state) => {
			state.isLoadingMaster = false
		}),
	],
})
