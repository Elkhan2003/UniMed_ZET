import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'

export const postAmenity = createAsyncThunk(
	'amenity/postAmenity',
	async (value: any, { rejectWithValue, dispatch }) => {
		try {
			if (value.icon) {
				const formData = new FormData()
				formData.append('file', value.icon)

				const fileRes = await axiosInstance.post('files', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				const image = fileRes.data

				const amenityRes = await axiosInstance.post('/amenities', {
					name: value.name,
					icon: image,
				})

				dispatch(getAmenity())
				toast.success(amenityRes.data.message)
				return amenityRes.data
			} else {
				toast.error('Иконка жүктөлгөн эмес')
				return rejectWithValue('Иконка жүктөлгөн жок')
			}
		} catch (error) {
			console.error(error)
			return rejectWithValue((error as Error).message)
		}
	}
)

export const getAmenity = createAsyncThunk(
	'amenity/getAmenity',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`amenities?page=1&size=10`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)
export const deleteAmenity = createAsyncThunk(
	'amenity/deleteAmenity',
	async (
		ID: number | string | undefined | null,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(`/amenities/${ID}`)
			dispatch(getAmenity())
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const putAmenity = createAsyncThunk(
	'amenity/putAmenity',
	async (value: any, { rejectWithValue, dispatch }) => {
			try {
					let image = value.icon;

					if (value.icon instanceof File) { 
							const formData = new FormData();
							formData.append('file', value.icon);

							const fileRes = await axiosInstance.post('files', formData, {
									headers: {
											'Content-Type': 'multipart/form-data',
									},
							});

							image = fileRes.data;  
					}

					const response = await axiosInstance.put(`/amenities/${value.id}`, {
							name: value.name,
							icon: image,
					});

					dispatch(getAmenity());
					return response.data;
			} catch (error: any) {
					console.error('PUT запросунда ката:', error.response?.data || error.message);
					return rejectWithValue(error.response?.data?.message || error.message);
			}
	}
);




const initialState: any = {
	amenity: [],
	isLoadingAmenity: false,
}

export const amenitySlice = createSlice({
	name: 'amenities',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAmenity.pending, (state) => {
			state.isLoadingAmenity = true
		})
		builder.addCase(getAmenity.fulfilled, (state, action) => {
			state.isLoadingAmenity = false
			state.amenity = action.payload
		})
		builder.addCase(getAmenity.rejected, (state) => {
			state.isLoadingAmenity = false
		})
	},
})
