import React, { useState } from 'react'
import Loading from '../../../pages/loading'
import { GoInbox } from 'react-icons/go'
import { SlPagination } from '../sl-pagination'
import Checkbox from '../../UI/Checkbox'

interface Pagination {
	total: number
	page: number
	size: number
	onChange: (newPagination: { page: number; size: number }) => void
}

type Column = {
	title: string
	dataIndex: string
	render?: (value: any, record: any, index: number) => React.ReactNode
	width?: number
}

type RowSelection = {
	selectedRowKeys: React.Key[]
	onChange: (selectedKeys: React.Key[], selectedRows: any[]) => void
}

type SlTableProps = {
	columns: Column[]
	dataSource: Record<string, any>[]
	loading?: boolean
	expandedRowRender?: (record: any) => React.ReactNode
	pagination?: Pagination
	onRow?: {
		onClick?: (record: any) => void
		onDoubleClick?: (record: any) => void
	}
	rowSelection?: RowSelection
}

export const SlTable: React.FC<SlTableProps> = ({
	columns,
	dataSource,
	loading,
	expandedRowRender,
	pagination,
	onRow,
	rowSelection,
}) => {
	const [expandedRow, setExpandedRow] = useState<Set<number>>(new Set())

	const toggleRow = (index: number) => {
		const newSet = new Set(expandedRow)
		if (newSet.has(index)) {
			newSet.delete(index)
		} else {
			newSet.add(index)
		}
		setExpandedRow(newSet)
	}

	const getGridTemplateColumns = () => {
		const selectionColumn = rowSelection ? '40px ' : ''
		const columnWidths = columns
			.map((column) => (column.width ? `${column.width}px` : '1fr'))
			.join(' ')
		return selectionColumn + columnWidths
	}

	const renderPagination = ({ total, page, size }: Pagination) => (
		<div className="w-full max-w-full overflow-x-auto flex items-center justify-end">
			<SlPagination
				total={total}
				page={page}
				size={size}
				onChange={pagination?.onChange ?? (() => {})}
			/>
		</div>
	)

	const renderHeader = () => (
		<div
			style={{
				gridTemplateColumns: getGridTemplateColumns(),
				borderBottom: '1px solid #F2F2F1',
			}}
			className="grid bg-[#F9F9F9] text-[14px] font-medium border-b border-[#F2F2F1] rounded-t-[16px]"
		>
			{rowSelection && (
				<div className="px-4 flex items-center">
					<Checkbox
						checked={
							dataSource.length > 0 &&
							rowSelection.selectedRowKeys.length === dataSource.length
						}
						setChecked={(e) => {
							if (e) {
								rowSelection.onChange(
									dataSource.map((idx) => idx.id),
									dataSource
								)
							} else {
								rowSelection.onChange([], [])
							}
						}}
					/>
				</div>
			)}
			{columns.map((column, index) => (
				<div
					key={index}
					className="px-4 flex items-center max-h-[62px] min-h-[62px] border-r last:border-r-0 border-[#F2F2F1]"
				>
					{column.title}
				</div>
			))}
		</div>
	)

	const renderRows = () =>
		dataSource.map((record, rowIndex) => {
			const isExpanded = expandedRow.has(rowIndex)
			const isChecked = rowSelection?.selectedRowKeys.includes(record.id)

			return (
				<React.Fragment key={rowIndex}>
					<div
						onClick={() =>
							(expandedRowRender && toggleRow(rowIndex)) ||
							(onRow?.onClick && onRow.onClick(record))
						}
						onDoubleClick={() =>
							onRow?.onDoubleClick && onRow.onDoubleClick(record)
						}
						style={{
							gridTemplateColumns: getGridTemplateColumns(),
							cursor:
								expandedRowRender || onRow?.onClick || onRow?.onDoubleClick
									? 'pointer'
									: 'default',
						}}
						className={`grid text-[14px] relative ${
							expandedRowRender || onRow?.onClick || onRow?.onDoubleClick
								? 'hover:bg-[#F9F9F9] transition-all duration-300'
								: ''
						}`}
					>
						{rowSelection && (
							<div
								style={{
									borderBottom: !isExpanded ? '1px solid #F2F2F1' : 'none',
								}}
								className="px-4 py-4 flex items-center"
							>
								<Checkbox
									checked={Boolean(isChecked)}
									setChecked={(e) => {
										const newKeys = e
											? [...rowSelection.selectedRowKeys, record.id]
											: rowSelection.selectedRowKeys.filter(
													(key) => key !== record.id
												)
										rowSelection.onChange(
											newKeys,
											newKeys.map((key) => dataSource[Number(key)])
										)
									}}
								/>
							</div>
						)}
						{columns.map((column, colIndex) => (
							<div
								key={colIndex}
								style={{
									borderBottom: !isExpanded ? '1px solid #F2F2F1' : 'none',
								}}
								className="px-4 py-4 border-r last:border-r-0 border-[#F2F2F1] flex items-center"
							>
								{column.render
									? column.render(record[column.dataIndex], record, rowIndex)
									: record[column.dataIndex]}
							</div>
						))}
					</div>
					{isExpanded && expandedRowRender && (
						<div
							style={{
								borderBottom: '1px solid #F2F2F1',
							}}
							className="w-full bg-[#fbfafa] text-[14px]"
						>
							{expandedRowRender(record)}
						</div>
					)}
				</React.Fragment>
			)
		})

	return (
		<div
			className="w-full h-fit bg-white rounded-[16px] overflow-y-auto"
			style={{
				border: '1px solid #F2F2F1',
				boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
				backdropFilter: 'blur(100px)',
				minHeight: '350px',
			}}
		>
			{renderHeader()}

			{loading ? (
				<div className="flex items-center justify-center h-[250px]">
					<Loading />
				</div>
			) : dataSource.length === 0 ? (
				<div className="flex items-center justify-center h-[250px]">
					<div className="flex items-center justify-center flex-col gap-[10px]">
						<GoInbox className="text-[#808080] text-[30px]" />
						<p className="text-[14px] text-[#808080]">Нет данных</p>
					</div>
				</div>
			) : (
				renderRows()
			)}

			{pagination && renderPagination(pagination)}
		</div>
	)
}
