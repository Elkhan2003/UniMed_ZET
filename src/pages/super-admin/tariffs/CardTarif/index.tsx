import { Flex } from 'antd'

import { EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons'
import { useDeleteTarifMutation } from '../../../../store/queries/tarrif.service'
import toast from 'react-hot-toast'
import { useState } from 'react'
import { DeleteModal } from '../../../../components/UI/Modal/DeleteModal/DeleteModal'
import { NOORUZ } from '../TransformTarrif'
import {
	calculateRate,
	formatDuration,
} from '../../../../shared/lib/helpers/helpers'
import { GoEyeClosed } from 'react-icons/go'
import { classNamesPositions } from '../../../personal_master/Subscription/CurrentTarif'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { Backdrop, CircularProgress } from '@mui/material'
import { isLoadingSx } from '../../../../shared/lib/constants/constants'

export interface CardTarifProps {
	id: number
	index: number
	key: number
	name: string
	price: number
	durationInDays: number
	maxUsers: number
	active: true
	tariffType: 'PERSONAL' | 'COMPANY'
	features: string[]
	colors: string[]
	pricePerUser: number
	discount: number
	setActive: (prev: boolean) => void
	setEditData: (prev: any) => void
	setEditId: (prev: number) => void
	setTab: (prev: number) => void
}

export const CardTarif = ({
	id,
	name,
	price,
	index,
	durationInDays,
	maxUsers,
	active,
	tariffType,
	features,
	colors,
	key,
	pricePerUser,
	discount,
	setActive,
	setEditData,
	setEditId,
	setTab,
}: CardTarifProps) => {
	const [deleteTarif] = useDeleteTarifMutation()
	const [deleteId, setDeleteId] = useState(0)
	const [deleteModal, setDeleteModal] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const handleDelete = async () => {
		try {
			setDeleteModal(false)
			setIsLoading(true)
			const response: any = await deleteTarif(deleteId)
			setDeleteModal(false)
			if (response['error']) {
				toast.error(response?.error?.data?.message || 'Произошла ошибка!')
			} else {
				toast.success('Тариф успешно удален!')
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		} finally {
			setIsLoading(false)
		}
	}

	const formattedDuration = formatDuration(durationInDays)

	return (
		// <div className="rounded-[16px] bg-gray-50 shadow-md">
		// 	<DeleteModal
		// 		active={deleteModal}
		// 		handleClose={() => setDeleteModal(false)}
		// 		handleTrueClick={handleDelete}
		// 		title="Удаление тарифа"
		// 		okText="Удалить"
		// 		okColor
		// 	/>
		// 	<Flex
		// 		align="start"
		// 		justify="space-between"
		// 		style={{backgroundColor: active ? 'var(--myadmin)': '#949393'}}
		// 		className="bg-myadmin rounded-[16px] p-[10px]"
		// 	>
		// 		<EditOutlined
		// 			onClick={() => {
		// 				setTab(NOORUZ.indexOf(tariffType))
		// 				setEditId(id)
		// 				setEditData({
		// 					name: name,
		// 					description: '',
		// 					price: price,
		// 					durationInDays: durationInDays,
		// 					maxUsers: maxUsers,
		// 					active: active,
		// 					tariffType: tariffType,
		// 					features: features.map((item: any, index: number) => {
		// 						return { name: item, value: index }
		// 					}),
		// 					discount: discount,
		// 					colors: colors,
		// 					pricePerUser: pricePerUser || 0
		// 				})
		// 				setActive(true)
		// 			}}
		// 			size={30}
		// 			className="text-white"
		// 		/>
		// 		<Flex vertical align="center" className="text-white">
		// 			<p className="text-lg font-[700] leading-6">{name}</p>
		// 			<p className="text-md font-[600] leading-5">{formattedDuration}</p>
		// 			{tariffType === 'COMPANY' && (
		// 				<p className="text-md leading-5">
		// 					{`На ${maxUsers > 10 ? `${10}+` : maxUsers}`} Специалистов
		// 				</p>
		// 			)}
		// 			{!active ? (
		// 				<Flex align="center" gap={10}>
		// 					<GoEyeClosed />
		// 					<p className='text-sm'>Тариф скрыт</p>
		// 				</Flex>
		// 			) : (
		// 				''
		// 			)}
		// 		</Flex>
		// 		<DeleteOutlined
		// 			onClick={() => {
		// 				setDeleteId(id)
		// 				setDeleteModal(true)
		// 			}}
		// 			size={30}
		// 			className="text-white"
		// 		/>
		// 	</Flex>
		// 	<Flex vertical gap={6} className="py-[10px] px-[20px]">
		// 		<p className="text-center text-myadmin font-[600] text-2xl">
		// 			{price}
		// 		</p>
		// 		{features.map((item: any, index: number) => (
		// 			<Flex key={index} align="center" gap={5}>
		// 				<CheckOutlined className="text-[#949393]" size={30} />
		// 				<p className="text-[#949393] w-full ">{item}</p>
		// 			</Flex>
		// 		))}
		// 	</Flex>
		// </div>
		<div
			key={key}
			className="border-[1px] border-[#F2F2F1] border-solid rounded-[28px] overflow-hidden bg-white"
		>
			<Backdrop sx={isLoadingSx} open={isLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<DeleteModal
				active={deleteModal}
				handleClose={() => setDeleteModal(false)}
				handleTrueClick={handleDelete}
				title="Удаление тарифа"
				okText="Удалить"
				okColor
			/>
			<div className="w-full h-[60px] relative overflow-clip">
				{/* Decorative color circles for each plan */}
				{colors?.map((color: string, innerIndex: number) => (
					<div
						key={innerIndex}
						className={`absolute ${classNamesPositions[innerIndex % classNamesPositions.length]} h-16 w-16 rounded-full blur-xl`}
						style={{ backgroundColor: color }}
					></div>
				))}

				<div className="w-full h-full items-center flex justify-between px-4">
					<p className="text-[14px] text-[#101010] font-[600] z-[60]">
						{name || `План ${index + 1}`}
					</p>
					<p className="text-[#D8DADC] text-[55px] absolute right-8 z-[50] mb-[-30px] font-[600]">
						{index + 1}
					</p>
				</div>
			</div>

			<div
				style={{ borderTop: '1px solid #F2F2F1' }}
				className="w-full p-[20px]"
			>
				<p>
					<span className="text-[24px] ">{price} c</span> /{' '}
					<span>{formatDuration(durationInDays || 30)}</span>
				</p>

				<Flex gap={10} className="flex items-star">
					<p className="text-[#4E4E4E80]">
						{calculateRate(price || 0, durationInDays || 30)}
					</p>
					{discount > 0 && (
						<div className="bg-[#FFDEEE] text-myviolet rounded-[10px] px-2">
							{discount || 0} %
						</div>
					)}
				</Flex>

				<Flex
					gap={10}
					align="center"
					justify="space-between"
					className="h-fit mt-[40px]"
				>
					<Button
						onClick={() => {
							setTab(NOORUZ.indexOf(tariffType))
							setEditId(id)
							setEditData({
								name: name,
								description: '',
								price: price || 0,
								durationInDays: durationInDays,
								maxUsers: maxUsers,
								active: active,
								tariffType: tariffType,
								features: features.map((item: any, index: number) => {
									return { name: item, value: index }
								}),
								discount: discount,
								colors: colors,
								pricePerUser: pricePerUser || 0,
							})
							setActive(true)
						}}
						borderRadius="24px"
						backgroundColor="var(--myadmin)"
					>
						Редактировать
					</Button>
					<DeleteOutlined
						onClick={() => {
							setDeleteId(id)
							setDeleteModal(true)
						}}
						size={30}
						className="text-[#D80E0C]"
					/>
				</Flex>
			</div>
		</div>
	)
}
