import React, { useState, useEffect } from 'react'
import Checkbox from '../../../../components/UI/Checkbox'
import {
	useDeleteBranchAmenitiesMutation,
	useGetBranchAmentiesQuery,
	useGetBranchAmentiesSelectQuery,
	usePostBranchAmenitiesMutation,
} from '../../../../store/queries/branch.amenities.service'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'

export const FacilitiesPage: React.FC = () => {
	const params = useParams()

	const [selectedOptions, setSelectedOptions] = useState<number[]>([])
	const [selectedDeleteOptions, setSelectedDeleteOptions] = useState<number[]>(
		[]
	)
	const { data: amentiesSelect } = useGetBranchAmentiesSelectQuery({
		branchId: Number(params.id),
	})
	const { data: amentiesData } = useGetBranchAmentiesQuery({
		branchId: Number(params.id),
	})

	const [deleteBranchAmenities] = useDeleteBranchAmenitiesMutation()
	const [postBranchAmenities] = usePostBranchAmenitiesMutation()

	useEffect(() => {
		if (amentiesData) {
			setSelectedDeleteOptions(amentiesData.map((option) => option.id))
		}
		if (amentiesSelect) {
			setSelectedOptions(amentiesSelect.map((option) => option.id))
		}
	}, [amentiesData, amentiesSelect])

	const handlePostCheckboxChange = (id: number) => {
		setSelectedOptions((prev) => {
			const newSelectedOptions = prev.includes(id)
				? prev.filter((item) => item !== id)
				: [...prev, id]

			return newSelectedOptions
		})
		postBranchAmenities({
			branchId: Number(params.id),
			amenityIds: id,
		})
		toast.success('Удобства успешно добавлены в филиал!')
	}

	const handleDeleteCheckboxChange = (id: number) => {
		setSelectedDeleteOptions((prev) => {
			const newSelectedDeleteOptions = prev.includes(id)
				? prev.filter((item) => item !== id)
				: [...prev, id]

			return newSelectedDeleteOptions
		})
		deleteBranchAmenities({
			branchId: Number(params.id),
			amenityIds: id,
		})
		toast.error('Удобство успешно удалено!')
	}

	const handleSelectAllPost = () => {
		const allIds = amentiesSelect?.map((option) => option.id) || []
		setSelectedOptions(allIds)
		postBranchAmenities({ branchId: Number(params.id), amenityIds: allIds })
		toast.success('Удобства успешно добавлены в филиал!')
	}

	return (
		<div className="p-4 max-w-sm">
			{amentiesData?.map((option) => (
				<label
					key={option.id}
					className="flex items-center gap-x-1.5 mb-2 cursor-pointer"
				>
					<Checkbox
						checked={selectedDeleteOptions.includes(option.id)}
						setChecked={() => handleDeleteCheckboxChange(option.id)}
						disabled={false}
					/>
					<img src={option.icon} alt={option.name} className="h-6 w-6" />
					<span className="text-[16px] font-semibold text-[#101010]">
						{option.name}
					</span>
				</label>
			))}

			{amentiesSelect?.map((option) => (
				<label
					key={option.id}
					className="flex items-center gap-x-1.5 mb-2 cursor-pointer"
				>
					<Checkbox
						checked={!selectedOptions.includes(option.id)}
						setChecked={() => handlePostCheckboxChange(option.id)}
						disabled={false}
					/>
					<img src={option.icon} alt={option.name} className="h-6 w-6" />
					<span className="text-[16px] font-semibold text-[#101010]">
						{option.name}
					</span>
				</label>
			))}

			<button
				onClick={handleSelectAllPost}
				className="mt-4 text-[#FF99D4] text-[16px] font-semibold"
			>
				+Добавить все
			</button>
		</div>
	)
}
