import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'

export const getCategoryServiceSelect = createAsyncThunk(
	'categoryService/getCategoryServiceSelct',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`category-service/select`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getSingleCategoryServiceSelect = createAsyncThunk(
	'category/getSingleCategoryServiceSelect',
	async ({ cotegoryID }: { cotegoryID: number }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`category-service/${cotegoryID}`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState = {
	categoryServiceSelectData: [],
	categorySingleServiceSelectData: {},
	isLoadingCategoryService: false,
}

export const categoryServiceSlice = createSlice({
	name: 'categoryService',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getCategoryServiceSelect.pending, (state) => {
			state.isLoadingCategoryService = true
		})
		builder.addCase(getCategoryServiceSelect.fulfilled, (state, action) => {
			state.categoryServiceSelectData = action.payload
			state.isLoadingCategoryService = false
		})
		builder.addCase(getCategoryServiceSelect.rejected, (state) => {
			state.isLoadingCategoryService = false
		})

		builder.addCase(getSingleCategoryServiceSelect.pending, (state) => {
			state.isLoadingCategoryService = true
		})
		builder.addCase(
			getSingleCategoryServiceSelect.fulfilled,
			(state, action) => {
				state.categorySingleServiceSelectData = action.payload
				state.isLoadingCategoryService = false
			}
		)
		builder.addCase(getSingleCategoryServiceSelect.rejected, (state) => {
			state.isLoadingCategoryService = false
		})
	},
})
