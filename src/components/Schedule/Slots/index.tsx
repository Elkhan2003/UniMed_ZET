import { Flex } from 'antd'
import {
	useGetSlotsQuery,
	useDeleteSlotsMutation,
} from '../../../store/queries/schedule.service'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { DeleteModal } from '../../UI/Modal/DeleteModal/DeleteModal'
import toast from 'react-hot-toast'

interface SlotsProps {
	entityId: number
	entityType: string
	setSlots: any
	setModal: any
}

export const Slots = ({
	entityId,
	entityType,
	setSlots,
	setModal,
}: SlotsProps) => {
	const { data = [], refetch } = useGetSlotsQuery({
		entityId: entityId,
		entityType: entityType,
	})

	const [deleteSlot] = useDeleteSlotsMutation()

	const [deleteId, setDeleteId] = useState(0)
	const [deleteModal, setDeleteModal] = useState(false)

	const handleDelete = async () => {
		try {
			const response = await deleteSlot(deleteId).unwrap()
			if (response === null) {
				toast.success('Слот успешно удален!')
			} else {
				toast.error(response?.data?.message || 'Произошла ошибка!')
			}
		} catch (error: any) {
			toast.error(error?.data?.message || 'Произошла ошибка!')
		} finally {
			setDeleteModal(false)
			refetch()
		}
	}

	return (
		<Flex vertical gap={5}>
			<DeleteModal
				active={deleteModal}
				title="Удаление слота"
				handleClose={() => setDeleteModal(false)}
				handleTrueClick={handleDelete}
				okText="Удалить"
			/>
			{data?.length > 0 && (
				<p className="text-[16px] leading-4">График работы по слотам:</p>
			)}
			{data?.length > 0 && (
				<div className="flex flex-col gap-[7px] max-h-[350px] py-2 overflow-y-auto">
					{data.map((item: any, index: number) => (
						<Flex
							key={index}
							align="center"
							justify="space-between"
							className="rounded-[16px] py-[7px] px-[15px] min-w-[250px] bg-[#F2F2F1] text-black"
						>
							<p className="text-[14px]">
								{item.startDate} - {item.endDate}
							</p>
							<Flex gap={5}>
								<EditOutlined
									onClick={() => {
										setSlots(item)
										setModal(true)
									}}
								/>
								<DeleteOutlined
									onClick={() => {
										setDeleteId(item.id)
										setDeleteModal(true)
									}}
									className="text-[#FF5E5E]"
								/>
							</Flex>
						</Flex>
					))}
				</div>
			)}
		</Flex>
	)
}
