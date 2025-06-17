export interface ServiceResponse {
	id: number
	name: string
	price: number
	duration: number
	description: string
	image: string
	type: boolean
}

export interface SubCategoryService {
	id: number
	name: string
	serviceResponses: ServiceResponse[]
}

export interface Category {
	id: number
	name: string
	icon: string
	subCategoryServices: SubCategoryService[]
}
