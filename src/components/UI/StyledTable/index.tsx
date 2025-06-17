import { Table } from 'antd'
import styled from 'styled-components'

export const StyledTable = styled(Table)`
	font-family: 'Involve', sans-serif;

	.ant-table-thead > tr > th,
	.ant-table-tbody > tr > td {
		font-family: 'Involve', sans-serif;
	}

	.ant-table-row-expand-icon {
		color: var(--myviolet) !important;
	}

	.ant-table-row-expanded .ant-table-row-expand-icon {
		color: var(--myviolet) !important;
	}

	.ant-table-tbody > tr.ant-table-row-expanded {
		border: 2px solid var(--myviolet) !important;
	}

	/* Pagination customization */
	.ant-pagination {
		color: var(--myviolet);
	}

	.ant-pagination-item {
		border-color: var(--myviolet);
	}

	.ant-pagination-item a {
		color: var(--myviolet);
	}

	.ant-pagination-item-active {
		background-color: var(--myviolet);
		border-color: var(--myviolet);
	}

	.ant-pagination-item-active a {
		color: #fff;
	}

	.ant-pagination-prev .ant-pagination-item-link,
	.ant-pagination-next .ant-pagination-item-link {
		color: var(--myviolet);
		border-color: var(--myviolet);
	}

	.ant-pagination-options .ant-select-selector {
		border-color: var(--myviolet);
	}

	.ant-pagination-options .ant-select-arrow {
		color: var(--myviolet);
	}
`

