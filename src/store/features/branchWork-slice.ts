import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import toast from 'react-hot-toast'
import axios from 'axios'

interface BranchWorkInitialStateProps {
	dataBranchWork: []
	isLoadingBranchWork: boolean
	dataBranchImage: []
	dataBranchImageMain: string
}
interface getBranchWorksProps {
	branchId: number
}
interface deleteBranchWorksProps {
	branchId: number
	workImageLinks: string
}
interface postBranchWorksProps {
	branchId: number
	workImageLinks: any
}

interface postBranchesImageProps {
	branchId: number
	workImageLinks: File
}

export const getBranchWorks = createAsyncThunk(
	'branchWorks/getBranchWorks',
	async ({ branchId }: getBranchWorksProps, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`branches/works-images/${branchId}`
			)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return rejectWithValue(error.message)
			}
		}
	}
)

export const deleteBranchWorks = createAsyncThunk(
	'branchWorks/deleteBranchWorks',
	async (
		{ branchId, workImageLinks }: deleteBranchWorksProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.delete(
				`branches/works-images?workImageLinks=${workImageLinks}`
			)
			dispatch(getBranchWorks({ branchId }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue(error.message)
			}
		}
	}
)

export const postBranchWorks = createAsyncThunk(
	'branchWorks/postBranchWorks',
	async (
		{ branchId, workImageLinks }: postBranchWorksProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const formData = new FormData()
			workImageLinks?.forEach((file: any) => {
				formData.append(`file`, file)
			})
			const res = await axiosInstance.post('files/all', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			const image = res.data.map((images: string) => {
				return images?.link
			})
			const response = await axiosInstance.post(
				`branches/works-images?workImages=${image}`
			)
			dispatch(getBranchWorks({ branchId }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue(error.message)
			}
		}
	}
)

export const postBranchesImage = createAsyncThunk(
	'branchWorks/postBranchesImage',
	async (
		{ branchId, workImageLinks }: postBranchesImageProps,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const formData = new FormData()
			formData.append('file', workImageLinks)
			const res = await axiosInstance.post('files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			const response = await axiosInstance.post(
				`branches/${branchId}/images?image=${res.data}`
			)
			dispatch(getBranchesImageMain({ branchId }))
			toast.success('Баннер успешно добавлен')
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue(error.message)
			}
		}
	}
)

export const getBranchesImageMain = createAsyncThunk(
	'branchWorks/getBranchesImageMain',
	async ({ branchId }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`branches/${branchId}/images/main`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const deleteBranchesImageMain = createAsyncThunk(
	'branchWorks/deleteBranchesImageMain',
	async ({ branchId }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.delete(`/branches/${branchId}/images`)
			toast.success('Баннер успешно удален')
			dispatch(getBranchesImageMain({ branchId }))
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue((error as Error).message)
			}
		}
	}
)

export const getBranchesImage = createAsyncThunk(
	'branchWorks/getBranchesImage',
	async ({ branchId }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`branches/${branchId}/images`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postBranchesImageList = createAsyncThunk(
	'branchWorks/postBrancheImageList',
	async ({ branchId, workImageLinks }: any, { rejectWithValue, dispatch }) => {
		try {
			let image
			const formData = new FormData()
			if (workImageLinks.length !== 1) {
				workImageLinks?.forEach((file: any) => {
					formData.append(`file`, file)
				})
				const res = await axiosInstance.post('files/all', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				image = res.data
			} else {
				formData.append('file', workImageLinks[0])
				const res = await axiosInstance.post('files', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})
				image = res.data
			}
			if (typeof image === 'string') {
				image = image
			} else {
				image = image.map((images: string) => {
					return images
				})
			}
			const response = await axiosInstance.post(
				`/branches/${branchId}/images/batch?images=${image}`
			)
			dispatch(getBranchesImage({ branchId }))
			toast.success(response.data.message)
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue((error as Error).message)
			}
		}
	}
)

export const deleteBranchesImageList = createAsyncThunk(
	'branchWorks/deleteBranchesImageList',
	async ({ branchId, images }: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.delete(
				`/branches/${branchId}/images/batch`, {
					data: images
				}
			)
			toast.success('Картинка успешна удалена')
			dispatch(getBranchesImage({ branchId }))
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
				return rejectWithValue((error as Error).message)
			}
		}
	}
)

const initialState: BranchWorkInitialStateProps = {
	dataBranchWork: [],
	dataBranchImage: [],
	dataBranchImageMain: '',
	isLoadingBranchWork: false,
}

export const branchWorkSlice = createSlice({
	name: 'branchWorks',
	initialState,
	reducers: {},
	extraReducers: (build) => {
		build.addCase(getBranchWorks.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(getBranchWorks.fulfilled, (state, action) => {
			state.isLoadingBranchWork = false
			state.dataBranchWork = action.payload
		})
		build.addCase(getBranchWorks.rejected, (state) => {
			state.isLoadingBranchWork = false
		})

		build.addCase(deleteBranchWorks.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(deleteBranchWorks.fulfilled, (state) => {
			state.isLoadingBranchWork = false
		})
		build.addCase(deleteBranchWorks.rejected, (state) => {
			state.isLoadingBranchWork = false
		})

		build.addCase(postBranchWorks.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(postBranchWorks.fulfilled, (state) => {
			state.isLoadingBranchWork = false
		})
		build.addCase(postBranchWorks.rejected, (state) => {
			state.isLoadingBranchWork = false
		})

		build.addCase(getBranchesImageMain.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(getBranchesImageMain.fulfilled, (state, action) => {
			state.isLoadingBranchWork = false
			if (action.payload !== '') {
				state.dataBranchImageMain = action.payload
			}
		})
		build.addCase(getBranchesImageMain.rejected, (state) => {
			state.isLoadingBranchWork = true
		})

		build.addCase(deleteBranchesImageMain.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(deleteBranchesImageMain.fulfilled, (state) => {
			state.isLoadingBranchWork = false
			state.dataBranchImageMain = ''
		})
		build.addCase(deleteBranchesImageMain.rejected, (state) => {
			state.isLoadingBranchWork = true
		})

		build.addCase(postBranchesImage.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(postBranchesImage.fulfilled, (state) => {
			state.isLoadingBranchWork = false
		})
		build.addCase(postBranchesImage.rejected, (state) => {
			state.isLoadingBranchWork = true
		})

		build.addCase(postBranchesImageList.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(postBranchesImageList.fulfilled, (state) => {
			state.isLoadingBranchWork = false
		})
		build.addCase(postBranchesImageList.rejected, (state) => {
			state.isLoadingBranchWork = true
		})

		build.addCase(getBranchesImage.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(getBranchesImage.fulfilled, (state, action) => {
			state.isLoadingBranchWork = false
			state.dataBranchImage = action.payload
		})
		build.addCase(getBranchesImage.rejected, (state) => {
			state.isLoadingBranchWork = false
		})

		build.addCase(deleteBranchesImageList.pending, (state) => {
			state.isLoadingBranchWork = true
		})
		build.addCase(deleteBranchesImageList.fulfilled, (state) => {
			state.isLoadingBranchWork = false
		})
		build.addCase(deleteBranchesImageList.rejected, (state) => {
			state.isLoadingBranchWork = false
		})
	},
})
