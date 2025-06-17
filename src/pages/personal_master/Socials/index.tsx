import { useEffect, useState } from 'react'
import { LayoutContent } from '../../../components/UI/LayoutContent'
import { StyledTitle } from '../../../shared/styles'
import { Flex } from 'antd'
import {
	usePutSocialMediaMutation,
	usePutAboutUsMutation,
} from '../../../store/services/calendar.service'
import { useGetMasterProfileQuery } from '../../../store/services/master.service'
import { Input } from '../../../components/UI/Inputs/Input/Input'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import toast from 'react-hot-toast'
import { isNumeric } from '../../../shared/lib/helpers/helpers'
import { InputNumberMask } from '../../../components/UI/Inputs/InputMask/InputMask'

export const PersonalSocials = () => {
	const { data: masterData, refetch } = useGetMasterProfileQuery()
	const [putAbout] = usePutAboutUsMutation()
	const [putSocial] = usePutSocialMediaMutation()
	const [loading, setLoading] = useState(false)
	const [load, setLoad] = useState(false)
	const [disabled1, setDisabled] = useState(true)
	const [disabled2, setDisabled2] = useState(true)

	const [about, setAbout] = useState({
		slogan: '',
		aboutUs: '',
		phoneNumber: '',
		experience: '',
	})

	const [social, setSocial] = useState({
		instagram: '',
		tiktok: '',
		youtube: '',
		whatsapp: '',
		facebook: '',
		telegram: '',
	})
	
	useEffect(() => {
		if (masterData) {
			setSocial({
				...social,
				...social,
				instagram: masterData.instagram,
				tiktok: masterData.tiktok,
				youtube: masterData.youtube,
				whatsapp: masterData?.whatsapp?.startsWith('+996')
					? masterData?.whatsapp
					: '+996',
				telegram: masterData?.telegram?.startsWith('+996')
					? masterData?.telegram
					: '+996',
			})
			setAbout({
				...about,
				experience: masterData.experience,
				slogan: masterData.slogan,
				phoneNumber: masterData.phoneNumber,
				aboutUs: masterData.description,
			})
		}
	}, [masterData])

	const handleAboutPut = async () => {
		setLoading(true)
		const response = await putAbout({
			...about,
			experience: Number(about.experience),
		})
		toast.success('Профиль успешно изменен')
		refetch()
		setLoading(false)
	}

	const handleSocialPut = async () => {
		setLoad(true)
		const response = await putSocial(social)
		toast.success('Соц сети успешно изменены')
		refetch()
		setLoad(false)
	}

	useEffect(() => {
		if (
			masterData?.slogan === about?.slogan &&
			masterData?.description === about?.aboutUs &&
			masterData?.experience === Number(about?.experience)
		) {
			setDisabled(true)
		} else {
			setDisabled(false)
		}
		if (
			social?.instagram === masterData?.instagram &&
			social.tiktok === masterData?.tiktok &&
			social.youtube === masterData?.youtube &&
			social.whatsapp === masterData?.whatsapp &&
			social.telegram === masterData?.telegram
		) {
			setDisabled2(true)
		} else {
			setDisabled2(false)
		}
	}, [about, social])

	return (
		<div className="">
			<LayoutContent>
				<StyledTitle>Информация</StyledTitle>
				<Flex gap={10}>
					<Input
						value={about.aboutUs}
						label="О себе"
						placeholder="Напишите о себе"
						onChange={(e) => setAbout({ ...about, aboutUs: e.target.value })}
					/>
					<Input
						value={about.slogan}
						label="Слоган"
						placeholder="Напишите слоган"
						onChange={(e) => setAbout({ ...about, slogan: e.target.value })}
					/>
					<Input
						value={about.experience}
						label="Стаж"
						placeholder="Напишите стаж в годах"
						onChange={(e) => {
							if (isNumeric(e.target.value) || e.target.value === '') {
								setAbout({ ...about, experience: e.target.value })
							}
						}}
					/>
				</Flex>
				<Flex className="mt-4" justify="end">
					<Button
						disabled={disabled1}
						onClick={handleAboutPut}
						width="150px"
						isLoading={loading}
					>
						Сохранить
					</Button>
				</Flex>
			{/* </LayoutContent>
			<LayoutContent> */}
				<StyledTitle>Соц сети</StyledTitle>
				<Flex vertical className="mb-4" gap={10}>
					<Flex gap={10}>
						<Input
							value={social.instagram}
							label="Instagram"
							placeholder="Вставьте полную ссылку Instagram"
							onChange={(e) =>
								setSocial({ ...social, instagram: e.target.value })
							}
						/>
						<Input
							value={social.tiktok}
							label="Tik-tok"
							placeholder="Вставьте полную ссылку Tik-tok"
							onChange={(e) => setSocial({ ...social, tiktok: e.target.value })}
						/>
					</Flex>
					<Flex gap={10}>
						<Input
							value={social.youtube}
							label="You-Tube"
							placeholder="Вставьте полную ссылку You-tube"
							onChange={(e) =>
								setSocial({ ...social, youtube: e.target.value })
							}
						/>
						<InputNumberMask
							value={social.whatsapp}
							label="Whatsapp"
							onChange={(e) => setSocial({ ...social, whatsapp: e })}
						/>
						<InputNumberMask
							value={social.telegram}
							label="Telegram"
							onChange={(e) => setSocial({ ...social, telegram: e })}
						/>
					</Flex>
				</Flex>
				<Flex justify="end">
					<Button
						disabled={disabled2}
						onClick={handleSocialPut}
						width="150px"
						isLoading={load}
					>
						Сохранить
					</Button>
				</Flex>
			</LayoutContent>
		</div>
	)
}
