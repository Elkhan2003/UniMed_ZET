import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'

const facilitiesService = createApi({
    reducerPath: 'facilitiesApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Facilities"],
    endpoints: (builder) => ({
        getFacilitiesByBranchId: builder.query<any, any>({
            query: ({branchId}: any) => `branches/${branchId}/amenities`,
            providesTags: ['Facilities'],
        }),

        getFacilitiesSelect: builder.query<any, any>({
            query: ({branchId}: any) => `branches/${branchId}/amenities/select`,
            providesTags: ['Facilities'],
        }),

        deleteFacilitiesByBranchId: builder.mutation<any, any>({
            query: ({branchId, amenityIds}: any) => ({
                url: `branches/${branchId}/amenities?amenityIds=${amenityIds}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Facilities'],
        }),

        postFacilitiesByBranchId: builder.mutation<any, any>({
            query: ({branchId, amenityIds}) => {
                const facilitiesArray = amenityIds
				.map((item: any) => {
					return `amenityIds=${item}`
				})
				.join('&')
                return {
                    url: `branches/${branchId}/amenities?${facilitiesArray}`,
                    method: 'POST'
                }
            },
            invalidatesTags: ['Facilities'],
        }),
        
    }),
})

export default facilitiesService

export const { useGetFacilitiesByBranchIdQuery, useDeleteFacilitiesByBranchIdMutation, usePostFacilitiesByBranchIdMutation, useGetFacilitiesSelectQuery } = facilitiesService