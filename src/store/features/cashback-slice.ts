import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'

export const getCashBack = createAsyncThunk(
	'cashback/getCashBack',
	async ( {companyId}: any, { rejectWithValue }) => {
		try {
			const { data } = await axiosInstance.get(`cashbacks/${companyId}`)
			return data
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const postCashBack = createAsyncThunk(
        'cashback/postCashBack',
        async ( {datas}: any, {rejectWithValue}) => {
            try {
                const { data } = await axiosInstance.post(`cashbacks`, datas)
                toast.success(data.message)
                return data
            } catch (error) {
                toast.error((error as Error).message)
                rejectWithValue((error as Error).message)
            }
        }
        
    )

export const deleteCashBack = createAsyncThunk(
        'cashback/deleteCashBack',
        async ({cashbackId}: any, {rejectWithValue}) => {
            try {
                const {data} = await axiosInstance.delete(`cashbacks/${cashbackId}`)
                toast.success(data.message)
                return data
            } catch (error) {
                toast.error((error as Error).message)
                rejectWithValue((error as Error).message)
            }
        }
    )

export const editCashBack = createAsyncThunk(
        'cashback/editCashBack',
        async ( {datas, cashbackId}: any, {rejectWithValue}) => {
            try {
                const { data } = await axiosInstance.put(`cashbacks/${cashbackId}`, datas)
                toast.success(data.message)
                return data
            } catch (error) {
                toast.error((error as Error).message)
                rejectWithValue((error as Error).message)
            }
        }
        
    )


const initialState = {
	cashbackData: [],
	cashbackLoading: false,
	error: false,
}

export const cashbackSlice = createSlice({
	name: 'cashback',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getCashBack.pending, (state) => {
            state.cashbackLoading = true
        })
        builder.addCase(getCashBack.rejected, (state) => {
            state.error = true
            state.cashbackLoading = false
        })
        builder.addCase(getCashBack.fulfilled, (state, action) => {
            state.cashbackData = action.payload
            state.cashbackLoading = false
        })
	},
})
