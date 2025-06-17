import { useState, useEffect, useRef, ReactNode } from 'react'

interface SlScrollShadowProps {
	children: ReactNode
	className?: string
	shadowThreshold?: number
	topShadowStyle?: React.CSSProperties
	bottomShadowStyle?: React.CSSProperties
	topShadowClassName?: string
	bottomShadowClassName?: string
	innerClassName?: string
}

export const SlScrollShadow = ({
	children,
	className = '',
	shadowThreshold = 20,
	topShadowStyle,
	bottomShadowStyle,
	topShadowClassName = '',
	bottomShadowClassName = '',
	innerClassName = '',
}: SlScrollShadowProps) => {
	const [showTopShadow, setShowTopShadow] = useState(false)
	const [showBottomShadow, setShowBottomShadow] = useState(false)
	const scrollRef = useRef<HTMLDivElement>(null)

	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const target = e.currentTarget
		const scrollPosition = target.scrollTop

		setShowTopShadow(scrollPosition > shadowThreshold)

		const isNearBottom =
			target.scrollHeight - target.scrollTop - target.clientHeight <
			shadowThreshold
		setShowBottomShadow(
			!isNearBottom && target.scrollHeight > target.clientHeight
		)
	}

	useEffect(() => {
		if (scrollRef.current) {
			const target = scrollRef.current
			setShowBottomShadow(
				target.scrollHeight > target.clientHeight &&
					target.scrollHeight - target.scrollTop - target.clientHeight >=
						shadowThreshold
			)
		}
	}, [shadowThreshold])

	const defaultTopShadowStyle: React.CSSProperties = {
		background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)',
		...topShadowStyle,
	}

	const defaultBottomShadowStyle: React.CSSProperties = {
		background: 'linear-gradient(to top, rgba(0,0,0,0.1), transparent)',
		...bottomShadowStyle,
	}

	return (
		<div className={`relative w-full h-full ${className}`}>
			{showTopShadow && (
				<div
					className={`absolute top-0 left-0 right-0 h-[10px] z-10 pointer-events-none transition-opacity duration-300 ${topShadowClassName}`}
					style={defaultTopShadowStyle}
				/>
			)}

			<div
				ref={scrollRef}
				className={`w-full h-full overflow-y-auto ${innerClassName}`}
				onScroll={handleScroll}
			>
				{children}
			</div>

			{showBottomShadow && (
				<div
					className={`absolute bottom-0 left-0 right-0 h-[10px] z-10 pointer-events-none transition-opacity duration-300 ${bottomShadowClassName}`}
					style={defaultBottomShadowStyle}
				/>
			)}
		</div>
	)
}
