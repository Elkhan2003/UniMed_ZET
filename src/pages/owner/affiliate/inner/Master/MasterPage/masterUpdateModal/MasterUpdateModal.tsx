import { SetStateAction, Dispatch } from 'react'
import { ModalComponent } from '../../../../../../../components/UI/Modal/Modal'
import { Input } from '../../../../../../../components/UI/Inputs/Input/Input'
import { InputPassword } from '../../../../../../../components/UI/Inputs/InputPassword/InputPassword'
import { Button } from '../../../../../../../components/UI/Buttons/Button/Button'
import { InputNumberMask } from '../../../../../../../components/UI/Inputs/InputMask/InputMask'
import { TextArea } from '../../../../../../../components/UI/Inputs/TextArea/TextArea'
import toast from 'react-hot-toast'
import { LonelySelect } from '../../../../../../../components/UI/Selects/LonelySelect/LonelySelect'
import {
	COMPENSATION_TYPE,
	EXPERIENCE,
} from '../../../../../../../shared/lib/constants/constants'
import { usePutMasterMutation } from '../../../../../../../store/services/master.service'

interface MasterUpdateModalProps {
	validationMaster: boolean
	descriptionMaster: string
	setDescriptionMaster: (value: string) => void
	masterData: {
		firstName: string
		lastName: string
		authInfoRequest: {
			phoneNumber: string
			password: string | number
		}
		salaryRateRequest: {
			amount: number
			compensationType: any
		}
	}
	setMasterData: Dispatch<
		SetStateAction<{
			firstName: string
			lastName: string
			authInfoRequest: {
				phoneNumber: string
				password: string
			}
			salaryRateRequest: {
				amount: number
				compensationType: any
			}
		}>
	>
	masterModal: {
		masterModalAdd: boolean
		masterModalUpdate: boolean
	}
	setMasterModal: (modalState: {
		masterModalAdd: boolean
		masterModalUpdate: boolean
	}) => void
	masterId: number | string | undefined
	refetch?: any
	hide?: boolean
}

