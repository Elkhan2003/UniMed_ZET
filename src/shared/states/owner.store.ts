import { create } from 'zustand'

export const useOwnerStore = create((set) => ({
	branchId: null,
	setBranchId: (branchId: number) => set({ branchId: branchId }),
	ownerData: null,
	setOwnerData: (data: any) => set({ ownerData: data }),
	storeArhiveProducts: null,
	setStoreArhiveProducts: (func: Function) =>
		set({ storeArhiveProducts: func }),
}))
