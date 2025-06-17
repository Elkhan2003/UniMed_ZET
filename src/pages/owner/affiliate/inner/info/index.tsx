import { useEffect, useState } from 'react'
import { useGetCopmanyOwnerQuery } from '../../../../../store/services/branch.service'
import { StyledTitle } from '../../../../../shared/styles'
import { Flex } from 'antd'
import {
	usePutSocialMediaMutation,
	usePutAboutUsMutation,
} from '../../../../../store/services/calendar.service'
import { Input } from '../../../../../components/UI/Inputs/Input/Input'
import { Button } from '../../../../../components/UI/Buttons/Button/Button'
import toast from 'react-hot-toast'
import { InputNumberMask } from '../../../../../components/UI/Inputs/InputMask/InputMask'

export const Info = () => {
	const { data, refetch } = useGetCopmanyOwnerQuery()
	const [putAbout] = usePutAboutUsMutation()
	const [putSocial] = usePutSocialMediaMutation()
	const [loading, setLoading] = useState(false)
	const [load, setLoad] = useState(false)
	const [disabled1, setDisabled] = useState(false)
	const [disabled2, setDisabled2] = useState(false)

	const [about, setAbout] = useState({
		slogan: '',
		aboutUs: '',
		phoneNumber: '',
		experience: 0,
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
		if (data) {
			setSocial({
				...social,
				instagram: data.instagram,
				tiktok: data.tiktok,
				youtube: data.youtube,
				whatsapp: data.whatsapp?.startsWith('+996') ? data.whatsapp : '+996',
				telegram: data.telegram?.startsWith('+996') ? data.telegram : '+996',
			})
			setAbout({
				...about,
				slogan: data.slogan,
				phoneNumber: data.phoneNumber,
				aboutUs: data.aboutAs,
			})
		}
	}, [data])

	useEffect(() => {
		if (data?.slogan === about?.slogan && data?.aboutAs === about?.aboutUs) {
			setDisabled(true)
		} else {
			setDisabled(false)
		}
		if (
			social?.instagram === data?.instagram &&
			social.tiktok === data?.tiktok &&
			social.youtube === data?.youtube &&
			social.whatsapp === data?.whatsapp &&
			social.telegram === data?.telegram
		) {
			setDisabled2(true)
		} else {
			setDisabled2(false)
		}
	}, [about, social])

	const handleAboutPut = async () => {
		setLoading(true)
		const response = await putAbout(about)
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

	return (
		<div className="">
			<StyledTitle>Информация</StyledTitle>
			<Flex vertical gap={10}>
				<Input
					value={about.aboutUs}
					label="О компании"
					placeholder="Напишите о компании"
					onChange={(e) => setAbout({ ...about, aboutUs: e.target.value })}
				/>
				<Input
					value={about.slogan}
					label="Слоган"
					placeholder="Напишите слоган"
					onChange={(e) => setAbout({ ...about, slogan: e.target.value })}
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
			<StyledTitle>Соц сети</StyledTitle>
			<Flex vertical className="mb-4" gap={10}>
				<Flex gap={10}>
					<Input
						value={social.instagram}
						label="Instagram"
						placeholder="..."
						onChange={(e) =>
							setSocial({ ...social, instagram: e.target.value })
						}
					/>
					<Input
						value={social.tiktok}
						label="Tik-tok"
						placeholder="..."
						onChange={(e) => setSocial({ ...social, tiktok: e.target.value })}
					/>
				</Flex>
				<Flex gap={10}>
					<Input
						value={social.youtube}
						label="You-Tube"
						placeholder="..."
						onChange={(e) => setSocial({ ...social, youtube: e.target.value })}
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
		</div>
	)
}
