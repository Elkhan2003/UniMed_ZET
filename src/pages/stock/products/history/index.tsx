import { useState } from 'react'
import { useGetInventoryOperations } from '../../../../shared/queries/inventory.queries'
import { SlDropdown } from '../../../../components/shared/sl-dropdown'

import { ReactComponent as SortIcon } from '../../../../assets/icons/usage/sort.svg'
import { SlTable } from '../../../../components/shared/sl-table'
import dayjs from 'dayjs'
import { ownerLinks } from '../../../../shared/links'
import { useNavigate } from 'react-router-dom'

interface IHistoryProducts {
	search: string
	branchId: number
	station: 'stock' | 'archive' | 'history'
}

function translateActionTypeToRussian(type: string): string {
	switch (type) {
		case 'DELIVERY':
			return 'Поставка'
		case 'ADDITIONAL_CONSUMPTION':
			return 'Дополнительное потребление'
		case 'PLANNED_CONSUMPTION':
			return 'Плановое потребление'
		case 'WRITE_OFF':
			return 'Списание'
		default:
			return 'Неизвестный тип'
	}
}

const columns = [
	{
		title: 'Дата',
		dataIndex: 'createdAt',
		render: (value: string | Date) => dayjs(value).format('YYYY.MM.DD'),
	},
	{
		title: 'Поставщик',
		dataIndex: 'operationType',
		render: (value: string) => translateActionTypeToRussian(value),
	},
	{
		title: 'Кол-во',
		dataIndex: 'productMovements',
		render: (value: any[]) => value?.length || 0,
	},
	{
		title: 'Общая сумма',
		dataIndex: 'totalCost',
		render: (value: any) => `${value} c`,
	},
]

export const HistoryProducts = ({
	search,
	branchId,
	station,
}: IHistoryProducts) => {
	const navigate = useNavigate()
	const [pagination, setPagination] = useState({
		page: 1,
		size: 10,
	})
	const [sort, setSort] = useState<string>('createdAt,desc')

	const { data: operations, isPending: isLoading } = useGetInventoryOperations({
		branchId: branchId,
		page: pagination.page,
		size: pagination.size,
		startDate: '2024-12-12',
		endDate: '2025-12-12',
		sort: [],
		search: search,
	})

	return (
		<div className="w-full h-fit overflow-y-auto bg-white rounded-[24px] p-[20px]">
			<div className="flex items-center justify-between mb-2">
				<div>
					<p className="text-[16px] font-[600]">История поступления товаров</p>
					<p className="text-[#4E4E4E80] text-[14px]">
						найдено: {operations?.content?.length ?? 0}
					</p>
				</div>
				<div className="flex items-center gap-[10px]">
					<SlDropdown
						items={[
							{
								key: 'new',
								label: 'Сначала новые',
								selected: sort === 'createdAt,desc',
								onClick: () => setSort('createdAt,desc'),
							},
							{
								key: 'old',
								label: 'Cначала старые',
								selected: sort === 'createdAt,asc',
								onClick: () => setSort('createdAt,asc'),
							},
							{
								key: '12',
								label: 'По алфавиту a-я',
								selected: sort === 'name,asc',
								onClick: () => setSort('name,asc'),
							},
							{
								key: '21',
								label: 'По алфавиту я-а',
								selected: sort === 'name,desc',
								onClick: () => setSort('name,desc'),
							},
						]}
						overlayClassName="w-[130px]"
					>
						<div className="border-[1px] border-[#D8DADC] border-solid py-[6px] px-[10px] rounded-[16px] flex items-center gap-[5px]">
							<SortIcon />
							<p className="text-[14px]">Сортировать</p>
						</div>
					</SlDropdown>
				</div>
			</div>
			<SlTable
				columns={columns}
				dataSource={operations?.content || []}
				loading={isLoading}
				pagination={{
					total: operations?.totalElements,
					page: operations?.number + 1,
					size: operations?.size,
					onChange: (newPagination: { page: number; size: number }) => {
						setPagination({
							page: newPagination.page,
							size: newPagination.size,
						})
					},
				}}
				onRow={{
					onClick: (record) =>
						navigate(
							ownerLinks.stock_history_product_movement.replace(
								':id',
								record.id
							)
						),
				}}
			/>
		</div>
	)
}
