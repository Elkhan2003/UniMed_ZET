import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'

export const adminsGet = createAsyncThunk(
	'admins/get',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('admins')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)


interface postAdmin {
	branchId: number | string | undefined
	AdminsData: {
		firstName: string
		lastName: string
		authInfoRequest: {
			phoneNumber: string
			password: string
		}
		salaryRateRequest: {
			amount: number,
			compensationType: any
		}
	}
}

export const adminsRegistration = createAsyncThunk(
	'admins/registration',
	async (
		{ branchId, AdminsData }: postAdmin,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.post(
				`admins/branches/${branchId}`,
				AdminsData
			)
			toast.success('Создание прошло успешно!')
			dispatch(adminsGetByBranchId(branchId))
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			return rejectWithValue((error as Error).message)
		}
	}
)

export const adminsDelete = createAsyncThunk(
	'admins/delete',
	async ({ adminId }: { adminId: number }, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.delete(`admins/${adminId}`)
			toast.success('Удаление прошло успешно!')
			dispatch(adminsGet())
			return response
		} catch (error) {
			toast.error((error as Error).message)
			return rejectWithValue((error as Error).message)
		}
	}
)

export const adminsIdPut = createAsyncThunk(
	'adminsId/put',
	async (
		{ adminId, AdminsData, branchId }: any,
		{ rejectWithValuew, dispatch }: any
	) => {
		try {
			const response = await axiosInstance.put(`admins/${adminId}`, AdminsData)
			toast.success('Изменения прошло успешно!')
			dispatch(adminsGetByBranchId(branchId))
			return response
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValuew((error as Error).message)
		}
	}
)

export const adminsGetByBranchId = createAsyncThunk(
	'admins/adminsGetByBranchId',
	async (branchId: number | string | undefined, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`admins/branches/${branchId}`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState: any = {
	adminData: [],
	isLoadingAdmin: false,
	adminDataByBracn: [],
}

export const adminSlice = createSlice({
	name: 'admin',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(adminsGet.pending, (state) => {
			state.isLoadingAdmin = true
		})
		builder.addCase(adminsGet.fulfilled, (state, action) => {
			state.adminData = action.payload
			state.isLoadingAdmin = false
		})
		builder.addCase(adminsGet.rejected, (state) => {
			state.isLoadingAdmin = false
		})
		builder.addCase(adminsRegistration.pending, (state) => {
			state.isLoadingAdmin = true
		})
		builder.addCase(adminsRegistration.fulfilled, (state) => {
			state.isLoadingAdmin = false
		})
		builder.addCase(adminsRegistration.rejected, (state) => {
			state.isLoadingAdmin = false
		})
		builder.addCase(adminsDelete.pending, (state) => {
			state.isLoadingAdmin = true
		})
		builder.addCase(adminsDelete.fulfilled, (state) => {
			state.isLoadingAdmin = false
		})
		builder.addCase(adminsDelete.rejected, (state) => {
			state.isLoadingAdmin = false
		})
		builder.addCase(adminsIdPut.pending, (state) => {
			state.isLoadingAdmin = true
		})
		builder.addCase(adminsIdPut.fulfilled, (state) => {
			state.isLoadingAdmin = false
		})
		builder.addCase(adminsIdPut.rejected, (state) => {
			state.isLoadingAdmin = false
		})
		builder.addCase(adminsGetByBranchId.pending, (state) => {
			state.isLoadingAdmin = true
		})
		builder.addCase(adminsGetByBranchId.fulfilled, (state, { payload }) => {
			state.isLoadingAdmin = false
			state.adminDataByBracn = payload
		})
		builder.addCase(adminsGetByBranchId.rejected, (state) => {
			state.isLoadingAdmin = false
		})
	},
})
