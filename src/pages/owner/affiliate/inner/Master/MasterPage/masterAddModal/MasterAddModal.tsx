import { ModalComponent } from '../../../../../../../components/UI/Modal/Modal'
import { Input } from '../../../../../../../components/UI/Inputs/Input/Input'
import { InputPassword } from '../../../../../../../components/UI/Inputs/InputPassword/InputPassword'
import { Button } from '../../../../../../../components/UI/Buttons/Button/Button'
import { InputNumberMask } from '../../../../../../../components/UI/Inputs/InputMask/InputMask'
import { useParams } from 'react-router-dom'
import { usePostMasterMutation } from '../../../../../../../store/services/master.service'
import toast from 'react-hot-toast'
import { LonelySelect } from '../../../../../../../components/UI/Selects/LonelySelect/LonelySelect'
import { COMPENSATION_TYPE } from '../../../../../../../shared/lib/constants/constants'
import { Flex } from 'antd'
import { filterAllowedNumbers } from '../../../../../../../shared/lib/helpers/helpers'
import { useState } from 'react'

export const MasterAddModal = ({
	masterData,
	setMasterData,
	masterModal,
	setMasterModal,
	validationMaster,
}: any) => {
	const { id } = useParams()
	const [loading, setLoading] = useState(false)

	const [postMaster] = usePostMasterMutation()

	function handleClose() {
		setMasterModal({
			masterModalAdd: false,
			masterModalUpdate: false,
		})
		setMasterData({
			firstName: '',
			lastName: '',
			experience: '',
			authInfoRequest: {
				phoneNumber: '+996',
				password: '',
			},
			salaryRateRequest: {
				amount: '',
				compensationType: { label: 'Фиксированный', value: 'FIXED' },
			},
		})
	}

	async function handlePost() {
		try {
			setLoading(true)
			const response: any = await postMaster({
				branchId: Number(id),
				masterData: {
					...masterData,
					salaryRateRequest: {
						amount: masterData.salaryRateRequest.amount,
						compensationType:
							masterData.salaryRateRequest.compensationType.value,
					},
				},
			})
			if (response['error']) {
				toast.error(response?.error?.data?.message || 'Произошла ошибка')
			} else {
				toast.success('Специалист успешно сохранен')
			}
			setLoading(false)
			handleClose()
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setLoading(false)
			handleClose()
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
			active={masterModal.masterModalAdd}
			handleClose={handleClose}
			title="Добавить Специалиста"
		>
			<Flex vertical gap={5} className="w-[450px]">
				<Flex gap={5}>
					<Input
						label="Имя"
						placeholder="Имя"
						value={masterData.firstName}
						onChange={(value) => handleChangeFirsName(value.target.value)}
						required
					/>
					<Input
						label="Фамилия"
						placeholder="Фамилия"
						value={masterData.lastName}
						onChange={(value) => handleChangeLastName(value.target.value)}
						required
					/>
				</Flex>
				<Flex gap={5}>
					<InputNumberMask
						label="Номер"
						value={masterData.authInfoRequest.phoneNumber}
						onChange={(value) => handleChangePhoneNumber(value)}
						required
					/>
					<InputPassword
						label="Пароль"
						placeholder="Пароль (мин. 6 символов)"
						value={masterData.authInfoRequest.password}
						onChange={(value) => handleChangePassword(value.target.value)}
						required
					/>
				</Flex>
				<Flex gap={5}>
					<LonelySelect
						value={masterData.salaryRateRequest.compensationType}
						options={COMPENSATION_TYPE}
						onChange={(e) =>
							setMasterData((prevState: any) => ({
								...prevState,
								salaryRateRequest: {
									amount: masterData.salaryRateRequest.amount,
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
						label="Доля"
						placeholder=""
						value={masterData.salaryRateRequest.amount}
						onChange={(e) => {
							setMasterData((prevState: any) => ({
								...prevState,
								salaryRateRequest: {
									amount: Number(filterAllowedNumbers(e.target.value)),
									compensationType:
										masterData.salaryRateRequest.compensationType,
								},
							}))
						}}
						required
					/>
					<Input
						label="Стаж"
						placeholder="Опыт в годах"
						value={masterData.salaryRateRequest.experience}
						onChange={(e) => {
							setMasterData((prevState: any) => ({
								...prevState,
								experience: Number(filterAllowedNumbers(e.target.value)),
							}))
						}}
					/>
				</Flex>
			</Flex>
			<div className="mt-3 w-full flex justify-end items-center gap-3">
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
					disabled={
						validationMaster || masterData.authInfoRequest.password.length < 6
					}
					width="120px"
					onClick={() => handlePost()}
					isLoading={loading}
				>
					Сохранить
				</Button>
			</div>
		</ModalComponent>
	)
}
