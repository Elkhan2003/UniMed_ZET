import styled from 'styled-components'
import { Menu } from 'antd'

export const StyledMenu = styled(Menu)`
	padding-top: 20px;
	border-right: 1px solid black;
	.ant-menu-item {
		display: flex;
		align-items: center;
		font-family: 'Involve', sans-serif;
	}
	.ant-menu-item:hover {
		color: var(--myadmin) !important;
	}
	.ant-menu-item-active,
	.ant-menu-item-selected {
		color: var(--myadmin) !important;
		background-color: #f0edff !important;
	}
	.anticon {
		font-size: 17px;
	}
`

export const TopMenu = styled.div`
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 20px;
	background-color: rgb(253, 253, 253);
	border-bottom: 1px solid #ddd;
`