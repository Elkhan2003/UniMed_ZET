import { useEffect, useState } from 'react'
import { Flex } from 'antd'
import { InoiInput } from '../../../../components/UI/input'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import clsx from 'clsx'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import {
	usePostTarifMutation,
	usePutTarifMutation,
} from '../../../../store/queries/tarrif.service'
import { CloseOutlined } from '@ant-design/icons'
import toast from 'react-hot-toast'
import Checkbox from '../../../../components/UI/Checkbox'

interface TransformTarrifProps {
	active: boolean
	handleClose: () => void
	editData?: any
	setTabProp: (prev: number) => void
	editId: number
	tab: number
	setTab: (prev: number) => void
}

interface TariffRequest {
	name: string
	description: string
	price: number
	pricePerUser: number
	durationInDays: number 
	maxUsers: number
	active: boolean
	discount: number
	tariffType: 'COMPANY' | 'PERSONAL'
	features: string[] 
	colors: string[]
}

const TARRIF_OPTIONS = [
	{ name: 'Индивидуал', value: 'PERSONAL' },
	{ name: 'Компания', value: 'COMPANY' },
]

const TARRIFF_COLORS = [
	[],
	['#FFC4E1', '#FFC4E1'],
	['#FF8A24', '#0EA5E9', '#3FC24C'],
	['#4E4E4E80', '#FFC6C6', '#FF5E5E'],
	['#FF4BAF', '#FFC4E1', '#903FC2'],
]

const classNamesPositions = [
	'top-[-10px] left-[-10px]',
	'top-[10px] right-[-10px]',
	'bottom-[-10px] right-[10px]',
]

export const NOORUZ: Array<'COMPANY' | 'PERSONAL'> = ['PERSONAL', 'COMPANY']

const findColorIndex = (color: string) => {
	if (color === '') return 0
	return TARRIFF_COLORS.findIndex((row) => row.includes(color))
}

