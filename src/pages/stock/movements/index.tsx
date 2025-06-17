import { useNavigate, useParams } from 'react-router-dom'
import { useGetInventoryOperationsById } from '../../../shared/queries/inventory.queries'
import { SlBreadcrumbs } from '../../../components/shared/sl-breadcrumbs'
import { ownerLinks } from '../../../shared/links'

import { MdKeyboardBackspace } from 'react-icons/md'
import dayjs from 'dayjs'
import { SlTable } from '../../../components/shared/sl-table'
import { getRussianUnitName } from '../../../shared/lib/helpers/helpers'

const columns = [
	{
		title: '№',
		dataIndex: 'action',
		render: (value: any, record: any, index: number) => index + 1,
		width: 40,
	},
	{
		title: 'Товар',
		dataIndex: 'name',
		render: (_: any, record: any) => (
			<div className="flex items-center gap-[10px]">
				<img
					src={record.image}
					alt={record.name}
					className="w-[40px] h-[40px] rounded-[10px] object-cover bg-gray-200"
				/>
				<div>
					<p className="text-[14px]">{record.name}</p>
					<p className="text-[#4E4E4E80] text-[14px]">{record.category}</p>
				</div>
			</div>
		),
	},
	{
		title: 'Ед. измерения',
		dataIndex: 'packagingUnitType',
		render: (value: string) => getRussianUnitName(value),
	},
	{
		title: 'Кол-во',
		dataIndex: 'quantity',
	},
	{
		title: 'Сумма',
		dataIndex: 'totalCost',
		render: (value: string) => `${value} c`,
	},
	{
		title: 'Цена продажи',
		dataIndex: 'sellingPrice',
		render: (value: any) => `${value} c`,
	},
]

export const Movements = () => {
	const navigate = useNavigate()
	const { id } = useParams()
	const { data, isLoading } = useGetInventoryOperationsById(Number(id))
	return (
		<div className="w-full h-[calc(100vh-90px)]">
			<SlBreadcrumbs
				items={[
					{
						label: 'Склад',
						href: ownerLinks.stock,
					},
					{
						label: 'История поступлений',
						href: ownerLinks.stock,
					},
					{
						label: data?.operationType,
					},
				]}
			/>
			<div className="w-full h-full p-[15px]">
				<div className="bg-white rounded-[24px] p-[20px]">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-[10px]">
							<MdKeyboardBackspace
								onClick={() => navigate('/stock')}
								size={24}
                                className='cursor-pointer'
							/>
							<div className="w-full">
								<p className="text-[16px] font-[600]">
									{data?.operationType},{' '}
									{dayjs(data?.createdAt).format('DD.MM.YYYY HH:mm')}
								</p>
								<p className="text-[#4E4E4E80] text-[14px]">
									найдено: {data?.productMovements?.length}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-[10px]"></div>
					</div>
					<SlTable
						columns={columns}
						dataSource={data?.productMovements || []}
						loading={isLoading}
					/>
				</div>
			</div>
		</div>
	)
}
