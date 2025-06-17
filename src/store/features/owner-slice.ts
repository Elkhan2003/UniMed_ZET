import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'

export const getOwnerProfile = createAsyncThunk(
	'owner/getOwnerProfile',
	async (_, { rejectWithValue }) => {
		try {
			const { data } = await axiosInstance.get(`owners/profile`)
            return data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

const initialState: any = {
	ownerProfile: null,
	loading: false,
	error: false,
}

export const ownerSlice = createSlice({
	name: 'owner',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
        builder.addCase(getOwnerProfile.pending, (state) => {
            state.loading = true
        })
        builder.addCase(getOwnerProfile.rejected, (state) => {
            state.error = true
            state.loading = false
        })
        builder.addCase(getOwnerProfile.fulfilled, (state, action) => {
            state.ownerProfile = action.payload
            state.loading = false
        })
    },
})
