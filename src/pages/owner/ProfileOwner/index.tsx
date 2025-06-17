import React, { useCallback, useEffect, useState } from 'react'
import { RootState } from '../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { TypeCompanyGenrate } from '../../../shared/lib/helpers/helpers'
import { useDropzone } from 'react-dropzone'
import { putCompaniesLogo } from '../../../store/slices/company.slice'
import {
	useChangeOwnerMutation,
	useLazyGetCompanyCurrentQuery,
} from '../../../store/queries/company.service'
import { AnyAction } from '@reduxjs/toolkit'
import { Backdrop, CircularProgress } from '@mui/material'
import { isLoadingSx } from '../../../shared/lib/constants/constants'
import { InoiInput } from '../../../components/UI/input'
import { Flex } from 'antd'
import { InputNumberMask } from '../../../components/UI/Inputs/InputMask/InputMask'
import { TextArea } from '../../../components/UI/Inputs/TextArea/TextArea'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { usePutSocialMediaMutation } from '../../../store/services/calendar.service'
import { ReactComponent as WhatsappIcon } from '../../../assets/icons/WhatsApp.svg'
import { ReactComponent as Tiktok } from '../../../assets/icons/TikTok.svg'
import { ReactComponent as Instagram } from '../../../assets/icons/Instagram.svg'
import { ReactComponent as Facebook } from '../../../assets/icons/ Facebook.svg'
import { ReactComponent as Youtube } from '../../../assets/icons/Youtube.svg'
import { ReactComponent as Telegram } from '../../../assets/icons/Telegram.svg'
import companyService from '../../../store/queries/company.service'
import toast from 'react-hot-toast'
import axiosInstance from '../../../shared/api/axios-config'

const editSx: Record<
	string,
	{
		helpText: string
		placeholder: string
		icon: React.ReactNode
		title: string
	}
> = {
	telegram: {
		helpText:
			'Добавьте Telegram номер если ваш гланый номер не привязан к вашему аккаунту',
		placeholder: '+996',
		icon: <Telegram className="w-[24px] h-[24px]" />,
		title: 'Telegram',
	},
	instagram: {
		helpText:
			'Добавьте ссылку на Instagram. Клиенты будут переходить по ней на вашу страничку.',
		placeholder: 'https://www.instagram.com/your_username',
		icon: <Instagram />,
		title: 'Instagram',
	},
	facebook: {
		helpText:
			'Добавьте ссылку на Facebook. Клиенты будут переходить по ней на вашу страничку.',
		placeholder: 'https://www.facebook.com/your_username',
		icon: <Facebook />,
		title: 'Facebook',
	},
	youtube: {
		helpText:
			'Добавьте ссылку на YouTube. Клиенты будут переходить по ней на вашу страничку.',
		placeholder: 'https://www.youtube.com/your_username',
		icon: <Youtube />,
		title: 'YouTube',
	},
	tiktok: {
		helpText:
			'Добавьте ссылку на TikTok. Клиенты будут переходить по ней на вашу страничку.',
		placeholder: 'https://www.tiktok.com/@your_username ',
		icon: <Tiktok />,
		title: 'TikTok',
	},
	whatsapp: {
		helpText:
			'Добавьте WhatsApp номер если ваш гланый номер не привязан к вашему аккаунту',
		placeholder: '+996',
		icon: <WhatsappIcon className="w-[28px] h-[28px]" />,
		title: 'WhatsApp',
	},
}

