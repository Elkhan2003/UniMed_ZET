import { Key, useCallback, useEffect, useState } from 'react'
import {
	useArchiveProduct,
	useGetProductsByBranchSecondary,
	useUnArchiveProduct,
} from '../../../shared/queries/inventory.queries'
import { SlDropdown } from '../../../components/shared/sl-dropdown'
import { MdKeyboardArrowDown } from 'react-icons/md'

import { ReactComponent as SortIcon } from '../../../assets/icons/usage/sort.svg'
import { SlTable } from '../../../components/shared/sl-table'
import {
	convertProductStatus,
	getRussianUnitName,
} from '../../../shared/lib/helpers/helpers'
import { useOwnerStore } from '../../../shared/states/owner.store'

interface IStockProducts {
	search: string
	branchId: number
	station: 'stock' | 'archive' | 'history'
}

const columns = [
	{
		title: 'Название',
		dataIndex: 'name',
		render: (_: any, record: any) => (
			<div className="flex items-center gap-[10px]">
				<img
					src={record.image}
					alt={record.name}
					className="w-[40px] h-[40px] rounded-[10px] object-cover bg-gray-200"
				/>
				<div>
					<p className="text-[16px] font-[600]">{record.name}</p>
					<p className="text-[#4E4E4E80] text-[14px]">{record.category}</p>
				</div>
			</div>
		),
	},
	{
		title: 'Артикул',
		dataIndex: 'articleNumber',
		width: 130,
	},
	{
		title: 'Цена продажи',
		dataIndex: 'sellingPrice',
		width: 130,
	},
	{
		title: 'Остаток',
		dataIndex: 'stockQuantity',
		render: (stockQuantity: number, record: any) =>
			`${stockQuantity} ${getRussianUnitName(record.measureUnitType)}`,
		width: 160,
	},
	{
		title: 'Статус',
		dataIndex: 'status',
		render: (status: string) => convertProductStatus(status),
		width: 140,
	},
]

export const StockProducts = ({
	search,
	branchId,
	station,
}: IStockProducts) => {
	const setStoreArhiveProducts = useOwnerStore(
		(state: any) => state.setStoreArhiveProducts
	)
	const [pagination, setPagination] = useState({
		page: 1,
		size: 10,
	})
	const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
	const [sort, setSort] = useState<string>('createdAt,desc')
	const [status, setStatus] = useState<string[]>([])

	useEffect(() => {
		setStatus(station === 'stock' ? ['ACTIVE', 'OUT_OF_STOCK'] : ['ARCHIVED'])
	}, [station])

	const {
		data: products,
		isPending: isLoading,
		refetch,
	} = useGetProductsByBranchSecondary({
		branchId: branchId,
		categoryId: '',
		status: status,
		search: search,
		page: pagination.page,
		size: pagination.size,
		sort: [sort],
	})

	const { mutate: archiveProducts } = useArchiveProduct()
	const { mutate: unarchiveProducts } = useUnArchiveProduct()

	const handleArchiveProducts = useCallback(() => {
		if (station === 'stock') {
			archiveProducts(selectedRowKeys as number[], {
				onSuccess: () => refetch(),
			})
		} else if (station === 'archive') {
			unarchiveProducts(selectedRowKeys as number[], {
				onSuccess: () => refetch(),
			})
		}

		setSelectedRowKeys([])
	}, [selectedRowKeys])

	useEffect(() => {
		setStoreArhiveProducts(handleArchiveProducts)
	}, [handleArchiveProducts])

	return (
		<div className="w-[75%] h-fit overflow-y-auto bg-white rounded-[24px] p-[20px]">
			<div className="flex items-center justify-between mb-2">
				<div>
					<p className="text-[16px] font-[600]">
						{station === 'stock' ? 'Товары на складе' : 'Архив товаров '}
					</p>
					<p className="text-[#4E4E4E80] text-[14px]">
						найдено: {products?.content?.length ?? 0}
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
					<SlDropdown
						items={
							station === 'stock'
								? [
										{
											key: 'active',
											label: 'Активные',
											selected: status.includes('ACTIVE'),
											onClick: () =>
												setStatus((prev) => {
													if (prev.includes('ACTIVE')) {
														return prev.length > 1
															? prev.filter((s) => s !== 'ACTIVE')
															: prev
													} else {
														return [...prev, 'ACTIVE']
													}
												}),
										},
										{
											key: 'out-stock',
											label: 'Не осталось',
											selected: status.includes('OUT_OF_STOCK'),
											onClick: () =>
												setStatus((prev) => {
													if (prev.includes('OUT_OF_STOCK')) {
														return prev.length > 1
															? prev.filter((s) => s !== 'OUT_OF_STOCK')
															: prev
													} else {
														return [...prev, 'OUT_OF_STOCK']
													}
												}),
										},
									]
								: [
										{
											key: 'ARCHIVED',
											label: 'В архиве',
											selected: status.includes('ARCHIVED'),
											onClick: () =>
												setStatus((prev) => {
													if (prev.includes('ARCHIVED')) {
														return prev.length > 1
															? prev.filter((s) => s !== 'ARCHIVED')
															: prev
													} else {
														return [...prev, 'ARCHIVED']
													}
												}),
										},
									]
						}
						closeOnClick={false}
						overlayClassName="w-[105px]"
					>
						<div className="border-[1px] border-[#D8DADC] border-solid py-[6px] px-[10px] rounded-[16px] flex items-center gap-[5px]">
							<p className="text-[14px]">Фильтр</p>
							<MdKeyboardArrowDown />
						</div>
					</SlDropdown>
				</div>
			</div>
			<SlTable
				columns={columns}
				dataSource={products?.content || []}
				loading={isLoading}
				pagination={{
					total: products?.totalElements,
					page: products?.number + 1,
					size: products?.size,
					onChange: (newPagination: { page: number; size: number }) => {
						setPagination({
							page: newPagination.page,
							size: newPagination.size,
						})
					},
				}}
				rowSelection={{
					selectedRowKeys: selectedRowKeys,
					onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
				}}
			/>
		</div>
	)
}
