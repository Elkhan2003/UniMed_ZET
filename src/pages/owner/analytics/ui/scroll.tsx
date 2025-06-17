import React, { useRef, useEffect, useState } from 'react'
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from 'react-icons/md'

interface CustomScrollProps {
	children: React.ReactNode
	width?: string
	height?: string
	className?: string
	scrollStep?: number // Amount to scroll with each button click
}

export const CustomScroll = ({
	children,
	width = '100%',
	className = '',
	scrollStep = 150, // Default scroll step
}: CustomScrollProps) => {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(false)
	const [isScrollingLeft, setIsScrollingLeft] = useState(false)
	const [isScrollingRight, setIsScrollingRight] = useState(false)
	const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

	// Update the horizontal scrollbar thumb position and button states
	const updateScrollState = () => {
		const scrollContainer = scrollContainerRef.current
		if (!scrollContainer) return

		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer
		const thumb: any = scrollContainer.querySelector(
			'.custom-scrollbar-thumb-horizontal'
		)

		// Update thumb position
		const scrollRatio = clientWidth / scrollWidth
		const thumbWidth = Math.max(clientWidth * scrollRatio, 30)
		const thumbLeft = scrollLeft * (clientWidth / scrollWidth)

		if (thumb) {
			thumb.style.width = `${thumbWidth}px`
			thumb.style.transform = `translateX(${thumbLeft}px)`
		}

		// Update scroll button states
		setCanScrollLeft(scrollLeft > 0)
		setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
	}

	useEffect(() => {
		const scrollContainer = scrollContainerRef.current
		if (!scrollContainer) return

		scrollContainer.addEventListener('scroll', updateScrollState)
		window.addEventListener('resize', updateScrollState)

		// Initial update
		updateScrollState()

		return () => {
			scrollContainer.removeEventListener('scroll', updateScrollState)
			window.removeEventListener('resize', updateScrollState)
		}
	}, [])

	const startContinuousScroll = (direction: 'left' | 'right') => {
		if (direction === 'left') {
			setIsScrollingLeft(true)
		} else {
			setIsScrollingRight(true)
		}

		if (scrollIntervalRef.current) {
			clearInterval(scrollIntervalRef.current)
		}

		scrollIntervalRef.current = setInterval(() => {
			const scrollContainer = scrollContainerRef.current
			if (!scrollContainer) return

			const scrollAmount =
				direction === 'left' ? -scrollStep / 5 : scrollStep / 5
			scrollContainer.scrollLeft += scrollAmount
			updateScrollState()
		}, 20)
	}

	const stopContinuousScroll = () => {
		setIsScrollingLeft(false)
		setIsScrollingRight(false)

		if (scrollIntervalRef.current) {
			clearInterval(scrollIntervalRef.current)
			scrollIntervalRef.current = null
		}
	}

	return (
		<div
			className={`${className}`}
			style={{
				position: 'relative',
				width,
				height: 'fit-content',
				paddingTop: 60,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 10,
					right: 10,
					display: 'flex',
					gap: '8px',
					zIndex: 5,
				}}
			>
				<button
					className={`scroll-button ${isScrollingLeft ? 'active' : ''} ${!canScrollLeft ? 'disabled' : ''} bg-[#E8EAED] w-10 h-10 rounded-full flex justify-center items-center`}
					onMouseDown={() => startContinuousScroll('left')}
					onMouseUp={stopContinuousScroll}
					onMouseLeave={stopContinuousScroll}
				>
					<MdKeyboardArrowLeft size={20} />
				</button>
				<button
					className={`scroll-button ${isScrollingRight ? 'active' : ''} ${!canScrollRight ? 'disabled' : ''} bg-[#E8EAED] w-10 h-10 rounded-full flex justify-center items-center`}
					onMouseDown={() => startContinuousScroll('right')}
					onMouseUp={stopContinuousScroll}
					onMouseLeave={stopContinuousScroll}
				>
					<MdKeyboardArrowRight size={20} />
				</button>
			</div>

			<div
				ref={scrollContainerRef}
				className="custom-scroll-content"
				style={{
					width: '100%',
					overflow: 'auto',
					scrollbarWidth: 'none',
					msOverflowStyle: 'none',
				}}
			>
				{children}
			</div>
		</div>
	)
}
