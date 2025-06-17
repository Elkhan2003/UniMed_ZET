import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const userService = createApi({
	reducerPath: 'userApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['user'],
	endpoints: (builder) => ({
		getUserAdminSelect: builder.query<
			any,
			{ search: string; isGlobal: boolean }
		>({
			query: ({ search, isGlobal }) =>
				`users/select?search=${search}&isGlobal=${isGlobal}`,
		}),
		useGetUserProfile: builder.query<any, any>({
			query: ({ userId }) => `users/profile/${userId}`,
		}),
		getUsersAdmin: builder.query({
			query: ({ page, size, search }) =>
				`users/?page=${page || 1}&size=${size}${
					search ? `&search=${search}` : ''
				}`,
		}),
		checkPhoneNumber: builder.query<any, any>({
			query: (data) => `/auth/phone-number/check?phoneNumber=%2B${data}`,
		}),
		changePassword: builder.mutation<any, any>({
			query: ({ oldPassword, newPassword }) => {
				return {
					url: `/auth/password/change`,
					method: 'PUT',
					params: {
						oldPassword,
						newPassword,
					},
				}
			},
		}),
		resetPasswordAuth: builder.mutation<any, any>({
			query: ({ password, token }) => {
				return {
					url: `auth/password/reset?password=${password}`,
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			},
		}),
		deleteUser: builder.mutation<any, any>({
			query: (userId) => {
				return {
					url: `/users/${userId}`,
					method: 'DELETE',
				}
			},
		}),
		putUser: builder.mutation<any, any>({
			query: ({ userId, body }) => {
				return {
					url: `/users/${userId}`,
					method: 'PUT',
					body: body,
				}
			},
		}),
		passwordRecovery: builder.mutation<any, any>({
			query: (phoneNumber) => ({
				url: `verification/reset/send?phoneNumber=${phoneNumber}`,
				method: 'POST',
			}),
		}),
		resetVerification: builder.mutation<boolean, any>({
			query: ({ phoneNumber, code }) => ({
				url: `verification/verify?phoneNumber=${phoneNumber}&code=${code}`,
				method: 'POST',
			}),
		}),
		postUsersRegistrationByAdmin: builder.mutation<any, any>({
			query: (body) => ({
				url: `users/admin-registration`,
				method: 'POST',
				body: body,
			}),
		}),
	}),
})

export default userService

export const {
	useCheckPhoneNumberQuery,
	useGetUserAdminSelectQuery,
	useLazyGetUserAdminSelectQuery,
	useUseGetUserProfileQuery,
	useGetUsersAdminQuery,
	useLazyGetUsersAdminQuery,
	useChangePasswordMutation,
	useDeleteUserMutation,
	usePutUserMutation,
	usePasswordRecoveryMutation,
	useResetVerificationMutation,
	useResetPasswordAuthMutation,
	usePostUsersRegistrationByAdminMutation,
} = userService
