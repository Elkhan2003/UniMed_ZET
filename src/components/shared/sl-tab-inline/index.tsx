import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'

type Tab = {
	id: string | number
	label: string
	value: string
}

type SlTabsInlineProps = {
	tabs: Tab[]
	active: string | number
	onChange: (id: string | number) => void
	className?: string
	searchParams: URLSearchParams
	setSearchParams: (params: URLSearchParams) => void
}

const SlTabsInline: React.FC<SlTabsInlineProps> = ({
	tabs,
	active,
	onChange,
	className = '',
	searchParams,
	setSearchParams,
}) => {
	const tabsRef = useRef<(HTMLDivElement | null)[]>([])
	const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

	useEffect(() => {
		const index = tabs.findIndex((t) => t.id === active)
		const currentTab = tabsRef.current[index]
		if (currentTab) {
			setIndicatorStyle({
				left: currentTab.offsetLeft,
				width: currentTab.offsetWidth,
			})
		}
	}, [active, tabs])

	return (
		<div
			className={clsx(
				'relative w-full flex h-[42px] bg-white rounded-[24px] overflow-hidden',
				className
			)}
		>
			<div
				className="absolute bottom-[4px] h-[calc(100%-8px)] rounded-[24px] bg-[#FF84C4] transition-all duration-300 ease-in-out z-0"
				style={{
					left: indicatorStyle.left + 4,
					width: indicatorStyle.width - 8,
				}}
			/>

			{tabs.map(({ id, label, value }, index) => {
				const isActive = id === active
				return (
					<div
						key={id}
						ref={(el) => (tabsRef.current[index] = el)}
						className={clsx(
							'w-full sm:px-10 xs:px-4 cursor-pointer flex items-center justify-center relative z-10',
							'transition-colors duration-300',
							isActive ? 'text-white font-medium' : 'text-gray-400'
						)}
						onClick={() => {
							onChange(id)
							searchParams.set('tabInline', value)
							setSearchParams(searchParams)
						}}
					>
						<span className="text-[15px] font-[400] whitespace-nowrap">
							{label}
						</span>
					</div>
				)
			})}
		</div>
	)
}

export default SlTabsInline
