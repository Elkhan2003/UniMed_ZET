import { Select } from 'antd'
import styled from 'styled-components'
import { SelectProps } from 'antd/lib/select'

interface StyledSelectProps extends SelectProps<any> {
	active?: boolean
}

export const StyledSelect = styled(({ ...props }: StyledSelectProps) => (
	<Select {...props} />
))`
	width: 200px;
	min-width: 200px;
	border-radius: 10px;
	font-family: 'Involve', sans-serif;

	.ant-select-selector {
		background-color: ${({ active }) => (active ? '#ffffff' : 'var(--myviolet)')} !important;
		border-radius: 8px !important;
		border: ${({ active }) => (!active ? '#E8EAED' : '1px solid var(--myviolet)')} !important;

		.ant-select-selection-item {
			color: ${({ active }) => (!active ? '#ffffff' : 'var(--myviolet)')} !important;
		}

		.ant-select-selection-placeholder {
			color: ${({ active }) => (!active ? '#ffffff' : 'var(--myviolet)')} !important;
			opacity: 1;
		}
	}

	.ant-select-arrow {
		color: ${({ active }) => (!active ? '#ffffff' : 'var(--myviolet)')} !important;
	}

	.ant-select-selection-search-input {
		color: ${({ active }) => (!active ? '#ffffff' : 'var(--myviolet)')} !important;
	}

	.ant-select-selection-search {
		input {
			color: ${({ active }) => (!active ? '#ffffff' : 'var(--myviolet)')} !important;
		}
	}
`
