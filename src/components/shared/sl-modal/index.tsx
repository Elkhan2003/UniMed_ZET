import ReactDOM from 'react-dom'
import React from 'react'

export const SlModal = ({
	active,
	handleClose,
	children,
	title,
	wrapperClassName = 'bg-white',
	headerClassName = 'bg-white',
	headerContent,
}: {
	active: boolean
	handleClose: () => void
	children: React.ReactNode
	title: string
	wrapperClassName?: string
	headerClassName?: string
	headerContent?: React.ReactNode
}) => {
	if (typeof window === 'undefined') return null

	return ReactDOM.createPortal(
		<>
			<div
				className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity z-40 ${
					active
						? 'opacity-100 pointer-events-auto'
						: 'opacity-0 pointer-events-none'
				}`}
				onClick={handleClose}
			/>

			<div
				className={`fixed top-0 right-0 h-full min-w-[550px] max-w-[550px] shadow-lg transform transition-transform duration-500 z-50
          ${active ? 'translate-x-0' : 'translate-x-full'} ${wrapperClassName}`}
				onClick={(e) => e.stopPropagation()}
			>
				{headerContent ? (
					headerContent
				) : (
					<div
						className={`flex items-center px-4 pt-4 pb-2 border-b gap-4 ${headerClassName}`}
					>
						<button
							onClick={handleClose}
							className="text-[#101010] text-[22px] font-[300]"
						>
							✕
						</button>
						<p className="text-[16px] font-[600]">{title}</p>
					</div>
				)}
				<div className="px-4 max-h-[91.5vh] h-[91.5vh] overflow-y-auto">
					{children}
				</div>
			</div>
		</>,
		document.body
	)
}
