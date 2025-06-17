import { ChangeEvent, forwardRef, Ref } from 'react'
import styles from './Input.module.css'
import clsx from 'clsx'

interface IinputProps {
	label?: string
	type?: string
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void
	value?: string | number | readonly string[] | undefined
	placeholder?: string
	disabled?: boolean
	width?: string
	height?: string
	maxWidth?: string
	minWidth?: string
	padding?: string
	borderRadius?: string
	background?: string
	border?: string
	color?: string
	htmlFor?: string
	className?: string
	required?: boolean
	onKeyDown?: (value: any) => void
}

export const Input = forwardRef(
	(props: IinputProps, ref: Ref<HTMLInputElement>) => {
		const {
			label,
			type,
			className,
			onChange,
			value,
			placeholder,
			disabled,
			htmlFor,
			onKeyDown,
			required,
			...perProps
		} = props
		return (
			<div className={styles.wrapper}>
				{label && (
					<label className={styles.label} htmlFor={htmlFor}>
						{label}
						{required && <span className="text-red-500">*</span>}
					</label>
				)}
				<input
					ref={ref}
					className={clsx(
						styles.input,
						className,
						'border-[1px] border-[#D8DADC] border-solid focus:border-myviolet focus:shadow-lg'
					)}
					name={props.label}
					{...perProps}
					type={type}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					disabled={disabled}
					onKeyDown={onKeyDown}
				/>
			</div>
		)
	}
)
