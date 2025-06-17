import { NavLink } from 'react-router-dom'
import { HomeOutlined } from '@ant-design/icons'
import { PERSONAL_ROUTES } from '../../../shared/lib/constants/routes' 
import { StyledTable } from '../../../components/UI/StyledTable'
import {
	DeleteOutlined,
	EditOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons'
import { Flex } from 'antd'

export const breadcrumbItems = [
	{
		title: (
			<NavLink to={PERSONAL_ROUTES.SERVICE.path}>
				<HomeOutlined />
			</NavLink>
		),
	},
	{
		title: 'Услуги',
	},
]

export const columns = [
	{
		title: 'Картинка',
		dataIndex: 'icon',
		key: 'icon',
		render: (text: any) => (
			<img
				src={text}
				alt="icon"
				className="w-[55px] h-[55px] object-cover rounded-full"
			/>
		),
	},
	{
		title: 'Название категории',
		dataIndex: 'name',
		key: 'name',
	},
]

export const expandedRowRender = (
	record: any,
	setId: any,
	setCategoryId: any,
	open: any,
	deleteItem: any,
	editItem: any
) => {
	const subCategoryColumns = [
		{
			title: ' ',
			dataIndex: 'action',
			key: 'action',
			width: 30,
			fontSize: 20,
			render: (_: any, subRecord: any) => (
				<PlusCircleOutlined
					onClick={() => {
						setId(subRecord.id)
						setCategoryId(record.id)
						open()
					}}
					className="cursor-pointer"
				/>
			),
		},
		{
			title: 'Название подкатегории',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Услуги',
			key: 'serviceResponses',
			render: (_: any, subCategory: any) => (
				<StyledTable
					dataSource={subCategory.serviceResponses}
					columns={[
						{
							title: 'Название',
							dataIndex: 'name',
							key: 'name',
						},
						{
							title: 'Цена',
							dataIndex: 'price',
							key: 'price',
							render: (price) => `${price} сом`,
						},
						{
							title: 'Длительность (мин)',
							dataIndex: 'duration',
							key: 'duration',
						},
						{
							title: 'Описание',
							dataIndex: 'description',
							key: 'description',
						},
						{
							title: 'Действие',
							dataIndex: 'action',
							key: 'action',
							width: 60,
							align: 'center',
							render: (_, record: any) => {
								return (
									<Flex justify="space-between">
										<EditOutlined
											onClick={() => editItem(record)}
											className="hover:cursor-pointer"
										/>
										<DeleteOutlined
											onClick={() => {
												deleteItem(record.id)
											}}
											className="hover:cursor-pointer"
										/>
									</Flex>
								)
							},
						},
					]}
					pagination={false}
				/>
			),
		},
	]
	return (
		<StyledTable
			columns={subCategoryColumns}
			dataSource={record.subCategoryServices}
			pagination={false}
		/>
	)
}