const ProfileOwner = () => {
	const { ownerData } = useSelector((state: RootState) => state.ownerCompany)
	const [loading, setLoading] = useState(false)
	const [isEdit, setIsEdit] = useState(0)
	const [companyCurrent] = companyService.useLazyGetCompanyCurrentQuery()
	const dispatch = useDispatch()

	const [changeOwner] = useChangeOwnerMutation()
	const [changeSocial] = usePutSocialMediaMutation()

	const [ownerState, setOwnerState] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
	})

	const [aboutState, setAboutState] = useState({
		experience: 0,
		slogan: '',
		aboutUs: '',
		phoneNumber: '',
		companyName: '',
	})

	const [socialState, setSocialState] = useState<Record<string, string>>({
		instagram: '',
		facebook: '',
		telegram: '',
		youtube: '',
		tiktok: '',
		whatsapp: '',
	})

	useEffect(() => {
		if (ownerData) {
			setOwnerState({
				firstName: ownerData?.firstName,
				lastName: ownerData?.lastName,
				email: ownerData?.email || '',
				password: '',
			})
			setAboutState({
				phoneNumber: ownerData?.phoneNumber,
				slogan: ownerData?.slogan,
				aboutUs: ownerData?.aboutAs || '',
				experience: 0,
				companyName: ownerData?.name,
			})
			setSocialState({
				instagram: ownerData?.instagram || '',
				facebook: ownerData?.facebook || '',
				telegram: ownerData?.telegram || '',
				youtube: ownerData?.youtube || '',
				tiktok: ownerData?.tiktok || '',
				whatsapp: ownerData?.whatsapp || '',
			})
		}
	}, [ownerData])

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			setLoading(true)
			try {
				await dispatch(
					putCompaniesLogo({
						companyId: ownerData?.id,
						avatar: acceptedFiles[0],
					}) as unknown as AnyAction
				)
			} catch (err) {
				console.error('Error while uploading avatar:', err)
			} finally {
				await companyCurrent()
				setLoading(false)
			}
		},
		[dispatch, ownerData?.id]
	)

	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	const handleChangeAbout = async () => {
		try {
			const response: any = await axiosInstance.put(
				`/companies/about`,
				aboutState
			)
			if ('error' in response) {
				toast.error(
					response.error?.data?.message || 'Ошибка при обновлении данных'
				)
			} else {
				toast.success('Данные успешно обновлены')
			}
		} catch (err: any) {
			toast.error(
				err?.response?.data?.message || 'Ошибка при обновлении данных!'
			)
		}
	}

	const handleChangeOwner = async () => {
		try {
			const result = await changeOwner(ownerState)
			if ('error' in result) {
				toast.error(
					'Ошибка при обновлении данных:',
					result.error?.data?.message
				)
			} else {
				toast.success('Данные успешно обновлены')
			}
		} catch (err: any) {
			toast.error('Ошибка при обновлении данных:', err?.data?.message)
		}
	}

	const handleChangeSocial = async () => {
		try {
			const result = await changeSocial(socialState)
			if ('error' in result) {
				toast.error(
					'Ошибка при обновлении данных:',
					result.error?.data?.message
				)
			} else {
				toast.success('Данные успешно обновлены')
			}
		} catch (err: any) {
			toast.error('Ошибка при обновлении данных:', err?.data?.message)
		}
	}

	const handleSaveSocials = async () => {
		setLoading(true)
		await handleChangeSocial()
		await companyCurrent()
		setLoading(false)
	}

	const handleSaveAbout = async () => {
		setLoading(true)
		await handleChangeAbout()
		await companyCurrent()
		setLoading(false)
	}

	const handleSaveOwner = async () => {
		setLoading(true)
		await handleChangeOwner()
		await companyCurrent()
		setLoading(false)
	}

	return (
		<>
			<Backdrop sx={isLoadingSx} open={loading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<div className="w-full h-[calc(100vh-45px)] p-4 overflow-y-auto">
				<div className="w-full h-[180px] relative rounded-[16px] overflow-hidden shadow-md bg-myviolet">
					<div className="absolute right-0 left-0 bottom-0 h-[100px] w-full rounded-2xl bg-white">
						<div className="ml-20 mt-[-70px] rounded-full w-[150px] h-[150px] bg-white p-2">
							<div
								className="relative w-full h-full rounded-full"
								{...getRootProps()}
							>
								<input
									className="w-full h-full rounded-full"
									{...getInputProps()}
								/>
								<img
									className="w-full h-full rounded-full border-[1px] object-cover"
									src={ownerData?.logo}
									alt={ownerData?.name}
								/>
							</div>
						</div>
					</div>
					<div className="absolute bottom-0 left-[250px] h-[80px]">
						<p className="text-[20px]">{ownerData?.name}</p>
						<p className="text-[16px]">
							{TypeCompanyGenrate(ownerData?.category || '')}
						</p>
					</div>
				</div>
				<Flex
					vertical
					gap={8}
					className="w-full h-fit relative rounded-[16px] overflow-hidden shadow-md px-8 py-4 mt-4 bg-white"
				>
					<InoiInput
						required
						value={aboutState.companyName}
						onChange={(e: any) =>
							setAboutState({ ...aboutState, companyName: e.target.value })
						}
						title="Название компании"
						error=""
					/>
					<InputNumberMask
						required
						value={aboutState.phoneNumber}
						onChange={(e: any) =>
							setAboutState({ ...aboutState, phoneNumber: e })
						}
						label="Телефон"
					/>
					<InoiInput
						value={aboutState.slogan}
						onChange={(e: any) =>
							setAboutState({ ...aboutState, slogan: e.target.value })
						}
						title="Слоган"
					/>
					<TextArea
						placeholder=""
						value={aboutState.aboutUs}
						onChange={(e: any) => setAboutState({ ...aboutState, aboutUs: e })}
						label="О нас"
					/>
					<Flex gap={8} justify="space-between">
						<Button
							onClick={handleSaveAbout}
							disabled={
								!(
									aboutState.companyName?.length > 0 &&
									aboutState.phoneNumber?.length > 9
								)
							}
						>
							Сохранить
						</Button>
					</Flex>
					<InoiInput
						required
						value={ownerState.firstName}
						onChange={(e: any) =>
							setOwnerState({ ...ownerState, firstName: e.target.value })
						}
						title="Имя"
						error=""
					/>
					<InoiInput
						value={ownerState.lastName}
						onChange={(e: any) =>
							setOwnerState({ ...ownerState, lastName: e.target.value })
						}
						title="Фамилия"
					/>
					<InoiInput
						value={ownerState.email}
						onChange={(e: any) =>
							setOwnerState({ ...ownerState, email: e.target.value })
						}
						title="Email"
					/>
					<InoiInput
						value={ownerState.password}
						onChange={(e: any) =>
							setOwnerState({ ...ownerState, password: e.target.value })
						}
						placeholder="Напишите новый пароль"
						title="Пароль"
					/>
					<Flex gap={8} justify="space-between">
						<Button onClick={handleSaveOwner} disabled={!ownerState?.firstName}>
							Сохранить
						</Button>
					</Flex>
					<div className="grid grid-cols-2 gap-4">
						{Object.keys(socialState).map((key, index) => (
							<div
								style={{ borderBottom: '1px solid gainsboro' }}
								key={key}
								className="pb-4"
							>
								<p className="text-[14px]">{editSx[key].helpText}</p>
								<Flex align="end" justify="space-between" gap={8}>
									{isEdit === index + 1 ? (
										<InoiInput
											value={socialState[key] || ''}
											onChange={(e: any) =>
												setSocialState({
													...socialState,
													[key]: e.target.value,
												})
											}
											placeholder={editSx[key].placeholder}
											title={editSx[key].title}
										/>
									) : (
										<Flex align="center" gap={8}>
											{editSx[key].icon}
											<p>{editSx[key].title}</p>
										</Flex>
									)}
									{isEdit !== index + 1 && (
										<Button
											height="40px"
											minWidth="120px"
											width="120px"
											backgroundColor="var(--myviolet)"
											onClick={() => setIsEdit(index + 1)}
										>
											Добавить
										</Button>
									)}
								</Flex>
							</div>
						))}
					</div>
					<Flex gap={8} justify="space-between">
						<Button>Отменить</Button>
						<Button onClick={handleSaveSocials}>Сохранить</Button>
					</Flex>
				</Flex>
			</div>
		</>
	)
}

export default ProfileOwner
