import Select from 'react-select'
import styles from './LonelySelect.module.css'
import { ReactNode } from 'react'

interface LonelySelectProps {
	options: { label: string; value: string | number | any }[] | []
	label: string
	placeholder: string
	noOptionsMessage: (obj: { inputValue: string }) => ReactNode
	value: { label: string; value: string | number } | null
	onChange: (e: any) => void
	isClearable: boolean
	isLoading: boolean
	isDisabled?: boolean
	required?: boolean
}

export const LonelySelect = ({
	options = [],
	label = '',
	placeholder = '',
	noOptionsMessage = () => null,
	value = null,
	onChange = () => {},
	isClearable = false,
	isLoading = false,
	isDisabled = false,
	required
}: LonelySelectProps) => {
	const customStyles = {
		control: (provided: any, state: any) => ({
			...provided,
			backgroundColor: isDisabled ? '#f0f0f0' : '#fff',
			height: '37px',
			minWidth: '200px',
			fontSize: '13px',
			fontFamily: 'Involve, sans-serif',
			borderColor: state.isFocused ? 'var(--myviolet)' : 'var(--myviolet)',
			borderRadius: '10px',
			borderWidth: '1px',
			boxShadow: state.isFocused ? '0 0 4px var(--myviolet)' : 'none',
			'&:hover': {
				borderColor: 'var(--myviolet)',
			},
		}),
		option: (provided: any, state: any) => ({
			...provided,
			backgroundColor: state.isSelected ? 'var(--myviolet)' : state.isFocused ? '#eaeaea' : '#fff',
			color: state.isSelected ? '#fff' : '#333',
			cursor: 'pointer',
			fontFamily: 'Involve, sans-serif',
			'&:active': {
				backgroundColor: 'var(--myviolet)',
			},
		}),
		menu: (provided: any) => ({
			...provided,
			zIndex: 20,
			fontFamily: 'Involve, sans-serif',
		}),
		singleValue: (provided: any) => ({
			...provided,
			color: 'var(--myviolet)',
			fontFamily: 'Involve, sans-serif',
		}),
		placeholder: (provided: any) => ({
			...provided,
			color: '#b3b3b3',
			fontFamily: 'Involve, sans-serif',
		}),
		dropdownIndicator: (provided: any) => ({
			...provided,
			color: 'var(--myviolet)',
			fontFamily: 'Involve, sans-serif',
			'&:hover': {
				color: 'var(--myviolet)',
			},
		}),
		clearIndicator: (provided: any) => ({
			...provided,
			color: 'var(--myviolet)',
			fontFamily: 'Involve, sans-serif',
			'&:hover': {
				color: 'var(--myviolet)',
			},
		}),
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.label}>
				{label}
				{required && <span className="text-red-500">*</span>}
			</div>
			<Select
				styles={customStyles}
				options={options}
				placeholder={placeholder}
				noOptionsMessage={noOptionsMessage}
				value={value}
				onChange={onChange}
				isLoading={isLoading}
				isDisabled={isLoading || isDisabled}
				isSearchable={true}
			/>
		</div>
	)
}
