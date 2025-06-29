import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'

export const getCategorySelect = createAsyncThunk(
	'category/getCategorySelect',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`categories/select`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState: any = {
	categoryData: [],
	isLoadingCategory: false,
}

export const categorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getCategorySelect.pending, (state) => {
			state.isLoadingCategoryService = true
		})
		builder.addCase(getCategorySelect.fulfilled, (state, action) => {
			state.categoryData = action.payload
			state.isLoadingCategoryService = false
		})
		builder.addCase(getCategorySelect.rejected, (state) => {
			state.isLoadingCategoryService = false
		})
	},
})
