import React, { useState, useRef, useEffect } from 'react'

interface SlPopconfirmProps {
	title?: string
	description?: string
	onConfirm: () => void
	onCancel?: () => void
	children: React.ReactNode
	confirmText?: string
	cancelText?: string
}

export const SlPopconfirm: React.FC<SlPopconfirmProps> = ({
	title = 'Вы точно хотите выйти?',
	description,
	onConfirm,
	onCancel,
	children,
	confirmText = 'Да',
	cancelText = 'Нет',
}) => {
	const [open, setOpen] = useState(false)
	const [isVisible, setIsVisible] = useState(false)
	const ref = useRef<HTMLDivElement>(null)
	const triggerRef = useRef<HTMLDivElement>(null)

	const handleClickOutside = (event: MouseEvent) => {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			handleClose()
		}
	}

	const handleClose = () => {
		setIsVisible(false)
		setTimeout(() => setOpen(false), 150)
	}

	const handleOpen = () => {
		setOpen(true)
		setTimeout(() => setIsVisible(true), 10)
	}

	useEffect(() => {
		if (open) document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [open])

	const triggerRect = triggerRef.current?.getBoundingClientRect()

	return (
		<div className="relative inline-block" ref={ref}>
			<div ref={triggerRef} onClick={handleOpen}>
				{children}
			</div>

			{open && (
				<div
					style={{ 
						bottom: (triggerRect?.height ?? 0) + 10,
						boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
						transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
						opacity: isVisible ? 1 : 0,
						transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
					}}
					className="absolute z-50 min-w-[200px] bg-white border border-[#F2F2F1] border-solid rounded-xl px-3 py-2"
				>
					<div 
						className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
						style={{
							bottom: '-6px',
							borderLeft: '6px solid transparent',
							borderRight: '6px solid transparent',
							borderTop: '6px solid white',
						}}
					/>
					<div 
						className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0"
						style={{
							bottom: '-7px',
							borderLeft: '7px solid transparent',
							borderRight: '7px solid transparent',
							borderTop: '7px solid white',
						}}
					/>

					<h3 className="text-[14px] font-medium text-gray-800 mb-1">{title}</h3>
					{description && (
						<p className="text-sm text-gray-600 mb-3">{description}</p>
					)}

					<div className="flex justify-end space-x-2">
						<button
							className="px-2 py-[2px] rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-[13px] transition-colors duration-150"
							onClick={() => {
								handleClose()
								onCancel?.()
							}}
						>
							{cancelText}
						</button>
						<button
							className="px-2 py-[2px] rounded-md bg-red-500 text-white hover:bg-red-600 text-[13px] transition-colors duration-150"
							onClick={() => {
								handleClose()
								onConfirm()
							}}
						>
							{confirmText}
						</button>
					</div>
				</div>
			)}
		</div>
	)
}