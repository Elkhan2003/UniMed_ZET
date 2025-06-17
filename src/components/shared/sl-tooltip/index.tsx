import React, { ReactNode } from 'react'

type SlTooltipProps = {
	children: ReactNode
	content: ReactNode
	position?: 'top' | 'bottom' | 'left' | 'right'
	className?: string
	classNameContent?: string
	classNameArrow?: string
}

export const SLTooltip: React.FC<SlTooltipProps> = ({
	children,
	content,
	position = 'top',
	className,
	classNameContent,
	classNameArrow,
}) => {
	const getPositionClasses = () => {
		switch (position) {
			case 'top':
				return {
					tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-3',
					arrow: ' bottom-full left-1/2 -translate-x-1/2 mb-3',
					arrowStyle: {
						width: 0,
						height: 0,
						borderLeft: '6px solid transparent',
						borderRight: '6px solid transparent',
						borderTop: '6px solid #FFDEEE',
					} as React.CSSProperties,
				}
			case 'bottom':
				return {
					tooltip: 'top-full left-1/2 -translate-x-1/2 mt-3',
					arrow: 'top-full left-1/2 -translate-x-1/2 mt-3',
					arrowStyle: {
						width: 0,
						height: 0,
						borderLeft: '6px solid transparent',
						borderRight: '6px solid transparent',
						borderTop: '6px solid #FFDEEE',
					} as React.CSSProperties,
				}
			case 'left':
				return {
					tooltip: 'right-full top-1/2 -translate-y-1/2 mr-3',
					arrow: 'right-full top-1/2 -translate-y-1/2 mr-3',
					arrowStyle: {
						width: 0,
						height: 0,
						borderLeft: '6px solid transparent',
						borderRight: '6px solid transparent',
						borderTop: '6px solid #FFDEEE',
					} as React.CSSProperties,
				}
			case 'right':
				return {
					tooltip: 'left-full top-1/2 -translate-y-1/2 ml-3',
					arrow: 'left-[-6px] top-1/2 -translate-y-1/2',
					arrowStyle: {
						width: 0,
						height: 0,
						borderTop: '6px solid transparent',
						borderBottom: '6px solid transparent',
						borderRight: '6px solid #FFDEEE',
					} as React.CSSProperties,
				}
			default:
				return { tooltip: '', arrow: '', arrowStyle: {} }
		}
	}

	const { tooltip, arrow, arrowStyle } = getPositionClasses()

	return (
		<div className={`relative group inline-block ${className}`}>
			{children}
			<div
				className={`absolute ${tooltip} hidden group-hover:flex flex-col items-center z-50`}
			>
				<div
					className={`bg-[#FFDEEE] text-[#FF4BAF] text-[14px] rounded pt-[4px] pb-[6px] px-2 shadow-md ${classNameContent}`}
				>
					{content}
				</div>
				<div
					className={`absolute ${arrow} ${classNameArrow}`}
					style={arrowStyle}
				/>
			</div>
		</div>
	)
}
