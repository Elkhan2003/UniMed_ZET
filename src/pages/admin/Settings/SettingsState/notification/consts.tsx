import React, { useRef, useEffect } from 'react'

export const Message = ({ text }: { text: string }) => {
	const parts = text?.split(/(\{[^}]*\})/g) // Разбиваем текст по {...}

	return (
		<p>
			{parts?.map((part, index) =>
				part.startsWith('{') && part.endsWith('}') ? (
					<span key={index} className="text-myviolet">
						{part}
					</span>
				) : (
					part
				)
			)}
		</p>
	)
}

export const HighlightTextarea = ({
	value,
	setValue,
}: {
	value: string
	setValue: (value: string) => void
}) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)

	const getHighlightedText = (text: string) => {
		return text?.split(/(\{[^}]*\})/g)?.map((part, index) =>
			part.startsWith('{') && part.endsWith('}') ? (
				<span key={index} className="text-myviolet">
					{part}
				</span>
			) : (
				part
			)
		)
	}

	// Function to adjust height dynamically
	const adjustHeight = () => {
		if (textareaRef.current && containerRef.current) {
			textareaRef.current.style.height = 'auto' // Reset height to recalculate
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
			containerRef.current.style.height = textareaRef.current.style.height
		}
	}

	// Adjust height on value change
	useEffect(() => {
		adjustHeight()
	}, [value])

	return (
		<div className="relative w-full max-w-[100%] bg-gray-50">
			{/* Highlighted text container */}
			<div
				ref={containerRef}
				className="absolute inset-0 p-2 whitespace-pre-wrap break-words pointer-events-none text-gray-700"
				aria-hidden="true"
			>
				{getHighlightedText(value)}
			</div>

			{/* Textarea with auto-growing height */}
			<textarea
				ref={textareaRef}
				className="w-full p-2 bg-transparent border border-gray-300 outline-none resize-none caret-black text-transparent overflow-hidden"
				value={value}
				onChange={(e) => {
					setValue(e.target.value)
					adjustHeight()
				}}
			/>
		</div>
	)
}
