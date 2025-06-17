import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import toast from 'react-hot-toast'

interface getFeedbackMasterProps {
	masterID: number | string | undefined
}

interface getFeedbackBranchProps {
	branchId: number | string | undefined
}

interface FeedbackInitalStateProps {
	isLoadingFeedback: boolean
	feedbackDataBranch: {
		feedbackForBranchResponses:
			| {
					comment: string | number
					createdDate: string
					feedbackId: number
					images: string[]
					rating: number
					replyToFeedbackResponse: {
						answer: string
						representative: string
					}
					userResponse: {
						userId: number
						fullName: string
						avatar: string
					}
			  }[]
			| []
		totalRating: number
	}
	feedbackDataMaster: {
		feedbackResponses:
			| {
					comment: string | number
					createdDate: string
					feedbackId: number
					images: string[]
					rating: number
					replyToFeedbackResponse: {
						answer: string
						representative: string
					}
					userResponse: {
						userId: number
						fullName: string
						avatar: string
					}
			  }[]
			| []
		totalRating: number
	}
}

export const getFeedbackMaster = createAsyncThunk(
	'feedback/getFeedbackMaster',
	async ({ masterID }: getFeedbackMasterProps, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`/feedbacks/masters/${masterID}`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getFeedbackBranch = createAsyncThunk(
	'feedback/getFeedbackBranch',
	async ({ branchId }: getFeedbackBranchProps, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`/feedbacks/branch/${branchId}`)

			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postFeedbackMasterAppointmentId = createAsyncThunk(
	'feedback/postFeedback',
	async ({ appointmentId, postData }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post(
				`/feedbacks/${appointmentId}`,
				postData
			)
			toast.success(response.data.message)
		} catch (error) {
			toast.error((error as any).response.data.message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const putFeedbackById = createAsyncThunk(
	'feedback/putFeedbackById',
	async ({ feedbackId, putData }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.put(
				`/feedbacks/${feedbackId}`,
				putData
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const replyToFeedback = createAsyncThunk(
	'feedback/putFeedbackById',
	async ({ feedbackId, answer }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post(`/feedbacks/reply-to-feedback/${feedbackId}?answer=${answer}`)
			toast.success(response.data.message)
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState: FeedbackInitalStateProps = {
	isLoadingFeedback: false,
	feedbackDataBranch: {
		feedbackForBranchResponses: [],
		totalRating: 0,
	},
	feedbackDataMaster: {
		feedbackResponses: [],
		totalRating: 0,
	},
}

export const feedbackSlice = createSlice({
	name: 'feedback',
	initialState,
	reducers: {},
	extraReducers: (build) => {
		build.addCase(getFeedbackMaster.pending, (state) => {
			state.isLoadingFeedback = true
		})
		build.addCase(getFeedbackMaster.fulfilled, (state, action) => {
			state.isLoadingFeedback = false
			state.feedbackDataMaster = action.payload
		})
		build.addCase(getFeedbackMaster.rejected, (state) => {
			state.isLoadingFeedback = false
		})

		build.addCase(getFeedbackBranch.pending, (state) => {
			state.isLoadingFeedback = true
		})
		build.addCase(getFeedbackBranch.fulfilled, (state, action) => {
			state.isLoadingFeedback = false
			state.feedbackDataBranch = action.payload
		})
		build.addCase(getFeedbackBranch.rejected, (state) => {
			state.isLoadingFeedback = false
		})

		build.addCase(postFeedbackMasterAppointmentId.pending, (state) => {
			state.isLoadingFeedback = true
		})
		build.addCase(postFeedbackMasterAppointmentId.fulfilled, (state) => {
			state.isLoadingFeedback = false
		})
		build.addCase(postFeedbackMasterAppointmentId.rejected, (state) => {
			state.isLoadingFeedback = false
		})

		build.addCase(putFeedbackById.pending, (state) => {
			state.isLoadingFeedback = true
		})
		build.addCase(putFeedbackById.fulfilled, (state) => {
			state.isLoadingFeedback = false
		})
		build.addCase(putFeedbackById.rejected, (state) => {
			state.isLoadingFeedback = false
		})
	},
})
