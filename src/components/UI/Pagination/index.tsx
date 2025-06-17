import styled from 'styled-components'
import { Pagination } from 'antd'

interface StyledPaginationProps {
	color?: '--myviolet' | '--myadmin' // Опциональный пропс для выбора цвета
}

export const PinkPagination = styled(Pagination)<StyledPaginationProps>`
	--pagination-color: ${(props) => `var(${props.color || '--myviolet'})`};

	.ant-pagination-item {
		background-color: white; /* White background */
		border: 1px solid var(--pagination-color); /* Violet border */
	}

	.ant-pagination-item a {
		color: var(--pagination-color) !important; /* Violet text */
	}

	/* Active page */
	.ant-pagination-item-active {
		background-color: var(--pagination-color) !important; /* Violet background */
		border-color: var(--pagination-color) !important;
	}

	.ant-pagination-item-active a {
		color: white !important; /* White text */
	}

	/* Prev & Next Buttons */
	.ant-pagination-prev,
	.ant-pagination-next {
		color: var(--pagination-color) !important;
	}

	.ant-pagination-prev:hover,
	.ant-pagination-next:hover {
		color: white !important;
		background-color: var(--pagination-color) !important;
	}
`
