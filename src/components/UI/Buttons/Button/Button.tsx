import styles from './Button.module.css'
import { LuLoader2 } from "react-icons/lu";

interface ButtonProps {
	onClick?: (value: any) => void
	width?: string
	height?: string
	minWidth?: string
	backgroundColor?: string
	borderRadius?: string
	color?: string
	fontSize?: string
	fontWeight?: string
	padding?: string
	border?: string
	margin?: string
	disabled?: boolean
	display?: string
	children: React.ReactNode
	type?: string
	isLoading?: boolean
	loadingColor?: string
}

export const Button = (props: ButtonProps) => {
	const { onClick, disabled, children, ...preProps } = props
	return (
		<button
			className={
				props.type === 'delete'
					? styles.cancel_button
					: props.type === 'cancel'
					? styles.cancel_button
					: `hover:shadow-lg text-[14px] ${styles.button}`
			}
			onClick={onClick}
			style={preProps}
			disabled={disabled || props.isLoading}
		>
			{props.isLoading ? <LuLoader2 color={props.loadingColor || 'var(--myviolet)'} size={26} className='animate-spin font-[900]' /> : children}
		</button>
	)
}
