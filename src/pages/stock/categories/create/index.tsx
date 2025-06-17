import { useState } from 'react'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { usePostInventoryCategory } from '../../../../shared/queries/inventory.queries'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { Button } from '../../../../components/UI/Buttons/Button/Button'

export const CreateCategory = ({
	active,
	setActive,
}: {
	active: boolean
	setActive: (active: boolean) => void
}) => {
	const [name, setName] = useState('')

	const { mutate: createCategory } = usePostInventoryCategory(() => {
		setActive(false)
		setName('')
	})

	const handleCreateCategory = () => {
		createCategory(name)
	}

	return (
		<ModalComponent
			active={active}
			handleClose={() => {
				setActive(false)
				setName('')
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
					onClick={handleCreateCategory}
				>
					Добавить
				</Button>
			</div>
		</ModalComponent>
	)
}