export const TransformTarrif = ({
	active,
	handleClose,
	editData,
	setTabProp,
	editId,
	tab,
	setTab,
}: TransformTarrifProps) => {
	const [colorIndex, setColorIndex] = useState(0)
	const [title, setTitle] = useState('Создать тариф')
	const [errors, setErrors] = useState<any>({})
	const [loading, setLoading] = useState(false)
	const [featues, setFeatures] = useState('')

	const [postTarif] = usePostTarifMutation()
	const [putTarif] = usePutTarifMutation()

	const [tarrif, setTarrif] = useState<TariffRequest>({
		name: '',
		description: '',
		price: 0,
		durationInDays: 0,
		maxUsers: 0,
		active: true,
		tariffType: NOORUZ[tab],
		features: [],
		colors: [],
		discount: 0,
		pricePerUser: 0,
	})

	useEffect(() => {
		if (editData?.name) {
			setTitle('Редактировать тариф')
			setTarrif(editData)
			setTab(NOORUZ.indexOf(editData.tariffType))
			setColorIndex(findColorIndex(editData?.colors[0] || ''))
		} else {
			setTarrif({
				name: '',
				description: '',
				price: 0,
				durationInDays: 0,
				maxUsers: 0,
				active: true,
				tariffType: NOORUZ[tab],
				features: [],
				discount: 0,
				pricePerUser: 0,
				colors: [],
			})
			setTitle('Создать тариф')
			setColorIndex(0)
		}
		setFeatures('')
	}, [active, editData])

	const validate = () => {
		const newErrors: any = {}
		if (!tarrif.name.trim()) newErrors.name = 'Введите название'
		if (
			typeof tarrif.price !== 'number' ||
			isNaN(tarrif.price) ||
			tarrif.price <= 0
		) {
			newErrors.price = 'Введите корректную цену'
		}

		if (
			!tarrif.durationInDays ||
			isNaN(Number(tarrif.durationInDays)) ||
			Number(tarrif.durationInDays) <= 0
		)
			newErrors.durationInDays = 'Укажите корректную продолжительность'
		if (tarrif.tariffType === 'COMPANY' && Number(tarrif.pricePerUser) <= 0)
			newErrors.pricePerUser = 'Укажите корректное число'
		if (tarrif.tariffType === 'COMPANY') {
			if (
				!tarrif.maxUsers ||
				isNaN(Number(tarrif.maxUsers)) ||
				Number(tarrif.maxUsers) <= 0
			)
				newErrors.maxUsers = 'Укажите корректное число сотрудников'
		}
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSave = async () => {
		if (!validate()) return
		setLoading(true)
		try {
			const response = await postTarif({
				...tarrif,
				features: tarrif.features.map((item: any) => item.name),
				colors: TARRIFF_COLORS[colorIndex],
			}).unwrap()
			setTabProp(NOORUZ.indexOf(tarrif.tariffType))
			toast.success('Успешна создана!')
			handleClose()
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		} finally {
			setLoading(false)
		}
	}

	const handleEdit = async () => {
		if (!validate()) return
		setLoading(true)
		try {
			const response = await putTarif({
				body: {
					...tarrif,
					features: tarrif.features.map((item: any) => item.name),
					colors: TARRIFF_COLORS[colorIndex],
				},
				id: editId,
			}).unwrap()
			setTabProp(NOORUZ.indexOf(tarrif.tariffType))
			toast.success('Успешна изменена')
			handleClose()
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		} finally {
			setLoading(false)
		}
	}

	return (
		<ModalComponent
			active={active}
			handleClose={() => {
				handleClose()
				setFeatures('')
			}}
			title={title}
		>
			<Flex
				vertical
				gap={10}
				className="w-[600px] overflow-hidden max-h-[90vh] overflow-y-auto"
			>
				<Flex align="center" gap={10}>
					<p>Тип тарифа</p>
					{NOORUZ.map((item, index) => (
						<div
							key={item}
							className={clsx(
								'flex justify-center items-center p-1.5 px-3 rounded-[16px] cursor-pointer',
								{ 'text-[#949393] bg-[#F2F2F2]': index !== tab },
								{ 'bg-myadmin text-white': index === tab }
							)}
							onClick={() => {
								setTab(index)
								setTarrif({ ...tarrif, tariffType: item })
							}}
						>
							{TARRIF_OPTIONS[index].name}
						</div>
					))}
				</Flex>
				<Flex vertical>
					<p>Цвет тарифа</p>
					<div className="grid grid-cols-5 mt-2">
						{TARRIFF_COLORS.map((item, index) => (
							<div
								style={{
									borderColor:
										index === colorIndex ? 'var(--myadmin)' : '#D8DADC',
								}}
								onClick={() => setColorIndex(index)}
								key={index}
								className="w-[90px] h-[90px] rounded-[16px] relative overflow-clip border-[2px] border-solid"
							>
								{item.map((inner, innerIndex) => (
									<div
										key={innerIndex}
										className={`absolute ${classNamesPositions[innerIndex]} h-12 w-12 rounded-full blur-lg`}
										style={{ backgroundColor: inner }}
									></div>
								))}
							</div>
						))}
					</div>
				</Flex>

				<Flex gap={10} align="center">
					<Checkbox
						checked={!tarrif.active}
						setChecked={(checked: boolean) =>
							setTarrif({ ...tarrif, active: !checked })
						}
						color="bg-myadmin"
					/>
					<p>Скрыть тариф</p>
				</Flex>
				<InoiInput
					classNames="focus:border-blue-600"
					value={tarrif.name}
					onChange={(e: any) => setTarrif({ ...tarrif, name: e.target.value })}
					placeholder="Название тарифа"
					title="Название"
					error={errors.name}
				/>
				<Flex gap={10}>
					<InoiInput
						classNames="focus:border-blue-600"
						value={tarrif.durationInDays}
						onChange={(e: any) =>
							setTarrif({
								...tarrif,
								durationInDays: Number(e.target.value.replace(/\D/g, 0)),
							})
						}
						title="Продолжительность в днях"
						placeholder="Посчитайте и напишите продолжительность в днях"
						error={errors.durationInDays}
					/>
					{tab === 1 && (
						<InoiInput
							classNames="focus:border-blue-600"
							value={tarrif.maxUsers}
							onChange={(e: any) =>
								setTarrif({
									...tarrif,
									maxUsers: e.target.value.replace(/\D/g, ''),
								})
							}
							placeholder="Кол-во сотрудников"
							title="Количество сотрудников"
							error={errors.maxUsers}
						/>
					)}
					<InoiInput
						classNames="focus:border-blue-600"
						value={tarrif.price}
						onChange={(e: any) =>
							setTarrif({
								...tarrif,
								price: Number(e.target.value.replace(/\D/g, 0)),
							})
						}
						placeholder="Цена"
						title="Цена"
						error={errors.price}
					/>
				</Flex>
				<Flex gap={10}>
					{tab === 1 && (
						<InoiInput
							classNames="focus:border-blue-600 w-full"
							value={tarrif.pricePerUser}
							onChange={(e: any) =>
								setTarrif({
									...tarrif,
									pricePerUser: e.target.value.replace(/\D/g, ''),
								})
							}
							placeholder="Цена для каждого специалиста"
							title="Цена для каждого специалиста в сомах"
							error={errors.pricePerUser}
						/>
					)}
					<InoiInput
						classNames="focus:border-blue-600 w-full"
						value={tarrif.discount}
						onChange={(e: any) =>
							setTarrif({
								...tarrif,
								discount: e.target.value.replace(/\D/g, ''),
							})
						}
						placeholder="Какую скидку предоставляете в %"
						title="Скидка %"
					/>
				</Flex>
				<Flex vertical className="w-full" align="end" gap={5}>
					<div className="w-full flex gap-2 flex-wrap">
						{tarrif.features?.map((item: any, index: number) => (
							<Flex
								key={index}
								align="center"
								justify="space-between"
								gap={5}
								className="bg-[#F2F2F1] rounded-[10px] px-2"
							>
								<p>{item.name}</p>
								<CloseOutlined
									className="cursor-pointer text-red-500"
									onClick={() => {
										setTarrif((prev: any) => ({
											...prev,
											features: prev.features.filter(
												(_: any, i: number) => i !== index
											),
										}))
									}}
								/>
							</Flex>
						))}
					</div>
					<InoiInput
						classNames="focus:border-blue-600"
						value={featues}
						onChange={(e: any) => setFeatures(e.target.value)}
						placeholder="Напишите описание"
						title="Описание"
						error={errors.features}
					/>
					<Button
						onClick={() => {
							if (!featues.trim()) return
							setTarrif((prev: any) => ({
								...prev,
								features: [
									...prev.features,
									{ name: featues, value: prev.features.length },
								],
							}))
							setFeatures('')
						}}
						backgroundColor="var(--myadmin)"
						width="90px"
						borderRadius="16px"
						fontSize="13px"
					>
						Добавить+
					</Button>
				</Flex>
				{/* <TextArea
					value={tarrif.description}
					onChange={(e) => setTarrif({ ...tarrif, description: e })}
					placeholder="Описание"
					label="Описание"
					error={errors.description}
				/> */}
				<Flex justify="space-between" gap={10}>
					<Button
						backgroundColor="white"
						color="var(--myadmin)"
						onClick={handleClose}
						border="1px solid var(--myadmin)"
					>
						Отменить
					</Button>
					<Button
						loadingColor="white"
						disabled={loading}
						isLoading={loading}
						backgroundColor="var(--myadmin)"
						onClick={title === 'Создать тариф' ? handleSave : handleEdit}
					>
						Сохранить
					</Button>
				</Flex>
			</Flex>
		</ModalComponent>
	)
}
