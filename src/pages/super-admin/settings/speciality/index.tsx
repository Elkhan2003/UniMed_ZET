import { useState } from 'react'
import {
	useDeleteSpecializationMutation,
	useGetSpecializationQuery,
	usePostSpecializationMutation,
	usePutSpecializationMutation,
} from '../../../../store/services/specialization.service'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { InoiInput } from '../../../../components/UI/input'
import toast from 'react-hot-toast'
import { BsPencilSquare } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'

interface SpecializationItem {
	id: number
	name: string
}

export const SpecialityPage = () => {
	const [selectedCategories, setSelectedCategories] =
		useState<string>('barbershop')
	const { data, refetch } = useGetSpecializationQuery({
		category: selectedCategories,
	})
	const [createSpecialization] = usePostSpecializationMutation()
	const [deleteSpecialization] = useDeleteSpecializationMutation()
	const [putSpecialization] = usePutSpecializationMutation()

	const [text, setText] = useState<string>('')
	const [edit, setEdit] = useState<string>('')
	const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(
		null
	)
	const [selectedId, setSelectedId] = useState<number | null>(null)

	// ! Post
	const handlePostSpecialization = async () => {
		if (!text.trim()) {
			toast.error('Пустой поля')
			return
		}

		try {
			await createSpecialization({
				name: text,
				categoryType: selectedCategories,
			})
			toast.success('Успешный добавлен ')
			setModalType(null)
			setText('')
			refetch()
		} catch (error) {
			toast.error('ошибка')
		}
	}

	//! Delete
	const handleDeleteSpecializationConfirm = async () => {
		if (selectedId !== null) {
			try {
				await deleteSpecialization({ id: selectedId }).unwrap()
				toast.success('Успешно удалено!')
				refetch()
			} catch (error: any) {
				const errorMessage = error?.data?.message
				toast.error(`Ошибка: ${errorMessage}`)
			} finally {
				setModalType(null)
				setSelectedId(null)
			}
		}
	}

	// !Put
	const handlePutSpecialization = async () => {
		if (!edit.trim()) {
			toast.error('Все поля должны быть заполнены')
			return
		}

		try {
			if (selectedId !== null) {
				await putSpecialization({
					id: selectedId,
					name: edit,
					categoryType: selectedCategories,
				})
				toast.success('Специализация успешно обновлена!')
				refetch()
				setModalType(null)
				setEdit('')
			}
		} catch (error: any) {
			const errorMessage = error?.data?.message
			toast.error(`Ошибка: ${errorMessage}`)
		}
	}

	const handleDeleteClick = (id: number) => {
		setSelectedId(id)
		setModalType('delete')
	}

	const handlePutClick = (id: number, name: string) => {
		setSelectedId(id)
		setModalType('edit')
		setEdit(name)
	}

	const handleCategoryChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const value = event.target.value
		setSelectedCategories(value)
	}

	return (
		<div className="p-6  min-h-screen">
			<div className="flex justify-end gap-3">
				<div className="mb-6">
					<select
						value={selectedCategories}
						onChange={handleCategoryChange}
						className="block w-full p-2 border rounded-lg bg-myadmin text-white font-semibold shadow-sm focus:outline-none focus:ring-2 hover:shadow-md transition-all duration-300"
					>
						<option value="barbershop">Парикмахерская</option>
						<option value="beauty_salon">Салон красоты</option>
						<option value="medical">Медицинский центр</option>
					</select>
				</div>
				<Button
					backgroundColor="#5865F2"
					width="200px"
					onClick={() => {
						setModalType('add')
					}}
				>
					Добавить
				</Button>
			</div>

			<div className="grid gap-6     mt-6">
				<p className="text-[30px]">
					{selectedCategories === 'barbershop' && 'Парикмахерская'}
					{selectedCategories === 'beauty_salon' && 'Салон красоты'}
					{selectedCategories === 'medical' && 'Медицинский центр'}
				</p>
				{data?.map((item: SpecializationItem) => (
					<div key={item.id}>
						<div className="flex justify-between items-center border rounded-[10px] h-[60px] border-solid border-[#757778]   p-2 mb-4">
							<h2 className="text-[18px] text-center items-center font-semibold text-gray-800">
								{item.name}
							</h2>
							<div className="flex gap-3 items-center">
								<BsPencilSquare
									onClick={() => {
										handlePutClick(item.id, item.name)
									}}
									fontSize={20}
									className="text-myadmin cursor-pointer"
								/>
								<MdDelete
									onClick={() => handleDeleteClick(item.id)}
									fontSize={20}
									className="text-myadmin cursor-pointer  "
								/>
							</div>
						</div>
					</div>
				))}
			</div>

			{modalType === 'add' && (
				<ModalComponent
					active={true}
					handleClose={() => setModalType(null)}
					title={`Добавить ${
						selectedCategories === 'barbershop'
							? 'Парикмахерская'
							: selectedCategories === 'beauty_salon'
								? 'Салон красоты'
								: selectedCategories === 'Медицина'
									? 'Медицина'
									: 'Специальность'
					}`}
				>
					<div className="flex flex-col w-[300px]  gap-5 p-5 bg-gray-50 rounded-lg">
						<InoiInput
							title=""
							value={text}
							onChange={(e: any) => setText(e.target.value)}
							placeholder="Запишите информацию"
						/>
						<>
							<p className="text-[15px]   text-black">
								{selectedCategories === 'barbershop'
									? 'Парикмахерская'
									: selectedCategories === 'beauty_salon'
										? 'Салон красоты'
										: 'Медицина'}
							</p>
						</>
						<div className="flex gap-4">
							<button
								className={`w-full min-w-[100px] h-[37px] max-h-[37px] rounded-[9px] 
										bg-[var(--myadmin)] text-white font-normal text-[14px] 
										flex items-center justify-center gap-[5px] cursor-pointer 
										outline-none transition ease-in-out duration-100 
										font-[Involve] hover:bg-[var(--myadmin)] 
										disabled:cursor-not-allowed disabled:text-[var(--ui-disabled-color)] 
										disabled:bg-[var(--ui-disabled--background)]`}
								disabled={text === ''}
								onClick={handlePostSpecialization}
							>
								Добавить
							</button>
						</div>
					</div>
				</ModalComponent>
			)}
			{modalType === 'edit' && (
				<ModalComponent
					active={true}
					title={`Изменить ${
						selectedCategories === 'barbershop'
							? 'Парикмахерская'
							: selectedCategories === 'beauty_salon'
								? 'Салон красоты'
								: selectedCategories === 'medical'
									? 'Медицина'
									: 'Специальность'
					} `}
					handleClose={() => setModalType(null)}
				>
					<div className="flex flex-col w-[300px]   gap-5 p-5 bg-gray-50 rounded-lg">
						<InoiInput
							title=""
							value={edit}
							onChange={(e: any) => setEdit(e.target.value)}
							placeholder="Введите новое название"
						/>

						<div className="w-full max-w-md">
							<p className="   text-[15px]   text-black">
								{selectedCategories === 'barbershop'
									? 'Парикмахерская'
									: selectedCategories === 'beauty_salon'
										? 'Салон красоты'
										: 'Медицина'}
							</p>
						</div>

						<div className="flex  gap-4">
							<Button
							
								onClick={() => setModalType(null)}
								backgroundColor="black"
								color="white"
							>
								Отмена
							</Button>
							<Button backgroundColor="#5865F2" disabled={edit === ''} onClick={handlePutSpecialization}>
								Сохранить
							</Button>
						</div>
					</div>
				</ModalComponent>
			)}

			{modalType === 'delete' && (
				<ModalComponent
					active={true}
					handleClose={() => setModalType(null)}
					title="Вы точно хотите удалить?"
				>
					<div className="flex items-center gap-5 p-5 bg-gray-50 rounded-lg">
						<Button
							onClick={() => setModalType(null)}
							backgroundColor="black"
							color="white"
						>
							Отмена
						</Button>
						<Button backgroundColor="#5865F2" onClick={handleDeleteSpecializationConfirm}>Да</Button>
					</div>
				</ModalComponent>
			)}
		</div>
	)
}
