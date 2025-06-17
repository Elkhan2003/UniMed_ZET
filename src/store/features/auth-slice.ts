import axiosInstance from '../../shared/api/axios-config'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-hot-toast'
import { AuthState, SetUserDataPayload } from '../../common/auth/Iauth'
import { _KEY_AUTH } from '../../shared/lib/constants/constants'
import axios from 'axios'
import { getCookie } from '../../shared/lib/helpers/helpers'

export const SignUp = createAsyncThunk(
	'auth/SignUp',
	async ({ userData }: SetUserDataPayload, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post('auth/login', userData)
			toast.success('Успешный вход !')
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue((error as Error).message)
			}
		}
	}
)
export const RegistrationUser = createAsyncThunk(
	'auth/RegistrationUser',
	async ({ userData }: SetUserDataPayload, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post('/users/registration', userData)
			toast.success('Успешная регистрация !')
			return response.data
		} catch (error) {
			return rejectWithValue((error as Error).message)
		}
	}
)
const cookieDataString = getCookie(_KEY_AUTH)
const convertObj = cookieDataString ? JSON.parse(cookieDataString) : {}
const initialState: AuthState = {
	token: convertObj.token || null,
	role: convertObj?.role || '',
	isAuthenticated: convertObj?.isAuthenticated || false,
	authId: '',
	phoneNumber: '',
}
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setIsAuthenticated: (state) => {
			state.isAuthenticated = false
			state.role = ''
			state.token = null
		},
		setIsAuth: (state, { payload }) => {
			state.isAuthenticated = true
			state.token = payload
		},
	},
	extraReducers: (builder) => {
		builder.addCase(SignUp.pending, () => {})
		builder.addCase(SignUp.fulfilled, (state, { payload }) => {
			state.isAuthenticated = true
			state.token = payload.token
			state.role = payload.role
			state.phoneNumber = payload.phoneNumber
		})
		builder.addCase(SignUp.rejected, () => {})
		builder.addCase(RegistrationUser.pending, () => {})
		builder.addCase(RegistrationUser.fulfilled, (state, { payload }) => {
			state.isAuthenticated = true
			state.token = payload.token
			state.role = payload.role
			state.phoneNumber = payload.phoneNumber
		})
		builder.addCase(RegistrationUser.rejected, () => {})
	},
})
export const { setIsAuthenticated, setIsAuth } = authSlice.actions
