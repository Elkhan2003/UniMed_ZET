import React from 'react'

interface SlPaginationProps {
	total: number
	page: number
	size: number
	onChange: (newPagination: { page: number; size: number }) => void
}

export const SlPagination: React.FC<SlPaginationProps> = ({
	total,
	page,
	size,
	onChange,
}) => {
	const totalPages = Math.ceil(total / size)

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			onChange({ page: newPage, size })
		}
	}

	const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSize = parseInt(e.target.value)
		onChange({ page: 1, size: newSize })
	}

	const getVisiblePages = () => {
		const delta = 2
		const range = []
		const rangeWithDots = []

		range.push(1)

		for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
			range.push(i)
		}

		if (totalPages > 1) {
			range.push(totalPages)
		}

		const uniqueRange = Array.from(new Set(range)).sort((a, b) => a - b)

		let prev = 0
		for (const current of uniqueRange) {
			if (current - prev > 1) {
				rangeWithDots.push('...')
			}
			rangeWithDots.push(current)
			prev = current
		}

		return rangeWithDots
	}

	const visiblePages = getVisiblePages()

	return (
		<div className="flex items-center justify-between gap-4 p-4">
			<div className="flex items-center gap-2 group">
				<span className="text-sm text-gray-600 transition-colors group-hover:text-gray-800">
					Показать:
				</span>
				<select
					value={size}
					onChange={handleSizeChange}
					className="px-2 py-1 rounded border border-gray-300 text-sm transition-all duration-200 hover:border-gray-400 focus:outline-none"
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
				</select>
			</div>

			<div className="flex items-center gap-1">
				<button
					onClick={() => handlePageChange(page - 1)}
					disabled={page === 1}
					className="px-2 py-1 rounded-full bg-[#E8EAED] transition-all duration-200 hover:scale-105 hover:bg-gray-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#E8EAED]"
				>
					←
				</button>

				{visiblePages.map((pageNum, index) => {
					if (pageNum === '...') {
						return (
							<span
								key={`dots-${index}`}
								className="px-2 py-2 text-gray-400 select-none"
							>
								...
							</span>
						)
					}

					const isActive = pageNum === page
					return (
						<button
							key={pageNum}
							onClick={() => handlePageChange(pageNum as number)}
							className={`
								relative w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold 
								transition-all duration-300 ease-out transform
								${isActive
									? 'bg-[#FF99D4] text-white shadow-lg scale-110 z-10'
									: 'bg-[#E8EAED] text-gray-700 hover:scale-105 hover:bg-gray-300 active:scale-95'
								}
								before:absolute before:inset-0 before:rounded-full before:bg-[#FF99D4] 
								before:opacity-0 before:scale-0 before:transition-all before:duration-300
								${isActive ? 'before:opacity-20 before:scale-125' : 'hover:before:opacity-10 hover:before:scale-125'}
							`}
						>
							<span className="relative z-10">{pageNum}</span>
						</button>
					)
				})}

				<button
					onClick={() => handlePageChange(page + 1)}
					disabled={page === totalPages}
					className="px-2 py-1 rounded-full bg-[#E8EAED] transition-all duration-200 hover:scale-105 hover:bg-gray-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#E8EAED]"
				>
					→
				</button>
			</div>

			<div className="text-sm text-gray-600 animate-fade-in">
				{total > 0 ? (
					<span>
						{((page - 1) * size) + 1}-{Math.min(page * size, total)} из {total}
					</span>
				) : (
					<span>0 записей</span>
				)}
			</div>
		</div>
	)
}
