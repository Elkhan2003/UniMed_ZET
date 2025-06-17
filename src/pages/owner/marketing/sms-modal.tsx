import { useEffect, useState } from 'react'
import { TextArea } from '../../../components/UI/Inputs/TextArea/TextArea'
import { ModalComponent } from '../../../components/UI/Modal/Modal'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { TypeSmsMarketing } from '.'
import {
	openTelegramChat,
	openWhatsAppChat,
} from '../../../shared/lib/helpers/helpers'

export const SmsModal = ({
	active,
	handleClose,
	typeSms,
	phone,
	typeChat,
}: {
	active: boolean
	handleClose: () => void
	typeSms: string
	phone: string
	typeChat: string
}) => {
	const [text, setText] = useState('')

	useEffect(() => {
		setText(TypeSmsMarketing[typeSms])
	}, [typeSms, active])

	return (
		<ModalComponent title="Сообщение" active={active} handleClose={handleClose}>
			<div className="w-[400px] h-full flex flex-col gap-4 mt-4">
				<TextArea
					placeholder="Введите текст сообщения"
					value={text}
					onChange={(e) => setText(e)}
					height="150px"
				/>
				<div className="flex items-center justify-end gap-2">
					<Button onClick={handleClose} border="1px solid #D8DADC">
						Отмена
					</Button>
					<Button
						onClick={() => {
							if (typeChat === 'WHATSAPP') {
								openWhatsAppChat(phone, text)
							} else {
								openTelegramChat(phone, text)
							}
						}}
					>
						Отправить
					</Button>
				</div>
			</div>
		</ModalComponent>
	)
}
