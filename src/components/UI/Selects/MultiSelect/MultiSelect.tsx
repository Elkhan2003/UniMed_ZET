import styles from './MultiSelect.module.css'
import Select from 'react-select'

interface MultiSelectProps {
	options: { label: string | number; value: number }[] | []
	label: string
	placeholder: string
	noOptionsMessage: (obj: { inputValue: string }) => React.ReactNode
	value: { label: string | number; value: number }[] | []
	onChange: (e: any) => void
	isClearable: boolean
	isLoading?: boolean
	isDisabled?: boolean
	required?: boolean
}

export const MultiSelect = ({
	options = [],
	label = '',
	placeholder = '',
	noOptionsMessage = () => null,
	value = [],
	onChange = () => {},
	isClearable = false,
	isLoading = false,
	isDisabled = false,
	required = false,
}: MultiSelectProps) => {
	const customStyles = {
		control: (provided: any, state: any) => ({
			...provided,
			minHeight: '37px',
			backgroundColor: isDisabled ? '#f0f0f0' : '#fff', // фон контейнера
			borderColor: state.isFocused ? 'var(--myviolet)' : '#eaeaea', // изменение бордюра при фокусе
			boxShadow: state.isFocused ? '0 0 0 1px var(--myviolet)' : 'none', // тень при фокусе
			'&:hover': {
				borderColor: state.isFocused ? 'var(--myviolet)' : '#D8DADC', // изменение бордюра при наведении
			},
			borderRadius: '10px',
		}),
		option: (provided: any, state: any) => ({
			...provided,
			backgroundColor: state.isSelected
				? 'var(--myviolet)'
				: state.isFocused
				? '#eaeaea'
				: '#fff', // фон опций
			color: state.isSelected ? '#fff' : '#333', // цвет текста в опциях
			cursor: 'pointer',
			'&:active': {
				backgroundColor: 'var(--myviolet)', // фон при активации
			},
		}),
		menu: (provided: any) => ({
			...provided,
			zIndex: 20, // для правильного отображения над другими элементами
		}),
		multiValue: (provided: any) => ({
			...provided,
			backgroundColor: '#eaeaea', // фон выбранных значений
		}),
		multiValueLabel: (provided: any) => ({
			...provided,
			color: '#333', // цвет текста выбранных значений
		}),
		multiValueRemove: (provided: any) => ({
			...provided,
			color: 'var(--myviolet)', // цвет иконки удаления
			'&:hover': {
				backgroundColor: 'var(--myviolet)', // цвет фона при наведении
				color: '#fff', // цвет текста при наведении
			},
		}),
		placeholder: (provided: any) => ({
			...provided,
			color: '#b3b3b3', // цвет текста плейсхолдера
		}),
		clearIndicator: (provided: any) => ({
			...provided,
			color: 'var(--myviolet)', // цвет иконки очистки
			'&:hover': {
				color: 'var(--myviolet)', // цвет при наведении
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
				isMulti
				options={options}
				styles={customStyles}
				placeholder={placeholder}
				noOptionsMessage={noOptionsMessage}
				value={value}
				onChange={onChange}
				isClearable={isClearable}
				isLoading={isLoading}
				isDisabled={isLoading || isDisabled}
				isSearchable={true}
			/>
		</div>
	)
}
