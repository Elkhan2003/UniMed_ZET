import { useEffect, useState } from 'react'
import { Flex } from 'antd'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { LonelySelect } from '../../../../components/UI/Selects/LonelySelect/LonelySelect'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { DurationCounter } from '../../../../components/UI/DurationCounter/DurationCounter'
import { ImgPicker } from '../../../../components/UI/ImgPicker/ImgPicker'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { TextArea } from '../../../../components/UI/Inputs/TextArea/TextArea'
import { useAddServiceMutation } from '../../../../store/queries/services.master.service'
import { s3FileThunk } from '../../../../shared/lib/helpers/helpers'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../../../store'
import toast from 'react-hot-toast'

interface AddServiceProp {
	active: boolean
	handleClose: any
	title: string
	dataServices: any
	setDataServices: any
	services: any
	validation: boolean
	branchId: number | undefined
}

export const AddService = ({
	active,
	title,
	dataServices,
	setDataServices,
	services,
	handleClose,
	validation,
	branchId,
}: AddServiceProp) => {
	const [subId, setSubId] = useState(0)
	const [selectedSub, setSelectedSub] = useState(null)
	const [loading, setLoading] = useState(false)
	const [category, setCategory] = useState<any>(null)
	const dispatch = useDispatch<AppDispatch>()

	const handleFileChange = async (file: File) => {
		setDataServices((prev: any) => ({
			...prev,
			image: file,
		}))
	}

	const [setAddService] = useAddServiceMutation()
	function handleChangeCategoryServices(item: any) {
		setCategory(item)
	}

	function handleSubChange(item: any) {
		setSelectedSub(item)
		setSubId(item.value)
	}

	async function handlePost() {
		try {
			setLoading(true)
			let image

			if (dataServices.image) {
				image = await dispatch(s3FileThunk(dataServices.image)).unwrap()
			}

			const servicesData = {
				...dataServices,
				image: image ? image : undefined,
				branchId: branchId,
				categoryId: subId,
			}

			if (!servicesData.image) {
				delete servicesData.image
			}

			const result = await setAddService({
				dataServices: servicesData,
			})

			if ('error' in result) {
				throw new Error(
					(result as any).error?.data?.message ||
						'Произошла ошибка при добавлении.'
				)
			}

			toast.success('Успешно добавлено!')
			handleClose()
		} catch (error: any) {
			console.error(error)
			toast.error(error.message || 'Произошла ошибка!')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (services?.length && services?.length === 1) {
			const res = services[0]
			setCategory({
				value: res.id,
				label: res.name,
				services: res.subCategories,
			})
		}
	}, [services])

	return (
		<ModalComponent active={active} title={title} handleClose={handleClose}>
			<Flex vertical gap={10} className="w-[450px]">
				<Flex gap={10}>
					<LonelySelect
						label="Категория"
						placeholder="Выберите Категорию"
						noOptionsMessage={() => 'Нет категорию'}
						isClearable={true}
						isLoading={false}
						options={services?.map((item: any) => {
							return {
								label: item.name,
								value: item.id,
								services: item.subCategories,
							}
						})}
						value={category}
						onChange={(e) => handleChangeCategoryServices(e)}
						required
					/>
					<LonelySelect
						label="Под категория"
						placeholder="Под категория"
						noOptionsMessage={() => 'Нет под категория'}
						isDisabled={category === null}
						isClearable={true}
						options={category?.services?.map((item: any) => {
							return { label: item.name, value: item.id }
						})}
						isLoading={false}
						value={selectedSub}
						onChange={(e) => handleSubChange(e)}
						required
					/>
				</Flex>
				<Flex gap={10}>
					<Input
						label="Название услуги"
						placeholder="Название услуги"
						value={dataServices.name}
						onChange={(e) => {
							const value = e.target.value
							setDataServices({ ...dataServices, name: value })
						}}
						required
					/>
					<div className="max-w-[130px]">
						<Input
							label="Цена"
							placeholder="Цена"
							value={dataServices.price}
							onChange={(e) => {
								const value = e.target.value
								setDataServices({ ...dataServices, price: value })
							}}
							required
						/>
					</div>
					<DurationCounter
						required
						label="Длительность"
						count={dataServices.duration}
						setCount={(e) => setDataServices({ ...dataServices, duration: e })}
					/>
				</Flex>
				<TextArea
					label="Описание"
					placeholder="Описание"
					value={dataServices.description}
					onChange={(e) => {
						const value = e
						setDataServices({ ...dataServices, description: value })
					}}
				/>
				<ImgPicker value={dataServices.image} onChange={handleFileChange} />
				<Flex justify="end">
					<Button
						isLoading={loading}
						disabled={validation}
						onClick={handlePost}
					>
						Сохранить
					</Button>
				</Flex>
			</Flex>
		</ModalComponent>
	)
}
