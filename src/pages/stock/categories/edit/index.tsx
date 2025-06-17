import { useEffect, useState } from 'react'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { useUpdateInventoryCategory } from '../../../../shared/queries/inventory.queries'

export const EditCategory = ({
	active,
	setActive,
	editData,
}: {
	active: boolean
	setActive: (active: boolean) => void
	editData: { name: string; id: number } | null
}) => {
	const [name, setName] = useState('')

	const { mutate: updateCategory } = useUpdateInventoryCategory(() => {
		setActive(false)
	})

	const handleUpdateCategory = () => {
		if (editData?.id) updateCategory({ id: editData.id, name })
	}

	useEffect(() => {
		if (editData?.name) setName(editData.name)
	}, [editData])

	return (
		<ModalComponent
			active={active}
			handleClose={() => {
				setActive(false)
			}}
		>
			<div className="w-[300px] flex flex-col gap-[10px]">
				<p className="text-[#101010] text-[16px] font-[600]">
					Добавить категорию
				</p>
				<Input
					label="Название"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<Button
					borderRadius="24px"
					width="fit-content"
					disabled={!name}
					onClick={handleUpdateCategory}
				>
					Добавить
				</Button>
			</div>
		</ModalComponent>
	)
}
