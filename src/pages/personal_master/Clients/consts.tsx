import { DeleteOutlined, EditOutlined, RightOutlined } from '@ant-design/icons'
import { Flex } from 'antd'
import { GENDER_CONVERT } from '../../../shared/lib/constants/constants'

export const getColumnsClient = (
	handleDelete: (id: number) => void,
	handleEdit: (record: any) => void,
	page: number,
	size: number,
	setInnerData: (bol: any) => void,
	setUserId: any,
	setRegistered: any,
	setOpen: any
) => {
	return [
		{
			title: '№',
			dataIndex: 'index',
			key: 'index',
			width: 30,
			render: (_: any, __: any, index: number) => (
				<p>{index + 1 + (page - 1) * size}</p>
			),
		},
		{
			title: 'Картинка',
			dataIndex: 'avatar',
			key: 'avatar',
			render: (avatar: any) => (
				<img
					src={avatar}
					alt="icon"
					className="w-[40px] h-[40px] object-cover rounded-full"
				/>
			),
		},
		{
			title: 'ФИО',
			dataIndex: 'row',
			key: 'row',
			render: (_: any, sub: any) => {
				return (
					<div>
						<p>{sub.firstName || '-'}</p>
						<p>{sub.lastName || '-'}</p>
					</div>
				)
			},
		},
		{
			title: 'Номер телефона',
			dataIndex: 'phoneNumber',
			key: 'phoneNumber',
			render: (phoneNumber: number) => <p>{phoneNumber || '-'}</p>,
		},
		{
			title: 'Визиты',
			dataIndex: 'row',
			key: 'row',
			render: (_: any, sub: any) => (
				<p>{sub.clientStatistics?.totalVisits || '0'}</p>
			),
		},
		{
			title: 'Бонусы',
			dataIndex: 'row',
			key: 'row',
			render: (_: any, sub: any) => (
				<p>{sub.clientStatistics?.bonuses || '0'}</p>
			),
		},
		{
			title: 'Скидка',
			dataIndex: 'row',
			key: 'row',
			render: (_: any, sub: any) => (
				<p>{sub.clientStatistics?.discount || '0'}%</p>
			),
		},
		{
			title: 'Действие',
			key: 'actions',
			render: (_: any, record: any) => (
				<Flex gap={10}>
					<div
						onClick={(e) => {
							e.stopPropagation()
							handleEdit(record)
						}}
						className="rounded-[8px] p-1 px-2 bg-gray-100 hover:bg-gray-200 cursor-pointer z-20"
					>
						<EditOutlined />
					</div>
					{record.isUnregistered && (
						<div
							onClick={(e) => {
								e.stopPropagation()
								handleDelete(record.id)
							}}
							className="rounded-[8px] p-1 px-2 bg-gray-100 hover:bg-gray-200 cursor-pointer z-20"
						>
							<DeleteOutlined />
						</div>
					)}
					<div
						onClick={(e) => {
							e.stopPropagation()
							setRegistered(record.isUnregistered)
							setUserId(record.id)
							setInnerData(record)
							setOpen(true)
						}}
						className="rounded-[8px] p-1 px-2 bg-gray-100 hover:bg-gray-200 cursor-pointer z-20"
					>
						<RightOutlined />
					</div>
				</Flex>
			),
		},
	]
}
