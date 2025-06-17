import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'
interface Amenity {
	id: number
	name: string
	icon: string
}

const branchAmenties = createApi({
	reducerPath: 'branchAmenties',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['branchAmenties'],
	endpoints: (builder) => ({
		getBranchAmenties: builder.query<Amenity[], { branchId: number }>({
			query: ({ branchId }) => `branches/${branchId}/amenities`,
			providesTags: ['branchAmenties'],
		}),
		getBranchAmentiesSelect: builder.query<Amenity[], { branchId: number }>({
			query: ({ branchId }) => `branches/${branchId}/amenities/select`,
			providesTags: ['branchAmenties'],
		}),
		postBranchAmenities: builder.mutation({
			query: ({ branchId, amenityIds }) => {
				return {
					url: `branches/${branchId}/amenities/assign?amenityIds=${amenityIds}`,
					method: 'POST',
				}
			},
			invalidatesTags: ['branchAmenties'],
		}),
		deleteBranchAmenities: builder.mutation({
			query: ({ branchId, amenityIds }) => {
				return {
					url: `branches/${branchId}/amenities/remove?amenityIds=${amenityIds}`,
					method: 'DELETE',
				}
			},
			invalidatesTags: ['branchAmenties'],
		}),
	}),
})

export default branchAmenties

export const {
	useGetBranchAmentiesQuery,
	useGetBranchAmentiesSelectQuery,
	useDeleteBranchAmenitiesMutation,
	usePostBranchAmenitiesMutation,
} = branchAmenties
