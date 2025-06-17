import { ReactNode } from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'

interface ModalProps {
	active: boolean
	handleClose: any
	children: ReactNode
	title?: any
	props?: any
}

export const ModalComponent = ({
	active,
	handleClose,
	children,
	title,
	...props
}: ModalProps) => {
	return (
		<StyledModal
			title={title}
			onCancel={handleClose}
			open={active}
			footer={null}
			width="auto"
			centered
			{...props}
		>
			{children}
		</StyledModal>
	)
}

export const StyledModal = styled(Modal)`
	.ant-modal-content {
		width: auto;
		max-width: 90vw;
		padding: 10px;
	}

	.ant-modal-body {
		display: flex;
		flex-direction: column;
	}

	.ant-modal-title {
		font-weight: 500;
	}
`
