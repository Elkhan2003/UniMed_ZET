import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'
import { getMasterAppoinment } from './calendar-slice'

interface putAppointmentCancelProps {
	appointmentId: number
	masterID: number | undefined | string
	page: number
	size: number
}

export const postAppointment = createAsyncThunk(
	'appointment/postAppointment',
	async ({ postData }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post('appointments', postData)
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postAppointmentByUserId = createAsyncThunk(
	'appointment/appointmentByUserId',
	async ({ userId, postData }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post(
				`appointments/${userId}`,
				postData
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const putAppointmentCancel = createAsyncThunk(
	'appointment/putAppointmentCancel',
	async (
		{ appointmentId, masterID, page, size }: putAppointmentCancelProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.put(
				`appointments/${appointmentId}/cancel`
			)
			dispatch(getMasterAppoinment({ masterID, page, size }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState = {
	appointmentData: [],
	isLoadingAppointment: false,
	isSuccesApointment: '',
}

export const appointmentSlice = createSlice({
	name: 'appointment',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(postAppointment.pending, (state) => {
			state.isLoadingAppointment = true
		})
		builder.addCase(postAppointment.fulfilled, (state) => {
			state.isLoadingAppointment = false
		})
		builder.addCase(postAppointment.rejected, (state) => {
			state.isLoadingAppointment = false
		})

		builder.addCase(postAppointmentByUserId.pending, (state) => {
			state.isLoadingAppointment = true
		})
		builder.addCase(postAppointmentByUserId.fulfilled, (state) => {
			state.isLoadingAppointment = false
		})
		builder.addCase(postAppointmentByUserId.rejected, (state) => {
			state.isLoadingAppointment = false
		})
	},
})
