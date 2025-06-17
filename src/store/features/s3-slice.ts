import { createSlice } from '@reduxjs/toolkit'
import { s3FileThunk } from '../../shared/lib/helpers/helpers'

const initialState = {
	isLoading: false,
	fileUrl: null,
	error: null,
}

export const s3FileSlice = createSlice({
	name: 's3',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(s3FileThunk.pending, (state) => {
				state.isLoading = true
				state.error = null
			})
			.addCase(s3FileThunk.fulfilled, (state, action) => {
				state.isLoading = false
				state.fileUrl = action.payload
			})
			.addCase(s3FileThunk.rejected, (state, action) => {
				state.isLoading = false
			})
	},
})
