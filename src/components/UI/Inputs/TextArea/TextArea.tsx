import { ChangeEvent } from 'react'
import styles from './TextArea.module.css'

interface TextareaProps {
	value: string
	onChange: (newValue: string) => void
	placeholder: string
	height?: string
	label?: string
	required?: boolean
	error?: string
}

export const TextArea = ({
	value,
	onChange,
	placeholder,
	height,
	label,
	required,
	error,
}: TextareaProps) => {
	const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		onChange(event.target.value)
	}
	return (
		<div className='relative'>
			<p className={styles.title_label_text}>
				{label !== undefined && label}
				{required && <span className="text-red-500">*</span>}
			</p>
			<textarea
				style={{ height: height }}
				className={styles.textarea}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
			/>
			{error && <p className="text-red-500 text-[11px] absolute bottom-[-10px] left-2">{error}</p>}
		</div>
	)
}
