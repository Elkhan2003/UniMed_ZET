import { Modal } from 'antd'
import styled from 'styled-components'
import { Button } from '../../Buttons/Button/Button'

interface ModalProps {
	active: boolean
	handleClose: any
	handleTrueClick: any
	title: string
	okText?: string
	okColor?: boolean
}

export const DeleteModal = ({
	active,
	handleClose,
	handleTrueClick,
	title,
	okText,
	okColor,
}: ModalProps) => {
	return (
		<StyledModal
			title={title}
			onCancel={handleClose}
			open={active}
			footer={null}
			width="auto"
			centered
		>
			<div className="w-[250px] flex p-2 gap-4">
				<Button
					onClick={handleClose}
					backgroundColor="white"
					color="#acacac"
					border="1px solid #acacac"
				>
					Отмена
				</Button>
				<Button
					backgroundColor={okColor ? 'var(--myadmin)' : 'var(--myviolet)'}
					onClick={handleTrueClick}
				>
					{okText || 'Удалить'}
				</Button>
			</div>
		</StyledModal>
	)
}

export const StyledModal = styled(Modal)`
	.ant-modal-content {
		width: auto;
		max-width: 90vw;
		padding: 10px;
		font-family: 'Involve', sans-serif;
	}

	.ant-modal-body {
		display: flex;
		flex-direction: column;
		font-family: 'Involve', sans-serif;
	}

	.ant-modal-title {
		font-family: 'Involve', sans-serif;
	}
`
