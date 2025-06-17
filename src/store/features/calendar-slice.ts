import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import toast from 'react-hot-toast'
import { destructuringMessage } from '../../shared/lib/helpers/helpers'
import axios from 'axios'

interface CalendarProps {
	dataScheduleMaster: any
	dataCalendar:
		| {
				appointmentId: number | null
				startTime: string
				endTime: string
				description: string
				appointmentStatus: string
				userId: number | null
				userFirstName: string
				userLastName: string
				masterId: number | null
				masterFirstName: string
				masterLastName: string
		  }[]
		| []
	dataMaster: {
		content: {
			appointmentId: number
			startTime: string
			description: string
			appointmentStatus: string
			userId: number
			fullName: string
		}[]
		pageable: {
			sort: {
				empty: boolean
				sorted: boolean
				unsorted: boolean
			}
			offset: number
			pageNumber: number
			pageSize: number
			paged: boolean
			unpaged: boolean
		}
		totalPages: number
		totalElements: number
		last: boolean
		size: number
		number: number
		sort: {
			empty: boolean
			sorted: boolean
			unsorted: boolean
		}
		numberOfElements: number
		first: boolean
		empty: boolean
	} | null
	isLoadingCalendar: boolean
}

interface GetCalendarProps {
	startTime: string
	endTime: string
	masterID: number[]
}

interface getMasterAppoinmentProps {
	masterID: number | undefined | string
	page: number
	size: number
}

interface postAppointmentProps {
	postData: {
		masterId: number
		serviceIds: number[]
		startDate: string
		startTime: string
		endTime: string
		description: string
	}
	startTime: string
	endTime: string
	masterID: number[]
}
interface postAppointmentAdminOrMasterProps {
	postData: {
		masterId: number
		serviceIds: number[]
		startDate: string
		startTime: string
		endTime: string
		description: string
	}
	appointmentStatus: string
	startTime: string
	endTime: string
	masterID: number[]
	userID: string | number
}

interface putAppointmentProps {
	postData: {
		appointmentID: number
		startTime: string
		endTime: string
		date: string
	}
	startTime: string
	endTime: string
	masterID: number[]
}

export const getCalendar = createAsyncThunk(
	'calendar/getCalendar',
	async (
		{ startTime, endTime, masterID }: GetCalendarProps,
		{ rejectWithValue }
	) => {
		try {
			const masterIDsQueryParam = masterID
				.map((id: number) => `masterIds=${id}`)
				.join('&')
			const response = await axiosInstance.get(
				masterIDsQueryParam === ''
					? `appointments/calendar?startDay=${startTime}&endDay=${endTime}`
					: `appointments/calendar?${masterIDsQueryParam}&startDay=${startTime}&endDay=${endTime}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getMasterAppoinment = createAsyncThunk(
	'calendar/getMasterAppoinment',
	async (
		{ masterID, page, size }: getMasterAppoinmentProps,
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`appointments/details/master/${masterID}?page=${page}&size=${size}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postAppointment = createAsyncThunk(
	'calendar/postAppointment',
	async (
		{ postData, startTime, endTime, masterID }: postAppointmentProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.post('/appointments', postData)
			dispatch(getCalendar({ startTime, endTime, masterID }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			toast.error(destructuringMessage(error))
			rejectWithValue((error as Error).message)
		}
	}
)

export const postAppointmentAdminOrMaster = createAsyncThunk(
	'calendar/postAppointmentAdminOrMaster',
	async (
		{
			postData,
			startTime,
			endTime,
			masterID,
			userID,
			appointmentStatus,
		}: postAppointmentAdminOrMasterProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.post(
				`appointments/${userID}?appointmentStatus=${appointmentStatus}`,
				postData
			)
			dispatch(getCalendar({ startTime, endTime, masterID }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			toast.error(destructuringMessage(error))
			rejectWithValue((error as Error).message)
		}
	}
)

export const putAppointment = createAsyncThunk(
	'calendar/putAppointment',
	async (
		{ postData, startTime, endTime, masterID }: putAppointmentProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.put(
				`appointments/changeDate/${postData.appointmentID}?startTime=${postData.startTime}&endTime=${postData.endTime}&date=${postData.date}`
			)
			dispatch(getCalendar({ startTime, endTime, masterID }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(destructuringMessage(error))
				return rejectWithValue((error as Error).message)
			}
		}
	}
)

export const putAppointmentData = createAsyncThunk(
	'calendar/putAppointmentData',
	async (
		{ startTime, endTime, masterID, appointmentId, appointmentData }: any,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.put(
				`appointments/${appointmentId}`,
				appointmentData
			)
			dispatch(getCalendar({ startTime, endTime, masterID }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(destructuringMessage(error))
				return rejectWithValue((error as Error).message)
			}
		}
	}
)

export const getCalendarMasterSchedule = createAsyncThunk(
	'calendar/getCalendarMasterSchedule',
	async (
		{ day, page, size }: { day: string; page: number; size: number },
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`appointments/calendar/masters?day=${day}&page=${page}&size=${size}`
			)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(destructuringMessage(error))
				return rejectWithValue((error as Error).message)
			}
		}
	}
)

const initialState: CalendarProps = {
	dataCalendar: [],
	dataMaster: null,
	dataScheduleMaster: [],
	isLoadingCalendar: false,
}

export const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getCalendar.pending, (state) => {
			state.isLoadingCalendar = true
		})
		builder.addCase(getCalendar.fulfilled, (state, action) => {
			state.isLoadingCalendar = false
			state.dataCalendar = action.payload
		})
		builder.addCase(getCalendar.rejected, (state) => {
			state.isLoadingCalendar = false
		})

		builder.addCase(getMasterAppoinment.pending, (state) => {
			state.isLoadingCalendar = true
		})
		builder.addCase(getMasterAppoinment.fulfilled, (state, action) => {
			state.isLoadingCalendar = false
			state.dataMaster = action.payload
		})
		builder.addCase(getMasterAppoinment.rejected, (state) => {
			state.isLoadingCalendar = false
		})

		builder.addCase(getCalendarMasterSchedule.pending, (state) => {
			state.isLoadingCalendar = true
		})
		builder.addCase(getCalendarMasterSchedule.fulfilled, (state, action) => {
			state.isLoadingCalendar = false
			state.dataScheduleMaster = action.payload
		})
		builder.addCase(getCalendarMasterSchedule.rejected, (state) => {
			state.isLoadingCalendar = false
		})

		builder.addCase(postAppointment.pending, (state) => {
			state.isLoadingCalendar = true
		})
		builder.addCase(postAppointment.fulfilled, (state) => {
			state.isLoadingCalendar = false
		})
		builder.addCase(postAppointment.rejected, (state) => {
			state.isLoadingCalendar = false
		})

		builder.addCase(postAppointmentAdminOrMaster.pending, (state) => {
			state.isLoadingCalendar = true
		})
		builder.addCase(postAppointmentAdminOrMaster.fulfilled, (state) => {
			state.isLoadingCalendar = false
		})
		builder.addCase(postAppointmentAdminOrMaster.rejected, (state) => {
			state.isLoadingCalendar = false
		})
	},
})
