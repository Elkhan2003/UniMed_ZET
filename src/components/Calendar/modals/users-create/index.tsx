import { useEffect, useState } from 'react'
import { ModalComponent } from '../../../UI/Modal/Modal'
import { Input } from '../../../UI/Inputs/Input/Input'
import { InputNumberMask } from '../../../UI/Inputs/InputMask/InputMask'
import { Button } from '../../../UI/Buttons/Button/Button'
import { toast } from 'react-hot-toast'
import { useCreateUserByAdmin } from '../../../../shared/queries/users'

export const UsersCreate = ({
	active,
	setActive,
	onSuccess,
}: {
	active: boolean
	setActive: (active: boolean) => void
	onSuccess: () => void
}) => {
	const [postData, setPostData] = useState<any>({})
	const [disabled, setDisabled] = useState(false)
	const { mutate: postUsersRegistrationByAdmin, isPending: isLoading } =
		useCreateUserByAdmin(() => {
			setActive(false)
		})

	const handlePostData = async () => {
		try {
			postUsersRegistrationByAdmin(postData)
		} catch (error) {
			toast.error('Ошибка при добавлении клиента')
		}
	}

	useEffect(() => {
		if (postData?.firstName && postData?.authInfoRequest?.phoneNumber) {
			setDisabled(false)
		} else {
			setDisabled(true)
		}
	}, [postData])

	return (
		<ModalComponent
			active={active}
			handleClose={() => setActive(false)}
			title="Добавить клиента"
		>
			<div className="min-w-[350px] mt-4 flex flex-col gap-4">
				<div className="flex flex-col gap-4">
					<Input
						required
						label="Имя"
						value={postData.firstName}
						onChange={(value) => {
							setPostData({ ...postData, firstName: value.target.value })
						}}
					/>
					<InputNumberMask
						required
						label="Телефон"
						value={postData.phoneNumber}
						onChange={(value) => {
							setPostData({
								...postData,
								authInfoRequest: {
									...postData.authInfoRequest,
									phoneNumber: value,
								},
							})
						}}
					/>
				</div>
				<div className="flex gap-4">
					<Button
						minWidth="140px"
						height="30px"
						fontSize="13px"
						borderRadius="24px"
						backgroundColor="#D8DADC"
						color="#101010"
					>
						Отмена
					</Button>
					<Button
						minWidth="140px"
						height="30px"
						fontSize="13px"
						borderRadius="24px"
						backgroundColor="var(--myviolet)"
						isLoading={isLoading}
						onClick={handlePostData}
						color="white"
						disabled={disabled}
					>
						Добавить
					</Button>
				</div>
			</div>
		</ModalComponent>
	)
}
