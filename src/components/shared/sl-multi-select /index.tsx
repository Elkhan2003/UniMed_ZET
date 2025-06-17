import React, { useState, useRef, useEffect } from 'react'
import { MdKeyboardArrowDown, MdClose } from 'react-icons/md'

interface SlMultiSelectProps {
	label: string
	value: string[]
	required?: boolean
	onChange: (value: string[]) => void
	options: { value: string; label: string }[]
	error?: string
	placeholder?: string
	disabled?: boolean
}

export const SlMultiSelect = ({
	label,
	value = [],
	onChange,
	required = false,
	options,
	error,
	placeholder = 'Выберите варианты...',
	disabled = false,
	...props
}: SlMultiSelectProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleOptionToggle = (optionValue: string) => {
		if (disabled) return

		const newValue = value.includes(optionValue)
			? value.filter((v) => v !== optionValue)
			: [...value, optionValue]

		onChange(newValue)
	}

	const handleRemoveTag = (optionValue: string, e: React.MouseEvent) => {
		e.stopPropagation()
		if (disabled) return

		const newValue = value.filter((v) => v !== optionValue)
		onChange(newValue)
	}

	const getSelectedLabels = () => {
		return value.map((val) => {
			const option = options.find((opt) => opt.value === val)
			return option ? option.label : val
		})
	}

	const toggleDropdown = () => {
		if (!disabled) {
			setIsOpen(!isOpen)
		}
	}

	return (
		<div className="w-full flex flex-col gap-[5px]" ref={containerRef}>
			<label className="text-[14px] font-[400] text-[#101010]">
				{label}
				{required && <span className="text-[#FF0000]">*</span>}
			</label>

			<div className="relative">
				<div
					onClick={toggleDropdown}
					className={`
            w-full min-h-[40px] rounded-[8px] px-[10px] py-2 cursor-pointer
            flex flex-wrap items-center gap-1 pr-[35px]
            ${error ? 'border border-[#FF0000] border-solid' : 'border border-[#E8EAED] border-solid'}
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:border-[##E8EAED]'}
          `}
				>
					{value.length > 0 ? (
						getSelectedLabels().map((label, index) => (
							<span
								key={value[index]}
								className="inline-flex items-center gap-1 bg-[#f1f3f4] text-[#202124] px-2 py-1 rounded text-[12px] max-w-[150px]"
							>
								<span className="truncate">{label}</span>
								{!disabled && (
									<MdClose
										className="w-3 h-3 cursor-pointer hover:bg-[#dadce0] rounded"
										onClick={(e) => handleRemoveTag(value[index], e)}
									/>
								)}
							</span>
						))
					) : (
						<span className="text-[#4E4E4E80] text-[14px]">{placeholder}</span>
					)}
				</div>

				<div className="absolute right-[10px] top-1/2 transform -translate-y-1/2 pointer-events-none">
					<MdKeyboardArrowDown
						className={`w-5 h-5 text-[#5f6368] transition-transform duration-200 ${
							isOpen ? 'rotate-180' : ''
						}`}
					/>
				</div>

				{isOpen && (
					<div
						ref={dropdownRef}
						className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E8EAED] rounded-[8px] shadow-lg z-50 max-h-[200px] overflow-auto"
					>
						{options.length === 0 ? (
							<div className="px-3 py-2 text-[#5f6368] text-[14px]">
								Нет доступных опций
							</div>
						) : (
							options.map((option) => {
								const isSelected = value.includes(option.value)
								return (
									<div
										key={option.value}
										onClick={() => handleOptionToggle(option.value)}
										className={`
                      px-3 py-2 cursor-pointer text-[14px] hover:bg-[#f8f9fa]
                      flex items-center gap-2
                      ${isSelected ? 'bg-[#e8f0fe] text-[#101010]' : 'text-[#202124]'}
                    `}
									>
										<div
											className={`
                      w-4 h-4 border-2 rounded flex items-center justify-center
                      ${isSelected ? 'bg-[#101010] border-[#101010]' : 'border-[#dadce0]'}
                    `}
										>
											{isSelected && (
												<svg
													className="w-2 h-2 text-white fill-current"
													viewBox="0 0 20 20"
												>
													<path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
												</svg>
											)}
										</div>
										<span className="flex-1">{option.label}</span>
									</div>
								)
							})
						)}
					</div>
				)}
			</div>

			{error && <p className="text-[#FF0000] text-[12px]">{error}</p>}
		</div>
	)
}
