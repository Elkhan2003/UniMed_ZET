import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'

export const postFile = createAsyncThunk(
	'file/post',
	async ({ file }: any, { rejectWithValue }) => {
		try {
			const formData = new FormData()

			formData.append('file', file)
			const response = await axiosInstance.post('files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			toast.success('картинка загружена !')
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			return rejectWithValue((error as Error).message)
		}
	}
)
export const postFileAll = createAsyncThunk(
	'file/post/all',
	async ({ files }: any, { rejectWithValue }) => {
		try {
			const formData = new FormData()
			files?.forEach((item: any) => formData.append('file', item))
			const response = await axiosInstance.post('files/all', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			toast.success('картинка загружена !')
			return response.data
		} catch (error) {
			toast.error((error as Error).message)
			return rejectWithValue((error as Error).message)
		}
	}
)

const initialState: any = {
	fileData: null,
	filesData: null,
	isLoadingFile: false,
}

export const fileSlice = createSlice({
	name: 'file',
	initialState,
	reducers: {
		handleResetFiles: (state, action) => {
			state.filesData = action.payload
		},
	},
	extraReducers: (build) => {
		build.addCase(postFile.pending, (state) => {
			state.isLoadingFile = true
		})
		build.addCase(postFile.fulfilled, (state, { payload }) => {
			state.fileData = payload
			state.isLoadingFile = false
		})
		build.addCase(postFile.rejected, (state) => {
			state.isLoadingFile = false
		})

		build.addCase(postFileAll.pending, (state) => {
			state.isLoadingFile = true
		})
		build.addCase(postFileAll.fulfilled, (state, { payload }) => {
			state.filesData = payload
			state.isLoadingFile = false
		})
		build.addCase(postFileAll.rejected, (state) => {
			state.isLoadingFile = false
		})
	},
})
