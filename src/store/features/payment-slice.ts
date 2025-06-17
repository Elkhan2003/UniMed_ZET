import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import toast from 'react-hot-toast'

export const getPaymentWantsToPay = createAsyncThunk(
	'payment/getPaymentWantsToPay',
	async ({ appointmentId }: { appointmentId: number }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`payments/appointments/${appointmentId}/calculate`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postPaymentWantsToPay = createAsyncThunk(
	'payment/postPaymentWantsToPay',
	async ({ appointmentId, data, cashback }: any, { rejectWithValue }) => {
		try {
			const lomi = {
				appointmentId: appointmentId,
				payment: {
					cashback: cashback,
					paymentRequest: data,
				},
			}
			const response = await axiosInstance.post(
				`payments/process`,
				lomi
			)
			toast.success('Оплата успешно проведена')
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState = {
	paymentData: {
		sum: 0,
		bonus: 0,
	},
	isLoadingPayment: false,
}

export const PaymentSlice = createSlice({
	name: 'payment',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getPaymentWantsToPay.pending, (state) => {
			state.isLoadingPayment = true
		})
		builder.addCase(getPaymentWantsToPay.fulfilled, (state, action) => {
			state.paymentData = action.payload
			state.isLoadingPayment = false
		})
		builder.addCase(getPaymentWantsToPay.rejected, (state) => {
			state.isLoadingPayment = false
		})
	},
})
