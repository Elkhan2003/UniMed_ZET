import styles from './styled.module.css'
import { useEffect, useState } from 'react'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { RootState } from '../../../../store'
import { useDispatch, useSelector } from 'react-redux'
import { IconButton } from '@mui/material'
import { MdDeleteOutline } from 'react-icons/md'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { AnyAction } from '@reduxjs/toolkit'
import {
	deleteAmenity,
	getAmenity,
	postAmenity,
	putAmenity,
} from '../../../../store/features/amenity-slice'
import { ImagePicker } from '../../../../components/UI/ImagePicker/ImagePicker'
import { BsPencilSquare } from 'react-icons/bs'

export const FacilitiesSuper = () => {
	const { amenity } = useSelector((state: RootState) => state.amenity)
	const dispatch = useDispatch()

	const [getImage, setGetImage] = useState<any>()
	const [value, setValue] = useState({
		name: '',
		icon: '',
	})

	const [showDeleteMdoal, setShowDeleteModal] = useState(false)
	const [editDeleteMdoal, seteditDeleteModal] = useState(false)
	const [single, setSingle] = useState({
		name: '',
		id: null,
		icon: '',
	})

	useEffect(() => {
		dispatch(getAmenity() as unknown as AnyAction)
	}, [])

	// ! DELLTE
	const deleteModal = (item: any) => {
		setSingle({ name: item.name, id: item.id, icon: item.icon })
		setShowDeleteModal(true)
	}

	const editModal = (item: any) => {
		setGetImage(item.icon)
		setSingle({ name: item.name, id: item.id, icon: item.icon })
		seteditDeleteModal(true)
	}

	// ! POST
	const postHanler = () => {
		if (!getImage) {
			console.error('Файл not foue.')
			return
		}

		dispatch(
			postAmenity({ name: value.name, icon: getImage }) as unknown as AnyAction
		)
		setValue({ name: '', icon: '' })
	}

	// !EDIT
	const editHandler = () => {
		const data = {
			icon: getImage || single.icon,
			name: single.name,
			id: single.id,
		}
		dispatch(putAmenity(data) as unknown as AnyAction)
		seteditDeleteModal(false)
		setGetImage(null)
	}

	const closeEdit = () => {
		seteditDeleteModal(false)
		setGetImage(null)
		setSingle({ name: '', id: null, icon: '' })
	}
	const closeDelete = () => {
		setShowDeleteModal(false)
		setGetImage(null)
	}

	const [validation, setValidation] = useState(false)

	useEffect(() => {
		setValidation(value.name.length >= 3 && true)
	}, [value])

	return (
		<div className={styles.wrapper}>
			<div className={styles.wrapper_cards}>
				{amenity?.map(
					(item: { id: number; name: string; icon: string }, index: number) => (
						<div className={styles.card} key={item.id}>
							<div className={styles.wrapper_name}>
								{/* <span>{index + 1}. </span> */}
								<img className={styles.icon} src={item.icon} alt="icon" />{' '}
								<span>{item.name}</span>
							</div>
							<div className={styles.wrapper_icons}>
								<IconButton onClick={() => editModal(item)}>
									<BsPencilSquare
										className="text-myadmin cursor-pointer"
										fontSize={20}
									/>
								</IconButton>
								<IconButton onClick={() => deleteModal(item)}>
									<MdDeleteOutline
										className="text-myadmin cursor-pointer"
										fontSize={22}
									/>
								</IconButton>
							</div>
						</div>
					)
				)}
			</div>
			<ModalComponent
				active={editDeleteMdoal}
				handleClose={() => seteditDeleteModal(false)}
			>
				<ImagePicker value={getImage} setValue={setGetImage} />
				<Input
					label="Удобства"
					value={single.name}
					onChange={(e) => setSingle({ ...single, name: e.target.value })}
				/>
				<div className={styles.wrapper_button}>
					<Button backgroundColor="black" color='white' type="cancel" onClick={() => closeEdit()}>
						Отменить
					</Button>
					<Button backgroundColor="#5865F2" color="white" onClick={editHandler}>
						Изменить
					</Button>
				</div>
			</ModalComponent>

			<ModalComponent
				active={showDeleteMdoal}
				title="Вы точно хотите удалить?"
				handleClose={() => setShowDeleteModal(false)}
			>
				<div className="flex items-center gap-5 p-5 bg-gray-50 rounded-lg">
					<Button
						backgroundColor="black"
						color="white"
						onClick={() => setShowDeleteModal(false)}
						type="cancel"
					>
						Отменить
					</Button>
					<Button
						backgroundColor="#5865F2"
						onClick={() =>
							dispatch(deleteAmenity(single.id) as unknown as AnyAction) &&
							closeDelete()
						}
					>
						Да
					</Button>
				</div>
			</ModalComponent>

			<div className={styles.wrapper_input}>
				<ImagePicker value={getImage} setValue={setGetImage} />

				<Input
					label="Удобства"
					value={value.name}
					onChange={(e) => setValue({ ...value, name: e.target.value })}
				/>
				<button
					className={`w-full min-w-[100px] h-[37px] max-h-[37px] rounded-[9px] 
														bg-[var(--myadmin)] text-white font-normal text-[14px] 
														flex items-center justify-center gap-[5px] cursor-pointer 
														outline-none transition ease-in-out duration-100 
														font-[Involve] hover:bg-[var(--myadmin)] 
														disabled:cursor-not-allowed disabled:text-[var(--ui-disabled-color)] 
														disabled:bg-[var(--ui-disabled--background)]`}
					disabled={!validation || !value.name}
					onClick={() => postHanler()}
				>
					Создать
				</button>
			</div>
		</div>
	)
}
