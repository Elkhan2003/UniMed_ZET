import { useState } from 'react'
import { Flex } from 'antd'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { DurationCounter } from '../../../../components/UI/DurationCounter/DurationCounter'
import { ImgPicker } from '../../../../components/UI/ImgPicker/ImgPicker'
import { useDispatch } from 'react-redux'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { useAddServiceMutation } from '../../../../store/queries/services.master.service'
import { AppDispatch } from '../../../../store'
import { s3FileThunk } from '../../../../shared/lib/helpers/helpers'
import toast from 'react-hot-toast'

interface AddServiceProp {
	active: boolean
	handleClose: any
	title: string
	dataServices: any
	setDataServices: any
	branchId: string | number | undefined
	validation: boolean
}

export const SubService = ({
	active,
	title,
	dataServices,
	setDataServices,
	branchId,
	handleClose,
	validation,
}: AddServiceProp) => {
	const [loading, setLoading] = useState(false)
	const dispatch = useDispatch<AppDispatch>()

	const handleFileChange = async (event: any) => {
		setDataServices((prev: any) => {
			return {
				...prev,
				image: event,
			}
		})
	}
	const [setAddService] = useAddServiceMutation()

	async function handlePost() {
		setLoading(true)

		try {
			let image

			if (dataServices.image) {
				image = await dispatch(s3FileThunk(dataServices.image)).unwrap()
			}

			const servicesData = {
				...dataServices,
				image: image ? image : undefined,
				branchId,
			}

			if (!servicesData.image) {
				delete servicesData.image
			}

			const result = await setAddService({
				dataServices: servicesData,
			})

			if ('error' in result) {
				throw new Error(
					result.error?.data?.message || 'Произошла ошибка при добавлении.'
				)
			}

			setLoading(false)
			handleClose()
			toast.success('Успешно добавлено!')
		} catch (error: any) {
			console.error(error)
			setLoading(false)
			toast.error(error.message || 'Произошла ошибка!')
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
				<Input
					label="Описание"
					placeholder="Описание"
					value={dataServices.description}
					onChange={(e) => {
						const value = e.target.value
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
