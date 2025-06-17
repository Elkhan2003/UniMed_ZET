import { FC, useState } from 'react'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { usePostCountrySettingMutation } from '../../../../store/services/country.service'
import toast from 'react-hot-toast'
import { Input } from '../../../../components/UI/Inputs/Input/Input'

interface ModalProps {
	active: boolean
	handleClose: () => void
	refetch: () => void
	type: 'COUNTRY' | 'REGION' | 'DISTRICT' | 'RESIDENTIAL_AREA'
	title: string
	placeholderName: string
}

const Modals: FC<ModalProps> = ({
	active,
	handleClose,
	refetch,
	type,
	title,
	placeholderName,
}) => {
	const [name, setName] = useState<string>('')
	const [latitude, setLatitude] = useState<string>('')
	const [longitude, setLongitude] = useState<string>('')

	const [postUnit] = usePostCountrySettingMutation()

	const handlePostUnit = async () => {
		if (!name || !latitude || !longitude) {
			toast.error('Бардык талааларды толтуруңуз')
			return
		}
		try {
			const response = await postUnit({
				body: {
					name,
					latitude: parseFloat(latitude),
					longitude: parseFloat(longitude),
					geographicUnitType: type,
				},
			}).unwrap()

			toast.success(`${title} успешно добавлен`)
			refetch()
		} catch (error: any) {
			console.error('Error:', error)
			toast.error(`Ошибка: ${error.data?.message || error.message}`)
		}
		handleClose()
		setName('')
		setLatitude('')
		setLongitude('')
	}

	return (
		<ModalComponent
			handleClose={handleClose}
			active={active}
			title={`Добавить ${title}`}
		>
			<div className="w-[300px] flex flex-col gap-4">
				<Input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder={`${placeholderName} `}
					label={title}
				/>
				<Input
					type="number"
					value={latitude}
					onChange={(e) => setLatitude(e.target.value)}
					placeholder="Широта"
					label="Широта"
				/>
				<Input
					type="number"
					value={longitude}
					onChange={(e) => setLongitude(e.target.value)}
					placeholder="Долгота"
					label="Долгота"
				/>
				<p>{type}</p>
				<button
					className={`w-full min-w-[100px] h-[37px] max-h-[37px] rounded-[9px] 
              bg-[var(--myadmin)] text-white font-normal text-[14px] 
              flex items-center justify-center gap-[5px] cursor-pointer 
              outline-none transition ease-in-out duration-100 
              font-[Involve] hover:bg-[var(--myadmin)] 
              disabled:cursor-not-allowed disabled:text-[var(--ui-disabled-color)] 
              disabled:bg-[var(--ui-disabled--background)]`}
					onClick={handlePostUnit}
					disabled={!name || !latitude || !longitude}
				>
					Добавить {title}
				</button>
			</div>
		</ModalComponent>
	)
}

export default Modals
