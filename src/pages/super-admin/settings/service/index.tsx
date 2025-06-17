import { useState } from 'react'
import { BsPencilSquare } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa6'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import {
	useDeleteSuperServiceMutation,
	useGetSuperServicQuery,
	usePostSuperServiceMutation,
	usePutSuperServiceMutation,
} from '../../../../store/services/settingssevice.service'
import toast from 'react-hot-toast'

import { NewImagePicker } from '../../../../components/shared/image-picker'
import axiosInstance from '../../../../shared/api/axios-config'

interface SubCategory {
	id: number
	name: string
	enName: string
	icon: string | null
	subCategories: null | SubCategory[]
}

interface Category {
	category: string
	id: number
	name: string
	enName: string
	icon: string | null
	subCategories: SubCategory[]
}

const ServiceSuper = () => {
	const [text, setText] = useState({
		name: '',
		enName: '',
	})
	const [des, setDes] = useState({
		name: '',
		enName: '',
		icon: '',
	})

	const [workImageLinkses, setWorkImageLinks] = useState<any>(null)
	const [parentId, setParentId] = useState<null | number>(null)

	const [selectedCategories, setSelectedCategories] =
		useState<string>('barbershop')
	const [expandedCategory, setExpandedCategory] = useState<Set<number>>(
		new Set()
	)
	const [modalType, setModalType] = useState<'add' | 'edit' | 'delete' | null>(
		null
	)
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [selectedId2, setSelectedId2] = useState<number | null>(null)

	const { data, refetch } = useGetSuperServicQuery({
		category: selectedCategories,
	})
	const [createPost] = usePostSuperServiceMutation()
	const [createDelete] = useDeleteSuperServiceMutation()
	const [createPut] = usePutSuperServiceMutation()

	// !Post
	const handlePost = async () => {
		try {
			const formData = new FormData()
			formData.append(`file`, workImageLinkses)
			const res = await axiosInstance.post('files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			const image = res.data
			const resd: any = await createPost({
				body: {
					name: text.name,
					enName: text.enName,
					icon: image,
					parentId: parentId,
					category: selectedCategories,
				},
			}).unwrap()

			if (resd['error']) {
				toast.error(`Произошла ошибка: ${resd?.error.data?.message}`)
			} else {
				toast.success('Успешно Добавлен')
			}

			refetch()
			setText({ name: '', enName: '' })
			setModalType(null)
		} catch (error) {
			console.error(error)
			toast.error('Ошибка при создании записи')
		}
	}

	// ! Put
	const handlePut = async () => {
		if (!des.name || !des.enName || !workImageLinkses) {
			toast.error('Все поля должны быть заполнены')
			return
		}

		try {
			let icon = des.icon

			if (workImageLinkses && typeof workImageLinkses !== 'string') {
				const formData = new FormData()
				formData.append('file', workImageLinkses)

				const imageRes = await axiosInstance.post('files', formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				})

				icon = imageRes.data
			}

			const isSubCategory = data.some((category: { subCategories: any[] }) =>
				category.subCategories?.some(
					(subCategory: any) => subCategory.id === selectedId2
				)
			)

			const response = await createPut({
				id: selectedId2,
				body: {
					name: des.name,
					enName: des.enName,
					icon,
					parentId: isSubCategory ? parentId : null,
					category: isSubCategory ? null : selectedCategories,
				},
			}).unwrap()

			if (response?.error) {
				toast.error(`Произошла ошибка: ${response?.error.data?.message}`)
			} else {
				toast.success('Успешно обновлено')
			}
			refetch()
			setWorkImageLinks(null)
			setModalType(null)
		} catch (error) {
			console.error('Ошибка при обновлении записи:', error)
			toast.error('Ошибка при обновлении записи')
		}
	}

	const handlePutClick = (id: number) => {
		if (!data || !Array.isArray(data)) {
			console.error('Data is not available or is not an array.')
			return
		}

		let selectedItem = data.find((category: Category) => category.id === id)

		if (!selectedItem) {
			for (const category of data) {
				if (category.subCategories) {
					selectedItem = category.subCategories.find(
						(subCategory: any) => subCategory.id === id
					)
					if (selectedItem) break
				}
			}
		}

		if (selectedItem) {
			const { name, enName, icon } = selectedItem
			setDes({ name, enName, icon })
			setSelectedId2(id)
			setModalType('edit')
		} else {
			console.error(`Item with id ${id} not found.`)
			toast.error('Элемент не найден.')
		}
	}

	// !Delete
	const handleDelete = async () => {
		if (selectedId) {
			try {
				await createDelete({ id: selectedId }).unwrap()
				toast.success('Успешно удалено!')
				refetch()
				setModalType(null)
			} catch (error: any) {
				const errorMessage =
					error?.data?.message ||
					'Ошибка: невозможно удалить категорию с подкатегориями.'
				toast.error(errorMessage)
			} finally {
				setModalType(null)
			}
		}
	}

	const handleDeleteClick = (id: number) => {
		setSelectedId(id)
		setModalType('delete')
	}

	const handleCategoryChange = (
		event: React.ChangeEvent<HTMLSelectElement>
	) => {
		const value = event.target.value
		setSelectedCategories(value)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, placeholder } = e.target
		setDes((prev) => ({ ...prev, [placeholder]: value }))
	}
	const handleInputChangesss = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, placeholder } = e.target
		setText((prev) => ({ ...prev, [placeholder]: value }))
	}

	const toggleSubCategory = (categoryId: number) => {
		const newExpandedCategory = new Set(expandedCategory)
		if (newExpandedCategory.has(categoryId)) {
			newExpandedCategory.delete(categoryId)
		} else {
			newExpandedCategory.add(categoryId)
		}
		setExpandedCategory(newExpandedCategory)
	}

	return (
		<div className="p-6  min-h-screen">
			<div className="flex justify-end gap-3">
				<div className="mb-6">
					<select
						value={selectedCategories}
						onChange={handleCategoryChange}
						className="block w-full p-2 border rounded-lg bg-myadmin text-white font-semibold shadow-sm focus:outline-none focus:ring-2  "
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
						setParentId(0)
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
				{data?.map((category: Category) => (
					<div key={category.id}>
						<div
							onClick={() => toggleSubCategory(category.id)}
							className="flex  cursor-pointer  justify-between border rounded-[10px] h-[60px] border-solid border-[#757778]   p-2 mb-4"
						>
							<div className="flex gap-4 items-center">
								<img
									src={category.icon || '/placeholder.png'}
									alt={category.name || 'Category Image'}
									className="w-10 h-10 object-cover rounded-full border border-gray-300"
								/>
								<div className="flex flex-col mt-2">
									<h2 className="text-[18px] font-semibold text-gray-800">
										{category.name}
									</h2>
									<p className="text-sm text-gray-500">{category.enName}</p>
								</div>
							</div>
							<div className="flex gap-3 items-center">
								<BsPencilSquare
									onClick={() => {
										handlePutClick(category.id)
									}}
									fontSize={20}
									className="text-myadmin cursor-pointer"
								/>
								<MdDelete
									onClick={() => handleDeleteClick(category.id)}
									fontSize={20}
									className="text-myadmin cursor-pointer "
								/>
								<button onClick={() => toggleSubCategory(category.id)}>
									{expandedCategory.has(category.id) ? (
										<FaChevronDown size={20} />
									) : (
										<FaChevronRight size={20} />
									)}
								</button>
							</div>
						</div>

						<div
							className={`border-t ml-5 border-gray-200 pt-4 ${
								expandedCategory.has(category.id) ? 'block' : 'hidden'
							}`}
						>
							<div className="flex justify-between items-center mb-2">
								<h1>Категория</h1>
								<Button
									backgroundColor="#5865F2"
									onClick={() => {
										setModalType('add')
										setParentId(category.id)
									}}
									width="170px"
								>
									Добавить
								</Button>
							</div>
							{category.subCategories?.length ? (
								category.subCategories.map((subCategory: any) => (
									<div
										key={subCategory.id}
										className="flex justify-between border rounded-[20px] p-3 h-[55px] border-solid border-[#757778] ml-5 items-center gap-4 mb-3"
									>
										<div className="flex gap-2">
											<img
												src={category.icon || '/placeholder.png'}
												alt={category.name || 'Category Image'}
												className="w-10 h-10 object-cover rounded-full border border-gray-300"
											/>
											<div>
												<p className="text-sm font-medium text-gray-700">
													{subCategory.name}
												</p>
												<p className="text-xs text-gray-500">
													{subCategory.enName}
												</p>
											</div>
										</div>
										<div className="flex gap-3">
											<BsPencilSquare
												onClick={() => {
													handlePutClick(subCategory.id)
												}}
												fontSize={20}
												className="text-myadmin cursor-pointer"
											/>
											<MdDelete
												onClick={() => handleDeleteClick(subCategory.id)}
												fontSize={20}
												className="text-myadmin cursor-pointer "
											/>
										</div>
									</div>
								))
							) : (
								<></>
							)}
						</div>
					</div>
				))}
			</div>
			{modalType === 'add' && (
				<ModalComponent active={true} handleClose={() => setModalType(null)}>
					<div className="w-[300px] mt-4 flex flex-col gap-4">
						<Input
							label="Название"
							type="text"
							placeholder="Запишите информацию"
							value={text.name}
							onChange={(e) => setText({ ...text, name: e.target.value })}
						/>
						<Input
							label="Название"
							type="text"
							placeholder="Запишите информацию"
							value={text.enName}
							onChange={(e) => setText({ ...text, enName: e.target.value })}
						/>
						<NewImagePicker
							value={workImageLinkses}
							setValue={setWorkImageLinks}
						/>
						<p className="text-gray-600">
							{selectedCategories === 'barbershop' && 'Парикмахерская'}
							{selectedCategories === 'beauty_salon' && 'Салон красоты'}
							{selectedCategories === 'medical' && 'Медицинский центр'}
						</p>
						<button
							className={`w-full min-w-[100px] h-[37px] max-h-[37px] rounded-[9px] 
										bg-[var(--myadmin)] text-white font-normal text-[14px] 
										flex items-center justify-center gap-[5px] cursor-pointer 
										outline-none transition ease-in-out duration-100 
										font-[Involve] hover:bg-[var(--myadmin)] 
										disabled:cursor-not-allowed disabled:text-[var(--ui-disabled-color)] 
										disabled:bg-[var(--ui-disabled--background)]`}
							disabled={!text.name || !text.enName || !workImageLinkses}
							onClick={handlePost}
						>
							Добавить
						</button>
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
							backgroundColor="black"
							color="white"
							onClick={() => setModalType(null)}
						>
							Отмена
						</Button>
						<Button backgroundColor="#5865F2" onClick={handleDelete}>
							Да
						</Button>
					</div>
				</ModalComponent>
			)}
			{modalType === 'edit' && (
				<ModalComponent
					active={true}
					handleClose={() => setModalType(null)}
					title={`Изменить ${
						selectedCategories === 'barbershop'
							? 'Парикмахерская'
							: selectedCategories === 'beauty_salon'
								? 'Салон красоты'
								: selectedCategories === 'medical'
									? 'Медицина'
									: 'Специальность'
					} `}
				>
					<div className="w-[300px] mt-2 flex flex-col gap-4 ">
						<Input
							label="Название"
							type="text"
							placeholder="name"
							value={des.name}
							onChange={handleInputChange}
						/>
						<Input
							label="Название"
							type="text"
							placeholder="enName"
							value={des.enName}
							onChange={handleInputChange}
						/>
						<NewImagePicker
							value={workImageLinkses}
							setValue={setWorkImageLinks}
						/>
						<p>
							{selectedCategories === 'barbershop' && 'Парикмахерская'}
							{selectedCategories === 'beauty_salon' && 'Салон красоты'}
							{selectedCategories === 'medical' && 'Медицинский центр'}
						</p>
						<div className="flex items-center gap-5 p-5 bg-gray-50 rounded-lg">
							<Button
								backgroundColor="black"
								color="white"
								onClick={() => setModalType(null)}
							>
								Отмена
							</Button>
							<Button
								backgroundColor="#5865F2"
								onClick={handlePut}
								disabled={!des.name || !des.enName || !workImageLinkses}
							>
								Сохранить
							</Button>
						</div>
					</div>
				</ModalComponent>
			)}
		</div>
	)
}

export default ServiceSuper
