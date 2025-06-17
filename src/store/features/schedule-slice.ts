import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface MasterScheduleProps {
	masterSchedule: {
		scheduleId: number
		startDate: string
		endDate: string
		dayScheduleResponses:
			| {
					dayScheduleId: number
					startTime: string
					endTime: string
					workingDay: boolean
					week: string
			  }[]
			| []
	}
	freeTimeMaster: { startTime: string; endTime: string }[] | []
	isLoadingShedule: boolean
	branchScheduleData: any
}

interface GetMasterScheduleProps {
	masterID: number | string | undefined
	startWeek: string
}

interface deleteMasterScheduleProps {
	daySchedulesId: number
	masterID: number | string | undefined
	startWeek: string
}

interface deleteMasterFullScheduleProps {
	scheduleId: number
	masterID: undefined | string | number
	startWeek: string
}

interface putMasterScheduleProps {
	daySchedulesId: number | string | undefined
	masterID: number | string | undefined
	startWeek: string
	daySchedulesData: {
		startTime: string
		endTime: string
	}
}

interface postMasterScheduleProps {
	masterID: number | string | undefined
	startWeek: string
	scheduleData: {
		startDate: string
		endDate: string
		dayScheduleRequests: {
			startTime: string
			endTime: string
			dayOfWeek: string
			workingDay: boolean
		}[]
	}
}

interface postBranchScheduleProps {
	branchId: number
	startWeek: string | undefined
	scheduleData: {
		startDate: string
		endDate: string
		dayScheduleRequests: {
			startTime: string
			endTime: string
			dayOfWeek: string
			workingDay: boolean
		}[]
	}
}

interface getFreeTimeSchedulerProps {
	masterID: number | string | undefined
	startDate: string
	serviceTime: number
}

interface deleteBranchFullScheduleProps {
	scheduleId: number
	startWeek: string
	branchId: number
}

