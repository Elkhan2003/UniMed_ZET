import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Flex } from 'antd'

export const getColumns = (handleDelete: any, handleEdit: any) => {
	return [
		{
			title: 'Картинка',
			dataIndex: 'image',
			key: 'image',
			render: (text: any) => (
				<img
					src={text}
					alt="icon"
					className="w-[55px] h-[55px] object-cover rounded-full"
				/>
			),
		},
		{
			title: 'Адрес',
			dataIndex: 'addresses',
			key: 'addresses',
			render: (addresses: any[]) => {
				return (addresses || [])
					.slice()
					.reverse()
					.map((item) => item?.name?.trim())
					.filter(Boolean)
					.join(', ')
			},
		},
		{
			title: 'Рейтинг',
			dataIndex: 'rating',
			key: 'rating',
			render: (text: number) => text.toFixed(2),
		},
		{
			title: 'Действия',
			dataIndex: 'action',
			key: 'action',
			width: 200,
			fontSize: 20,
			render: (_: any, subRecord: any) => {
				return (
					<Flex gap={10}>
						<div
							onClick={(e) => {
								e.stopPropagation()
								handleEdit(subRecord)
							}}
							className="rounded-[8px] p-1 px-2 bg-gray-100 hover:bg-gray-200 cursor-pointer z-20"
						>
							<EditOutlined />
						</div>
						<div
							onClick={(e) => {
								e.stopPropagation()
								handleDelete(subRecord.id)
							}}
							className="rounded-[8px] p-1 px-2 bg-gray-100 hover:bg-gray-200 cursor-pointer z-20"
						>
							<DeleteOutlined />
						</div>
					</Flex>
				)
			},
		},
	]
}
