import React, { useState } from 'react'
import PhoneInput, {PhoneInputProps} from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { masks } from '../../../../shared/lib/constants/constants'

interface IinputNumberMask {
	label?: string
	onChange: (value: string) => void | any
	value: string | undefined
	disabled?: boolean
	width?: string
	height?: string
	maxWidth?: string
	minWidth?: string
	padding?: string
	borderRadius?: string
	background?: string
	border?: string
	boxShadow?: string
	fontSize?: string
	color?: string
	error?: string
	required?: boolean
	onKeyDown?: (value: any) => void
}

export const InputNumberMask = (props: IinputNumberMask) => {
	const {
		onChange,
		value,
		onKeyDown,
		disabled,
		label,
		border,
		boxShadow,
		height,
		width,
		minWidth,
		error,
		fontSize,
		required,
		...restProps
	} = props

	const [isFocused, setIsFocused] = useState(false)
	const handleChange = (value: string) => {
		onChange('+' + value)
	}

	return (
		<div className="w-full flex flex-col items-start relative">
			{label && (
				<label className="text-[13px]" htmlFor={label}>
					{label}
					{required && <span className="text-red-500">*</span>}
				</label>
			)}
			<PhoneInput
				{...restProps}
				disabled={disabled}
				country={'kg'}
				onChange={handleChange}
				onlyCountries={Object.keys(masks).map((item) => item)}
				enableLongNumbers={false}
				countryCodeEditable={false}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				inputStyle={{
					fontSize: '13px',
					width: `${width ? width : '100%'}`,
					height: '37px',
					border: isFocused
						? '1px solid var(--myviolet)'
						: `${border ? border : '1px solid #D8DADC'}`,
					boxShadow: boxShadow,
					minWidth: minWidth,
					borderRadius: '10px',
					fontFamily: 'Involve, sans-serif',
				}}
				buttonStyle={{
					background: 'transparent',
					border: isFocused
						? '1px solid var(--myviolet)'
						: `${border ? border : '1px solid #D8DADC'}`,
					borderRadius: '10px 0px 0px 10px',
				}}
				value={value}
				masks={masks}
			/>
			{error && <p className="text-[10px] text-red-500">{error}</p>}
		</div>
	)
}
