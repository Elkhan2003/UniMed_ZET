import { useState } from 'react'
import { Flex } from 'antd'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { DurationCounter } from '../../../../components/UI/DurationCounter/DurationCounter'
import { ImgPicker } from '../../../../components/UI/ImgPicker/ImgPicker'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { TextArea } from '../../../../components/UI/Inputs/TextArea/TextArea'
import { usePutCategoryServiceMutation } from '../../../../store/queries/services.master.service'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../../store'
import { s3FileThunk } from '../../../../shared/lib/helpers/helpers'
import toast from 'react-hot-toast'

interface AddServiceProp {
	active: boolean
	handleClose: any
	title: string
	dataServices: any
	setDataServices: any
	services: any
	branchId: string | number | undefined
	editId: any
	validation: boolean
}

export const EditService = ({
	active,
	title,
	dataServices,
	setDataServices,
	branchId,
	handleClose,
	editId,
	validation,
}: AddServiceProp) => {
	const [loading, setLoading] = useState(false)
	const [putCategoryService] = usePutCategoryServiceMutation()
	const dispatch = useDispatch<AppDispatch>()
	const [isActiveFileUpload, setIsActiveFileUpload] = useState<boolean>(false)

	const handleFileChange = async (file: File) => {
		setDataServices((prev: any) => ({
			...prev,
			image: file,
		}))
		setIsActiveFileUpload(true)
	}

	const handleUpdate = async () => {
		let image = dataServices.image

		try {
			setLoading(true)

			if (isActiveFileUpload && dataServices.image) {
				image = await dispatch(s3FileThunk(dataServices.image)).unwrap()
			}

			const servicesData = {
				...dataServices,
				image: image,
			}

			if (!servicesData.image) {
				delete servicesData.image
			}

			const result = await putCategoryService({
				branchId: branchId,
				servicesData: servicesData,
				servicesId: Number(editId),
			})

			if ('error' in result) {
				throw new Error(
					result.error?.data?.message || 'Произошла ошибка при обновлении.'
				)
			}

			toast.success('Успешно обновлено!')
			setIsActiveFileUpload(false)
			handleClose()
		} catch (error: any) {
			console.error(error)
			toast.error(error.message || 'Произошла ошибка!')
		} finally {
			setLoading(false)
		}
	}

	return (
		<ModalComponent active={active} title={title} handleClose={handleClose}>
			<Flex vertical gap={10} className="w-[450px]">
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
						onClick={handleUpdate}
					>
						Сохранить
					</Button>
				</Flex>
			</Flex>
		</ModalComponent>
	)
}
