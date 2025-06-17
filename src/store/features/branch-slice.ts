import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'
import { HOST } from '../../shared/lib/constants/constants'
import { RootState } from '@reduxjs/toolkit/query'

interface IGetMainBrainches {
	latitude: number | string | null
	longitude: number | string | null
}

interface getBrancheByIdProps {
	branchId?: number | string | null
	domain?: number | string | null
}

interface postData {
	branchData: {
		phoneNumber: string
		regionId: number | undefined
		cityId: number | undefined
		addressRequest: {
			name: string
			latitude: number | null
			longitude: number | null
		}
	}
}

interface putData {
	branchId: number
	branchData: {
		phoneNumber: string
		regionId: number | undefined
		cityId: number | undefined
		addressRequest: {
			name: string
			latitude: number | null
			longitude: number | null
		}
	}
}

export const getBrancheById = createAsyncThunk(
	'branch/getBrancheById',
	async ({ branchId, domain }: getBrancheByIdProps, { rejectWithValue }) => {
		try {
			let url = 'branches/host'
			let headers = {}

			if (branchId) {
				url = `branches/host?branchId=${branchId}`
			}

			if (domain) {
				headers = { origin: `http://${domain}.${HOST}` }
			}

			const response = await axiosInstance.get(url, { headers })
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getBrancheFindById = createAsyncThunk(
	'branch/getBrancheFindById',
	async ({ branchId }: { branchId: number }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`branches/find-by-branch/${branchId}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getBranches = createAsyncThunk(
	'branch/all',
	async (
		{ search, categoryServiceId, subCategoryServiceId, page, size }: any,
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`branches?${search ? `search=${search}&` : ''}${
					categoryServiceId ? `categoryServiceId=${categoryServiceId}&` : ''
				}${
					subCategoryServiceId
						? `subCategoryServiceId=${subCategoryServiceId}&`
						: ''
				} ${page ? `page=${page}&` : ''} 
        ${size ? `size=${size}` : ''}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getBranchesInnerByID = createAsyncThunk(
	'branch/getBranchesInnerByID',
	async (
		{ search, categoryServiceId, subCategoryServiceId, page, size }: any,
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`branches?${
					categoryServiceId ? `categoryServiceId=${categoryServiceId}&` : ''
				}${
					subCategoryServiceId
						? `subCategoryServiceId=${subCategoryServiceId}&`
						: ''
				} ${page ? `page=${page}&` : ''} 
        ${size ? `size=${size}` : ''}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)
export const getBranchesOwner = createAsyncThunk(
	'branch/owner/list',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('branches/owner/list')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postBranch = createAsyncThunk(
	'branch/post',
	async ({ branchData }: postData, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.post(`branches`, branchData)
			toast.success('Филлиал успешно создан !')
			return response
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const deleteBranch = createAsyncThunk(
	'branch/delete',
	async ({ branchId }: { branchId: number }, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.delete(`branches/${branchId}`)
			toast.success('Успешно удалено!')
			dispatch(getBranchesOwner())
			return response
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const putBranch = createAsyncThunk(
	'branch/put',
	async ({ branchId, branchData }: putData, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.put(
				`branches/${branchId}`,
				branchData
			)
			toast.success('Успешно изменено!')
			return response
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const getBranchesMain = createAsyncThunk(
	'branch/main',
	async ({ latitude, longitude }: IGetMainBrainches, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`/branches/main?latitude=${latitude}&longitude=${longitude}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getPopularBranches = createAsyncThunk(
	'branch/getPopularBranches',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('branches/popular')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getBranchesAdminMasterJwt = createAsyncThunk(
	'branches/staff/current',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('/branches/staff/current')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const getBranchByFilter = createAsyncThunk(
	'branchFilter',
	async (
		{
			radius,
			search,
			categoryServiceId,
			subCategoryServiceId,
			page,
			size,
			priceFrom,
			priceTo,
		}: any,
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`/branches?latitude=42.875969&longitude=74.603701&${
					radius ? `&radius=${radius}` : '15000'
				}${search !== '' ? `&search=${decodeURIComponent(search)}` : ''}${
					categoryServiceId !== null
						? `&categoryServiceId=${categoryServiceId}`
						: ''
				}${
					subCategoryServiceId !== null
						? `&subCategoryServiceId=${subCategoryServiceId}`
						: ''
				}${page ? `&page=${page}` : '1'}${size ? `&size=${size}` : '10'}${
					priceFrom !== 0 ? `&priceFrom=${priceFrom}` : ''
				}${priceTo !== 0 ? `&priceTo=${priceTo}` : ''}`
			)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)
const initialState: any = {
	branchData: [],
	branchFindById: [],
	branchInnerData: [],
	branchMain: [],
	isLoadingBranch: false,
	errorBranch: false,
	branchAll: [],
	singleBranch: null,
	filterBranch: null,
	isLoadingpage: false,
}

export const branchSlice = createSlice({
	name: 'branch',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getBranchByFilter.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(getBranchByFilter.fulfilled, (state, { payload }) => {
			state.isLoadingBranch = false
			state.filterBranch = payload
		})
		builder.addCase(getBranchByFilter.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(getBranches.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(getBranches.fulfilled, (state, action) => {
			state.isLoadingBranch = false
			state.branchData = action.payload
		})
		builder.addCase(getBranches.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(getBranchesInnerByID.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(getBranchesInnerByID.fulfilled, (state, action) => {
			state.isLoadingBranch = false
			state.branchInnerData = action.payload
		})
		builder.addCase(getBranchesInnerByID.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(getBrancheFindById.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(getBrancheFindById.fulfilled, (state, action) => {
			state.isLoadingBranch = false
			state.branchFindById = action.payload
		})
		builder.addCase(getBrancheFindById.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(getBranchesOwner.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(getBranchesOwner.fulfilled, (state, action) => {
			state.isLoadingBranch = false
			state.branchData = action.payload
		})
		builder.addCase(getBranchesOwner.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(getBranchesMain.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(getBranchesMain.fulfilled, (state, action) => {
			state.isLoadingBranch = false
			state.branchMain = action.payload
		})
		builder.addCase(getBranchesMain.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(getBrancheById.pending, (state) => {
			state.isLoadingpage = true
		})
		builder.addCase(getBrancheById.fulfilled, (state, action) => {
			state.branchAll = action.payload
			state.isLoadingpage = false
		})
		builder.addCase(getBrancheById.rejected, (state) => {
			state.isLoadingpage = false
		})

		builder.addCase(postBranch.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(postBranch.fulfilled, (state) => {
			state.isLoadingBranch = false
		})
		builder.addCase(postBranch.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(deleteBranch.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(deleteBranch.fulfilled, (state) => {
			state.isLoadingBranch = false
		})
		builder.addCase(deleteBranch.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(putBranch.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(putBranch.fulfilled, (state) => {
			state.isLoadingBranch = false
		})
		builder.addCase(putBranch.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(getPopularBranches.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(getPopularBranches.fulfilled, (state, action) => {
			state.popularBranch = action.payload
			state.isLoadingBranch = false
		})
		builder.addCase(getPopularBranches.rejected, (state) => {
			state.isLoadingBranch = false
		})

		builder.addCase(getBranchesAdminMasterJwt.pending, (state) => {
			state.isLoadingBranch = true
		})
		builder.addCase(getBranchesAdminMasterJwt.fulfilled, (state, action) => {
			state.isLoadingBranch = false
			state.branchAdminMasterJwt = action.payload
		})
		builder.addCase(getBranchesAdminMasterJwt.rejected, (state) => {
			state.isLoadingBranch = false
		})
	},
})
