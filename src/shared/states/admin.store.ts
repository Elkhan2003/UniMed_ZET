import { create } from 'zustand'
import { IBranchesStuffCurrent } from '../types/branch.types'

export const useAdminStore = create<{
	adminData: IBranchesStuffCurrent | undefined
	setAdminData: (newAdminData: IBranchesStuffCurrent) => void
}>((set) => ({
	adminData: undefined,
	setAdminData: (newAdminData: IBranchesStuffCurrent) =>
		set({ adminData: newAdminData }),
}))
