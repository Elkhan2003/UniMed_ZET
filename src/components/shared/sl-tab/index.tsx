import React, { useRef, useEffect, useState } from 'react'
import clsx from 'clsx'

type Tab = {
	id: string | number
	label: string
	value: string
}

type SlTabsProps = {
	tabs: Tab[]
	active: string | number
	onChange: (id: string | number) => void
	className?: string
	searchParams: URLSearchParams
	setSearchParams: (params: URLSearchParams) => void
}

const SlTabs: React.FC<SlTabsProps> = ({
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
				'w-full relative flex justify-between h-[50px] bg-transparent',
				className
			)}
		>
			{tabs.map(({ id, label, value }, index) => (
				<div
					key={id}
					ref={(el) => (tabsRef.current[index] = el)}
					className="w-full sm:px-10 xs:px-4 cursor-pointer flex h-[50px] items-center justify-center transition-colors duration-300"
					onClick={() => {
						onChange(id)
						searchParams.set('tab', value)
						setSearchParams(searchParams)
					}}
				>
					<span className="text-[#101010] text-[14px] font-[500] whitespace-nowrap">
						{label}
					</span>
				</div>
			))}

			<div
				className="absolute bottom-[0px] h-[2px] rounded transition-all duration-300 ease-in-out"
				style={{
					left: indicatorStyle.left,
					width: indicatorStyle.width,
					backgroundColor: '#FF4BAF',
					transform: 'translateY(50%)',
				}}
			/>
		</div>
	)
}

export default SlTabs
