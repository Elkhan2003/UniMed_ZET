import { ModalComponent } from '../../../components/UI/Modal/Modal'

export const CallModal = ({
	active,
	handleClose,
}: {
	active: boolean
	handleClose: () => void
}) => {
	return (
		<ModalComponent
			active={active}
			handleClose={handleClose}
			title="Вызов клиента"
		>
			<div className="flex flex-col gap-[400px]">
                
            </div>
		</ModalComponent>
	)
}
