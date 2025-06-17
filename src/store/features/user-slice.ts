import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axiosInstance from '../../shared/api/axios-config'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface IputUsersId {
	usersID: number | string
	usersData: {
		firstName: string | undefined
		lastName: string | undefined
		authInfoUpdateRequest: {
			phoneNumber: string | undefined
			oldPassword: string
			newPassword: string
		}
	}
}

interface PageData {
	content: any[]
	empty: boolean
	first: boolean
	last: boolean
	number: number
	numberOfElements: number
	pageable: {
		sort: {
			empty: boolean
			unsorted: boolean
			sorted: boolean
		}
		offset: number
		pageNumber: number
		pageSize: number
		paged: boolean
		unpaged: boolean
	}
	size: number
	sort: {
		empty: boolean
		unsorted: boolean
		sorted: boolean
	}
	totalElements: number
	totalPages: number
}

interface UsersInitalStateProps {
	isLoadingUsers: boolean
	usersProfileData: {
		id: number
		firstName: string
		lastName: string
		phoneNumber: string
		avatar: string | null
	}
	usersAllData:
		| {
				id: number
				firstName: string
				lastName: string
				phoneNumber: string
		  }[]
		| null
	userByIdData: any
	userAdmin: PageData | any
	userAdminSelect: []
}

interface getUsersAdminProps {
	branchId: number
	page: number
	size: number
	search: string
}

export const getAllUsers = createAsyncThunk(
	'users/getAllUsers',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get('/users')
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const postUsersRegistrationByAdmin = createAsyncThunk(
	'users/postUsersRegistrationByAdmin',
	async (body: any, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.post(
				`/users/admin-registration`,
				body
			)
			toast.success('Клиент успешно добавлен')
			return response.data
		} catch (error) {
			if (axios.isAxiosError(error)) {
				toast.error(error.response?.data.message)
			}
			rejectWithValue((error as Error).message)
		}
	}
)

export const getUsersProfile = createAsyncThunk(
	'users/getUsersProfile',
	async (_, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`/users/profile`)
			return response.data
		} catch (err) {
			rejectWithValue((err as Error).message)
		}
	}
)

export const getUserById = createAsyncThunk(
	'user/getById',
	async ({ userId }: { userId: number | unknown }, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(`users/profile/${userId}`)
			return response.data
		} catch (error) {
			rejectWithValue((error as Error).message)
		}
	}
)

export const putUsersId = createAsyncThunk(
	'users/putUsersId',
	async (
		{ usersID, usersData }: IputUsersId,
		{ rejectWithValue, dispatch }
	) => {
		try {
			const response = await axiosInstance.put(`users/${usersID}`, usersData)
			toast.success('Изменения прошло успешно!')
			dispatch(getAllUsers())
			dispatch(getUsersProfile())
			return response
		} catch (error) {
			toast.error((error as Error).message)
			rejectWithValue((error as Error).message)
		}
	}
)

export const usersDelete = createAsyncThunk(
	'users/delete',
	async (usersId: number | string, { rejectWithValue, dispatch }) => {
		try {
			const response = await axiosInstance.delete(`users/${usersId}`)
			toast.success('Удаление прошло успешно!')
			dispatch(getAllUsers())
			return response
		} catch (error) {
			toast.error((error as Error).message)
			return rejectWithValue((error as Error).message)
		}
	}
)

export const getUsersAdmin = createAsyncThunk(
	'users/getUsersAdmin',
	async (
		{ branchId, page, size, search }: getUsersAdminProps,
		{ rejectWithValue }
	) => {
		try {
			const response = await axiosInstance.get(
				`users/branches/${branchId}?&page=${page}&size=${size}${!search ? '' : `&search=${search}`}`
			)
			return response.data
		} catch (error) {
			return rejectWithValue((error as Error).message)
		}
	}
)

export const getUserAdminSelect = createAsyncThunk(
	'users/getUserAdminSelect',
	async ({ search, isGlobal }: any, { rejectWithValue }) => {
		try {
			const response = await axiosInstance.get(
				`users/select?search=${search}&isGlobal=${isGlobal}`
			)
			return response.data
		} catch (error) {
			rejectWithValue(error as Error)
		}
	}
)

const initialState: UsersInitalStateProps = {
	isLoadingUsers: false,
	usersAllData: null,
	usersProfileData: {
		id: 0,
		firstName: '',
		lastName: '',
		phoneNumber: '',
		avatar: '',
	},
	userByIdData: {},
	userAdmin: { content: [] },
	userAdminSelect: [],
}

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: (build) => {
		build.addCase(getAllUsers.pending, (state) => {
			state.isLoadingUsers = true
		})
		build.addCase(getAllUsers.fulfilled, (state, action) => {
			state.isLoadingUsers = false
			state.usersAllData = action.payload
		})
		build.addCase(getAllUsers.rejected, (state) => {
			state.isLoadingUsers = false
		})

		build.addCase(getUsersProfile.pending, (state) => {
			state.isLoadingUsers = true
		})
		build.addCase(getUsersProfile.fulfilled, (state, action) => {
			state.isLoadingUsers = false
			state.usersProfileData = action.payload
		})
		build.addCase(getUsersProfile.rejected, (state) => {
			state.isLoadingUsers = false
		})
		build.addCase(putUsersId.pending, (state) => {
			state.isLoadingUsers = true
		})
		build.addCase(putUsersId.fulfilled, (state) => {
			state.isLoadingUsers = false
		})
		build.addCase(putUsersId.rejected, (state) => {
			state.isLoadingUsers = false
		})
		build.addCase(usersDelete.pending, (state) => {
			state.isLoadingUsers = true
		})
		build.addCase(usersDelete.fulfilled, (state) => {
			state.isLoadingUsers = false
		})
		build.addCase(usersDelete.rejected, (state) => {
			state.isLoadingUsers = false
		})
		build.addCase(getUserById.pending, (state) => {
			state.isLoadingUsers = true
		})
		build.addCase(getUserById.fulfilled, (state, { payload }) => {
			state.userByIdData = payload
			state.isLoadingUsers = false
		})
		build.addCase(getUserById.rejected, (state) => {
			state.isLoadingUsers = false
		})
		build.addCase(getUsersAdmin.pending, (state) => {
			state.isLoadingUsers = true
		})
		build.addCase(getUsersAdmin.fulfilled, (state, { payload }) => {
			state.userAdmin = payload
			state.isLoadingUsers = false
		})
		build.addCase(getUsersAdmin.rejected, (state) => {
			state.isLoadingUsers = false
		})
		build.addCase(getUserAdminSelect.pending, (state) => {
			state.isLoadingUsers = true
		})
		build.addCase(getUserAdminSelect.fulfilled, (state, { payload }) => {
			state.userAdminSelect = payload
			state.isLoadingUsers = false
		})
		build.addCase(getUserAdminSelect.rejected, (state) => {
			state.isLoadingUsers = false
		})
	},
})
