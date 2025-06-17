import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'


const regionService = createApi({
    reducerPath: 'regionApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ["region"],
    endpoints: (builder) => ({
        regionSelect: builder.query<any, any>({
            query: ({ countryId }) => `regions/${countryId}/select`,
            providesTags: ["region"]
        }),
        postRegion: builder.mutation<any, any>({
            query: ({ countryId, body }) => ({
                url: `regions/${countryId}`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["region"]
        }),
        deleteRegion: builder.mutation<any, any>({
            query: ({regionId}) => ({
                url: `regions/${regionId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ["region"]
        })
    }),
})

export default regionService

export const { useDeleteRegionMutation, usePostRegionMutation, useRegionSelectQuery } = regionService