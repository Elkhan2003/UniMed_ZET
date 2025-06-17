import React, { useState, useRef, useEffect, ReactNode } from 'react'

interface DropdownItem {
	key: string
	label: ReactNode
	icon?: ReactNode
	selected?: boolean
	disabled?: boolean
	onClick?: () => void
}

interface SlDropdownProps {
	items: DropdownItem[]
	children: ReactNode
	placement?:
		| 'bottom'
		| 'top'
		| 'bottomLeft'
		| 'bottomRight'
		| 'topLeft'
		| 'topRight'
	trigger?: 'hover' | 'click'
	disabled?: boolean
	className?: string
	overlayClassName?: string
	onOpenChange?: (open: boolean) => void
	closeOnClick?: boolean
}

export const SlDropdown: React.FC<SlDropdownProps> = ({
	items,
	children,
	placement = 'bottom',
	trigger = 'click',
	disabled = false,
	className,
	overlayClassName,
	onOpenChange,
	closeOnClick = true,
}) => {
	const [open, setOpen] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLDivElement>(null)

	const handleClickOutside = (event: MouseEvent) => {
		if (
			containerRef.current &&
			!containerRef.current.contains(event.target as Node)
		) {
			handleClose()
		}
	}

	const handleClose = () => {
		setIsVisible(false)
		setTimeout(() => {
			setOpen(false)
			onOpenChange?.(false)
		}, 150)
	}

	const handleOpen = () => {
		if (disabled) return
		setOpen(true)
		onOpenChange?.(true)
		setTimeout(() => setIsVisible(true), 10)
	}

	const handleToggle = () => {
		if (open) {
			handleClose()
		} else {
			handleOpen()
		}
	}

	useEffect(() => {
		if (open) {
			document.addEventListener('mousedown', handleClickOutside)
		}
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [open])

	const getPlacementStyles = () => {
		const triggerRect = triggerRef.current?.getBoundingClientRect()
		const baseStyles = {
			minWidth: triggerRect?.width || 120,
		}

		switch (placement) {
			case 'bottom':
				return {
					...baseStyles,
					top: '100%',
					left: '0',
					marginTop: '8px',
					transformOrigin: 'top center',
				}
			case 'top':
				return {
					...baseStyles,
					bottom: '100%',
					left: '0',
					marginBottom: '8px',
					transformOrigin: 'bottom center',
				}
			case 'bottomLeft':
				return {
					...baseStyles,
					top: '100%',
					left: '0',
					marginTop: '8px',
					transformOrigin: 'top left',
				}
			case 'bottomRight':
				return {
					...baseStyles,
					top: '100%',
					right: '0',
					marginTop: '8px',
					transformOrigin: 'top right',
				}
			case 'topLeft':
				return {
					...baseStyles,
					bottom: '100%',
					left: '0',
					marginBottom: '8px',
					transformOrigin: 'bottom left',
				}
			case 'topRight':
				return {
					...baseStyles,
					bottom: '100%',
					right: '0',
					marginBottom: '8px',
					transformOrigin: 'bottom right',
				}
			default:
				return baseStyles
		}
	}

	const handleItemClick = (item: DropdownItem) => {
		if (item.disabled) return
		item.onClick?.()
		closeOnClick && handleClose()
	}

	return (
		<div
			className={`relative inline-block ${className}`}
			ref={containerRef}
			{...(trigger === 'hover'
				? { onMouseEnter: handleOpen, onMouseLeave: handleClose }
				: {})}
		>
			<div
				ref={triggerRef}
				className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
				{...(trigger === 'click' ? { onClick: handleToggle } : {})}
			>
				{children}
			</div>

			{open && (
				<div
					className={`absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-1 ${overlayClassName}`}
					style={{
						...getPlacementStyles(),
						transform: isVisible
							? 'translateY(0) scale(1)'
							: 'translateY(-8px) scale(0.95)',
						opacity: isVisible ? 1 : 0,
						transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
						boxShadow:
							'0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
					}}
				>
					{(placement.includes('bottom') || placement === 'bottom') && (
						<>
							<div
								className="absolute w-0 h-0 bg-white"
								style={{
									top: '-6px',
									left:
										placement === 'bottomRight'
											? 'auto'
											: placement === 'bottomLeft'
												? '12px'
												: '50%',
									right: placement === 'bottomRight' ? '12px' : 'auto',
									transform:
										placement === 'bottom' ? 'translateX(-50%)' : 'none',
									borderLeft: '6px solid transparent',
									borderRight: '6px solid transparent',
									borderBottom: '6px solid white',
								}}
							/>
							<div
								className="absolute w-0 h-0 bg-white"
								style={{
									top: '-7px',
									left:
										placement === 'bottomRight'
											? 'auto'
											: placement === 'bottomLeft'
												? '12px'
												: '50%',
									right: placement === 'bottomRight' ? '12px' : 'auto',
									transform:
										placement === 'bottom' ? 'translateX(-50%)' : 'none',
									borderLeft: '7px solid transparent',
									borderRight: '7px solid transparent',
									borderBottom: '7px solid #e5e7eb',
								}}
							/>
						</>
					)}

					{(placement.includes('top') || placement === 'top') && (
						<>
							<div
								className="absolute w-0 h-0 bg-white"
								style={{
									bottom: '-6px',
									left:
										placement === 'topRight'
											? 'auto'
											: placement === 'topLeft'
												? '12px'
												: '50%',
									right: placement === 'topRight' ? '12px' : 'auto',
									transform: placement === 'top' ? 'translateX(-50%)' : 'none',
									borderLeft: '6px solid transparent',
									borderRight: '6px solid transparent',
									borderTop: '6px solid white',
								}}
							/>
							<div
								className="absolute w-0 h-0 bg-white"
								style={{
									bottom: '-7px',
									left:
										placement === 'topRight'
											? 'auto'
											: placement === 'topLeft'
												? '12px'
												: '50%',
									right: placement === 'topRight' ? '12px' : 'auto',
									transform: placement === 'top' ? 'translateX(-50%)' : 'none',
									borderLeft: '7px solid transparent',
									borderRight: '7px solid transparent',
									borderTop: '7px solid #e5e7eb',
								}}
							/>
						</>
					)}

					<div className="max-h-64 overflow-y-auto">
						{items.map((item) => (
							<div
								key={item.key}
								onClick={() => handleItemClick(item)}
								className={`
									flex items-center px-3 py-2 text-sm cursor-pointer transition-colors duration-150 hover:bg-gray-100
									${
										item.disabled
											? 'text-gray-400 cursor-not-allowed'
											: item.selected
												? 'text-[var(--myviolet)]'
												: 'text-[#101010]'
									}
								`}
							>
								{item.icon && (
									<span className="mr-2 flex-shrink-0">{item.icon}</span>
								)}
								<span className="flex-1">{item.label}</span>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
