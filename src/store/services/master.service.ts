import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const masterService = createApi({
	reducerPath: 'masterdApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Master'],
	endpoints: (builder) => ({
		getMaster: builder.query<any, any>({
			query: ({ branchId }: any) => `/masters/branches/${branchId}`,
			providesTags: ['Master'],
		}),
		deleteMaster: builder.mutation<any, any>({
			query: ({ masterId }) => ({
				url: `/masters/${masterId}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Master'],
		}),
		getMasterServicesSelect: builder.query<any, any>({
			query: ({ masterId }) => `/masters/${masterId}/services/select`,
			providesTags: ['Master'],
		}),
		postMaster: builder.mutation<any, any>({
			query: ({ branchId, masterData }) => ({
				url: `/masters/branches/${branchId}`,
				method: 'POST',
				body: masterData,
			}),
			invalidatesTags: ['Master'],
		}),
		putMaster: builder.mutation<any, any>({
			query: ({ masterId, masterData }) => ({
				url: `/masters/${masterId}`,
				method: 'PUT',
				body: masterData,
			}),
		}),
		getMasterById: builder.query<any, any>({
			query: ({ masterId }: any) => `/masters/${masterId}/public`,
		}),
		getMasterInfo: builder.query<any, any>({
			query: ({ masterId }: any) => `/masters/${masterId}/profile`,
		}),
		getMastersSalaryRate: builder.query<any, any>({
			query: ({ branchId }) => `/salary-rates/branches/${branchId}/masters`,
			providesTags: ['Master'],
		}),
		getMasterSchedule: builder.query<any, any>({
			query: ({ masterId, startWeek }) =>
				`/schedules/masters/${masterId}?startWeek=${startWeek}`,
			providesTags: ['Master'],
		}),
		getMasterProfile: builder.query<any, void>({
			query: () => '/personal-masters/me',
			providesTags: ['Master'],
		}),
		putMasterServices: builder.mutation<any, any>({
			query: ({ masterId, serviceIds }) => {
				return {
					url: `/v6/masters/${masterId}/services`,
					method: 'PUT',
					params: {
						serviceIds,
					},
				}
			},
			invalidatesTags: ['Master'],
		}),
		removeMasterServices: builder.mutation<any, any>({
			query: ({ masterId, serviceIds }) => ({
				url: `/v6/masters/${masterId}/services`,
				method: 'DELETE',
				params: {
					serviceIds,
				},
			}),
		}),
		getMasterPrivilages: builder.query<any, any>({
			query: (masterId: number | string) => `/masters/${masterId}/privileges`,
		}),
		putMasterPrivilages: builder.mutation<any, any>({
			query: ({ masterId, body }) => {
				return {
					url: `/masters/${masterId}/privileges`,
					method: 'PUT',
					body: body,
				}
			},
		}),
		getEmployeeAccess: builder.query<any, any>({
			query: (companyId: number) => `/companies/${companyId}/master-settings`,
		}),
		putEmployeeAccess: builder.mutation<any, any>({
			query: ({ companyId, body }) => {
				return {
					url: `/companies/${companyId}/master-settings`,
					method: 'PUT',
					body: body,
				}
			},
		}),
	}),
})

export default masterService

export const {
	useGetMasterQuery,
	useDeleteMasterMutation,
	useGetMasterServicesSelectQuery,
	usePostMasterMutation,
	usePutMasterMutation,
	useGetMasterByIdQuery,
	useGetMastersSalaryRateQuery,
	useGetMasterInfoQuery,
	useLazyGetMasterInfoQuery,
	useGetMasterScheduleQuery,
	useGetMasterProfileQuery,
	usePutMasterServicesMutation,
	useRemoveMasterServicesMutation,
	useGetMasterPrivilagesQuery,
	usePutMasterPrivilagesMutation,
	useGetEmployeeAccessQuery,
	usePutEmployeeAccessMutation,
} = masterService
