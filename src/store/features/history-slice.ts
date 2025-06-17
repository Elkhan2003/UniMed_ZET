import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'

export const getAppoinmentHistory = createAsyncThunk(
	'history/getAppoinmentHistory',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('user-appointments/history')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getAppoinmentPlan = createAsyncThunk(
	'history/getAppoinmentPlan',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('user-appointments/planned')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getSingleAppoinmentHistory = createAsyncThunk(
	'history/getSingleAppoinmentHistory',
	async (ID: string | number | undefined, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`user-appointments/${ID}`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const cancelAppointment = createAsyncThunk(
	'history/cancel',
	async ({ appointmentId }: { appointmentId: number }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.put(
				`user-appointments/${appointmentId}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState: any = {
	isLoadingApoinmentHisory: false,
	userApoinmentHisory: [],
	userAppointmentPlan: [],
	userAppointmentSingle: {},
}

export const historySlice = createSlice({
	name: 'history',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAppoinmentHistory.pending, (state) => {
			state.isLoadingApoinmentHisory = true
		})
		builder.addCase(getAppoinmentHistory.fulfilled, (state, action) => {
			state.userApoinmentHisory = action.payload
			state.isLoadingApoinmentHisory = false
		})
		builder.addCase(getAppoinmentHistory.rejected, (state) => {
			state.isLoadingApoinmentHisory = false
		})

		builder.addCase(getAppoinmentPlan.pending, (state) => {
			state.isLoadingApoinmentHisory = true
		})
		builder.addCase(getAppoinmentPlan.fulfilled, (state, action) => {
			state.userAppointmentPlan = action.payload
			state.isLoadingApoinmentHisory = false
		})
		builder.addCase(getAppoinmentPlan.rejected, (state) => {
			state.isLoadingApoinmentHisory = false
		})

		builder.addCase(getSingleAppoinmentHistory.pending, (state) => {
			state.isLoadingApoinmentHisory = true
		})
		builder.addCase(getSingleAppoinmentHistory.fulfilled, (state, action) => {
			state.userAppointmentSingle = action.payload
			state.isLoadingApoinmentHisory = false
		})
		builder.addCase(getSingleAppoinmentHistory.rejected, (state) => {
			state.isLoadingApoinmentHisory = false
		})

		builder.addCase(cancelAppointment.pending, (state) => {
			state.isLoadingApoinmentHisory = true
		})
		builder.addCase(cancelAppointment.fulfilled, (state) => {
			state.isLoadingApoinmentHisory = false
		})
		builder.addCase(cancelAppointment.rejected, (state) => {
			state.isLoadingApoinmentHisory = false
		})
	},
})