export const MasterUpdateModal = ({
	masterData,
	setMasterData,
	masterModal,
	setMasterModal,
	masterId,
	validationMaster,
	descriptionMaster,
	setDescriptionMaster,
	refetch,
	hide = false,
}: any) => {
	const [putMaster, { isLoading }] = usePutMasterMutation()

	function handleClose() {
		setDescriptionMaster('')
		setMasterModal({
			masterModalAdd: false,
			masterModalUpdate: false,
		})
		setMasterData({
			firstName: '',
			lastName: '',
			experience: '',
			authInfoRequest: {
				phoneNumber: '',
				password: '',
			},
			salaryRateRequest: {
				amount: 0,
				compensationType: { label: 'Фиксированный', value: 'FIXED' },
			},
		})
	}

	async function handlePut() {
		try {
			const response: any = await putMaster({
				masterId,
				masterData: {
					firstName: masterData?.firstName || '',
					lastName: masterData?.lastName || '',
					experience: masterData?.experience || 0,
					authInfoRequest: {
						phoneNumber: masterData?.authInfoRequest?.phoneNumber || '',
						password: masterData?.authInfoRequest?.password || '',
					},
					description: descriptionMaster || '',
					salaryRateRequest: {
						amount: masterData?.salaryRateRequest?.amount || 0,
						compensationType:
							masterData?.salaryRateRequest?.compensationType?.value || '',
					},
				},
			})

			if (response['error']) {
				toast.error(response?.error?.data?.message || 'Произошла ошибка')
			} else {
				toast.success('Информация обновлена!')
				if (refetch) {
					refetch()
				}
				handleClose()
			}
		} catch (error: any) {
			console.error(error)
			toast.error(error?.message || 'Произошла ошибка')
		}
	}

	function handleChangeFirsName(value: string) {
		setMasterData((prevState: any) => ({
			...prevState,
			firstName: value,
		}))
	}

	function handleChangeLastName(value: string) {
		setMasterData((prevState: any) => ({
			...prevState,
			lastName: value,
		}))
	}

	function handleChangePhoneNumber(value: string) {
		setMasterData((prevState: any) => ({
			...prevState,
			authInfoRequest: {
				phoneNumber: value,
				password: prevState.authInfoRequest.password,
			},
		}))
	}

	function handleChangePassword(value: string) {
		setMasterData((prevState: any) => ({
			...prevState,
			authInfoRequest: {
				phoneNumber: prevState.authInfoRequest.phoneNumber,
				password: value,
			},
		}))
	}

	return (
		<ModalComponent
			active={masterModal.masterModalUpdate}
			handleClose={handleClose}
			title="Редактировать профиль"
		>
			<div className="w-[480px] md:w-[300px]">
				<div className="w-full flex item-center justify-between gap-2 md:flex-col">
					<Input
						label="Имя"
						value={masterData?.firstName}
						onChange={(value) => handleChangeFirsName(value.target.value)}
						required
					/>
					<Input
						label="Фамилия"
						value={masterData?.lastName}
						onChange={(value) => handleChangeLastName(value.target.value)}
						required
					/>
				</div>
				<div className="w-full flex item-center justify-between gap-2 md:flex-col">
					<InputNumberMask
						label="Номер"
						value={masterData?.authInfoRequest?.phoneNumber}
						onChange={(value) => handleChangePhoneNumber(value)}
						required
					/>
					<div className="flex items-center gap-[10px] w-full">
						<Input
							type="text"
							label="Стаж"
							placeholder="Сколько лет опыта работы"
							value={masterData?.experience}
							onChange={(e) => {
								const value = e.target.value

								if (/^\d*$/.test(value)) {
									setMasterData((prevState: any) => ({
										...prevState,
										experience: value,
									}))
								}
							}}
							onKeyDown={(e) => {
								if (e.key === '-' || e.key === '+' || e.key === 'e') {
									e.preventDefault()
								}
							}}
							className="w-full"
						/>
						{hide === false && (
							<InputPassword
								label="Пароль"
								value={masterData?.authInfoRequest?.password}
								onChange={(value) => handleChangePassword(value.target.value)}
							/>
						)}
					</div>
				</div>
				{hide === false && (
					<div className='className="w-full flex item-center justify-between gap-2 md:flex-col'>
						<LonelySelect
							value={masterData?.salaryRateRequest?.compensationType}
							options={COMPENSATION_TYPE}
							onChange={(e) =>
								setMasterData((prevState: any) => ({
									...prevState,
									salaryRateRequest: {
										amount: masterData?.salaryRateRequest?.amount,
										compensationType: e,
									},
								}))
							}
							isClearable={false}
							isLoading={false}
							noOptionsMessage={() => 'Нет вариантов'}
							placeholder=""
							label="Тип ставки"
							required
						/>
						<Input
							type="number"
							label="Доля"
							placeholder=""
							value={masterData?.salaryRateRequest?.amount}
							onChange={(e) =>
								setMasterData((prevState: any) => ({
									...prevState,
									salaryRateRequest: {
										amount: e.target.value,
										compensationType:
											masterData?.salaryRateRequest?.compensationType,
									},
								}))
							}
							required
						/>
					</div>
				)}
				<TextArea
					label="О специалисте"
					placeholder="О специалисте"
					value={descriptionMaster}
					onChange={(e) => setDescriptionMaster(e)}
					height="100px"
				/>
			</div>
			<div className="w-full flex items-center justify-end gap-3">
				<Button
					width="80px"
					backgroundColor="white"
					color="#acacac"
					border="1px solid #acacac"
					onClick={() => handleClose()}
				>
					Отмена
				</Button>
				<Button
					disabled={validationMaster}
					width="120px"
					onClick={() => handlePut()}
					isLoading={isLoading}
				>
					Сохранить
				</Button>
			</div>
		</ModalComponent>
	)
}
