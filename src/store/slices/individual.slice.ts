import { createSlice } from '@reduxjs/toolkit'
import individualService from '../queries/individual.service'
import { IIndividual } from '../../common/individual'

interface initialState {
	individualData: IIndividual | undefined
}

const initialState: initialState = {
	individualData: undefined,
}

export const individualSlice = createSlice({
	name: 'individual',
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addMatcher(
			individualService.endpoints.getIndividual.matchFulfilled,
			(state, { payload }) => {
				state.individualData = payload
			}
		)
	},
})

export const {} = individualSlice.actions
