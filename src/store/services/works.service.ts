import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '../../shared/api/api.base-query'
import config from '../../config.json'

const worksService = createApi({
    reducerPath: 'worksApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['works'],
    endpoints: (builder) => ({
        getWorksImages: builder.query<any, any>({
            query: ({branchId}) => `branches/${branchId}/portfolio`,
            providesTags: ['works']
        }),

        deleteWorksImages: builder.mutation<any, any>({
            query: ({ branchId, workImageLinks }) => {
                return {
                    url: `${config.API_URL}branches/${branchId}/portfolio`,
                    method: 'DELETE',
                    body: [workImageLinks]
                
            }
            },
            invalidatesTags: ['works']
        }),
        postWorksImages: builder.mutation<any, any>({
            query: ({branchId, workImageLinks}) => ({
                    url: `${config.API_URL}branches/${branchId}/portfolio`,
                    method: 'POST', 
                    params: {
                        workImages: workImageLinks
                    }       
            }),
            invalidatesTags: ['works']
        })
    }),
})

export default worksService

export const { useGetWorksImagesQuery, useDeleteWorksImagesMutation, usePostWorksImagesMutation } = worksService