export const getMasterSchedule = createAsyncThunk(
	'schedule/getMasterSchedule',
	async (
		{ masterID, startWeek }: GetMasterScheduleProps,
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`schedules/masters/${masterID}?startWeek=${startWeek}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)
export const deleteMasterSchedule = createAsyncThunk(
	'schedule/deleteMasterSchedule',
	async (
		{ daySchedulesId, masterID, startWeek }: deleteMasterScheduleProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(
				`day-schedules/${daySchedulesId}`
			)
			toast.success(response.data.message)
			dispatch(getMasterSchedule({ masterID, startWeek }))
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)
export const deleteMasterFullSchedule = createAsyncThunk(
	'schedule/deleteMasterFullSchedule',
	async (
		{ scheduleId, masterID, startWeek }: deleteMasterFullScheduleProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(`schedules/${scheduleId}`)
			dispatch(getMasterSchedule({ masterID, startWeek }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const deleteBranchFullSchedule = createAsyncThunk(
	'schedule/deleteBranchFullSchedule',
	async (
		{ scheduleId, startWeek, branchId }: deleteBranchFullScheduleProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(`schedules/${scheduleId}`)
			toast.success(response.data.message)
			dispatch(getScheduleBranchs({ branchId, startWeek }))
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const putMasterSchedule = createAsyncThunk(
	'schedule/putMasterSchedule',
	async (
		{
			daySchedulesId,
			daySchedulesData,
			startWeek,
			masterID,
		}: putMasterScheduleProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.put(
				`day-schedules/${daySchedulesId}?startTime=${daySchedulesData.startTime}&endTime=${daySchedulesData.endTime}`
			)
			toast.success(response.data.message)
			dispatch(getMasterSchedule({ masterID, startWeek }))
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)
export const postMasterSchedule = createAsyncThunk(
	'schedule/postMasterSchedule',
	async (
		{ masterID, scheduleData, startWeek }: postMasterScheduleProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.post(
				`schedules/masters/${masterID}`,
				scheduleData
			)
			toast.success(response.data.message)
			dispatch(getMasterSchedule({ masterID, startWeek }))
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const getFreeTimeScheduler = createAsyncThunk(
	'schedule/getFreeTimeScheduler',
	async (
		{ masterID, startDate, serviceTime }: getFreeTimeSchedulerProps,
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`/day-schedules/free-time/${masterID}?appointmentDate=${startDate}&serviceTime=${serviceTime}
			`
			)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
			}
			rejectWithValue((error as Error).message)
		}
	}
)

export const getScheduleBranchs = createAsyncThunk(
	'scheduleBranch/get',
	async ({ branchId, startWeek }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`schedules/branch's/${branchId}?startWeek=${startWeek}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postScheduelBranch = createAsyncThunk(
	'schedule/postScheduelBranch',
	async (
		{ scheduleData, branchId, startWeek }: postBranchScheduleProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.post(
				`schedules/branch's/${branchId}`,
				scheduleData
			)
			dispatch(getScheduleBranchs({ branchId, startWeek }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const deleteBranchShedule = createAsyncThunk(
	'schedule/deleteBranchShedule',
	async (
		{ daySchedulesId, branchId, startWeek }: any,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(
				`day-schedules/${daySchedulesId}`
			)
			toast.success(response.data.message)
			dispatch(getScheduleBranchs({ branchId, startWeek }))
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) toast.error(error.response?.data.message)
			return rejectWithValue((error as Error).message)
		}
	}
)

export const putBranchSchedule = createAsyncThunk(
	'schedule/putBranchSchedule',
	async (
		{ daySchedulesData, branchId, startWeek, daySchedulesId }: any,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.put(
				`day-schedules/${daySchedulesId}?startTime=${daySchedulesData.startTime}&endTime=${daySchedulesData.endTime}`
			)
			toast.success(response.data.message)
			dispatch(getScheduleBranchs({ branchId, startWeek }))
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue((error as Error).message)
			}
		}
	}
)

const initialState: MasterScheduleProps = {
	masterSchedule: {
		scheduleId: 0,
		startDate: '',
		endDate: '',
		dayScheduleResponses: [],
	},
	freeTimeMaster: [],
	isLoadingShedule: false,
	branchScheduleData: [],
}

export const scheduleSlice = createSlice({
	name: 'schedule',
	initialState,
	reducers: {},
	extraReducers: (build) => {
		//get

		build.addCase(getMasterSchedule.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(getMasterSchedule.fulfilled, (state, action) => {
			state.isLoadingShedule = false
			state.masterSchedule = action.payload
		})
		build.addCase(getMasterSchedule.rejected, (state) => {
			state.isLoadingShedule = false
		})

		build.addCase(getFreeTimeScheduler.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(getFreeTimeScheduler.fulfilled, (state, action) => {
			state.isLoadingShedule = false
			state.freeTimeMaster = action.payload
		})
		build.addCase(getFreeTimeScheduler.rejected, (state) => {
			state.isLoadingShedule = false
		})

		build.addCase(getScheduleBranchs.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(getScheduleBranchs.fulfilled, (state, { payload }) => {
			state.isLoadingShedule = false
			state.branchScheduleData = payload
		})
		build.addCase(getScheduleBranchs.rejected, (state) => {
			state.isLoadingShedule = false
		})

		build.addCase(deleteMasterSchedule.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(deleteMasterSchedule.fulfilled, (state) => {
			state.isLoadingShedule = false
		})
		build.addCase(deleteMasterSchedule.rejected, (state) => {
			state.isLoadingShedule = false
		})

		build.addCase(deleteMasterFullSchedule.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(deleteMasterFullSchedule.fulfilled, (state) => {
			state.isLoadingShedule = false
		})
		build.addCase(deleteMasterFullSchedule.rejected, (state) => {
			state.isLoadingShedule = false
		})

		build.addCase(deleteBranchFullSchedule.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(deleteBranchFullSchedule.fulfilled, (state) => {
			state.isLoadingShedule = false
		})
		build.addCase(deleteBranchFullSchedule.rejected, (state) => {
			state.isLoadingShedule = false
		})

		build.addCase(postMasterSchedule.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(postMasterSchedule.fulfilled, (state) => {
			state.isLoadingShedule = false
		})
		build.addCase(postMasterSchedule.rejected, (state) => {
			state.isLoadingShedule = false
		})

		build.addCase(postScheduelBranch.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(postScheduelBranch.fulfilled, (state) => {
			state.isLoadingShedule = false
		})
		build.addCase(postScheduelBranch.rejected, (state) => {
			state.isLoadingShedule = false
		})

		build.addCase(putMasterSchedule.pending, (state) => {
			state.isLoadingShedule = true
		})
		build.addCase(putMasterSchedule.fulfilled, (state) => {
			state.isLoadingShedule = false
		})
		build.addCase(putMasterSchedule.rejected, (state) => {
			state.isLoadingShedule = false
		})
	},
})
