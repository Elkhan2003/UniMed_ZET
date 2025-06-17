import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import toast from 'react-hot-toast'

interface getSpecializationsMasterProps {
	masterID: undefined | number | string
}

interface postSpecializationMasterProps {
	masterID: undefined | number | string
	specializationsSelect: number[]
	category: string | number | undefined
}

interface deleteSpecializationMasterProps {
	masterID: undefined | number | string
	specializationsID: number
	category: string | number | undefined
}

export const postSpecializations = createAsyncThunk(
	'specialization/postSpecializations',
	async (value: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.post(
				`/specializations?name=${value}`
			)
			dispatch(getSpecializations({ page: 1 }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const deleteSpecializations = createAsyncThunk(
	'specialization/deleteSpecializations',
	async (id: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.delete(`/specializations/${id}`)
			dispatch(getSpecializations({ page: 1 }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getSpecializations = createAsyncThunk(
	'specialization/getSpecializations',
	async ({ page }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`/specializations?page=${page}&size=10`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)
export const putSpecializations = createAsyncThunk(
	'specialization/putSpecializations',
	async (
		item: { id: number | null; name: string },
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.put(
				`/specializations/${item.id}?name=${item.name}`
			)
			dispatch(getSpecializations({ page: 1 }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getSpecializationsMaster = createAsyncThunk(
	'specialization/getSubCategorySelect',
	async ({ masterID }: getSpecializationsMasterProps, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`masters/${masterID}/specializations/me`
			)

			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getSpecializationsSelect = createAsyncThunk(
	'specialization/getSpecializationsSelect',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`specializations/select`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getSpecializationsMasterSelect = createAsyncThunk(
	'specialization/getSpecializationsMasterSelect',
	async (
		{
			category,
			masterID,
		}: {
			category: string | number | undefined
			masterID: string | number | undefined
		},
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`masters/${masterID}/specializations?category=${category}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postSpecializationMaster = createAsyncThunk(
	'specialization/postSpecializationMaster',
	async (
		{
			masterID,
			specializationsSelect,
			category,
		}: postSpecializationMasterProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const specializationIDS = specializationsSelect
				.map((item) => {
					return `specializationIds=${item}`
				})
				.join('&')
			const response = await axiosInstance.post(
				`masters/${masterID}/specializations?${specializationIDS}`
			)
			toast.success(response.data.message || 'Успешно добавлено!')
			dispatch(getSpecializationsMaster({ masterID }))
			dispatch(getSpecializationsMasterSelect({ category, masterID }))
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const deleteSpecializationMaster = createAsyncThunk(
	'specialization/deleteSpecializationMaster',
	async (
		{ masterID, specializationsID, category }: deleteSpecializationMasterProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(
				`masters/${masterID}/specializations/${specializationsID}`
			)
			dispatch(getSpecializationsMaster({ masterID }))
			dispatch(getSpecializationsMasterSelect({ category, masterID }))
			toast.success(response.data.message || 'Успешно удалено!')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState = {
	specialization: [],
	masterSpecialization: [],
	specializationSelect: [],
	masterSpecializationSelect: [],
	isLoadingSpecialization: false,
}

export const specializationSlice = createSlice({
	name: 'specialization',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getSpecializationsMaster.pending, (state) => {
			state.isLoadingSpecialization = true
		})
		builder.addCase(getSpecializationsMaster.fulfilled, (state, action) => {
			state.isLoadingSpecialization = false
			state.masterSpecialization = action.payload
		})
		builder.addCase(getSpecializationsMaster.rejected, (state) => {
			state.isLoadingSpecialization = false
		})

		builder.addCase(getSpecializationsSelect.pending, (state) => {
			state.isLoadingSpecialization = true
		})
		builder.addCase(getSpecializationsSelect.fulfilled, (state, action) => {
			state.isLoadingSpecialization = false
			state.specializationSelect = action.payload
		})
		builder.addCase(getSpecializationsSelect.rejected, (state) => {
			state.isLoadingSpecialization = false
		})

		builder.addCase(getSpecializationsMasterSelect.pending, (state) => {
			state.isLoadingSpecialization = true
		})
		builder.addCase(
			getSpecializationsMasterSelect.fulfilled,
			(state, action) => {
				state.isLoadingSpecialization = false
				state.masterSpecializationSelect = action.payload
			}
		)
		builder.addCase(getSpecializationsMasterSelect.rejected, (state) => {
			state.isLoadingSpecialization = false
		})

		builder.addCase(deleteSpecializationMaster.pending, (state) => {
			state.isLoadingSpecialization = true
		})
		builder.addCase(deleteSpecializationMaster.fulfilled, (state) => {
			state.isLoadingSpecialization = false
		})
		builder.addCase(deleteSpecializationMaster.rejected, (state) => {
			state.isLoadingSpecialization = false
		})
		builder.addCase(getSpecializations.pending, (state) => {
			state.isLoadingSpecialization = true
		})
		builder.addCase(getSpecializations.fulfilled, (state, action) => {
			state.isLoadingSpecialization = false
			state.specialization = action.payload
		})
		builder.addCase(getSpecializations.rejected, (state) => {
			state.isLoadingSpecialization = false
		})
	},
})
