import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	getFeedbackMaster,
	replyToFeedback,
} from '../../../../../../../store/features/feedback-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { useParams } from 'react-router-dom'
import styles from './Rewievs.module.css'
import Avatar from '@mui/material/Avatar'
import Rating from '@mui/material/Rating'
import { RootState } from '../../../../../../../store'
import { getMasterById } from '../../../../../../../store/features/master-slice'
import { ModalComponent } from '../../../../../../../components/UI/Modal/Modal'
import { TextArea } from '../../../../../../../components/UI/Inputs/TextArea/TextArea'
import { Button } from '../../../../../../../components/UI/Buttons/Button/Button'

interface feedbackDataMasterResponseProps {
	comment: string
	createdDate: string
	feedbackId: number
	images: string[]
	rating: number
	replyToFeedbackResponse: {
		answer: string
		representative: string
	}
	userResponse: {
		avatar: string
		fullName: string
		userId: number
	}
}

export const Rewievs = () => {
	const { feedbackDataMaster } = useSelector(
		(state: RootState) => state.feedback
	)

	const { dataMasterById, isLoadingMaster } = useSelector(
		(state: RootState) => state.master
	)

	const [active, setActive] = useState<boolean>(false)
	const [feedbackID, setID] = useState<number>(0)
	const [feedback, setFeedback] = useState<string>('')
	const [typeRewievs, setTypeRewievs] = useState(0)
	const [fullRewievs, setFullRewievs] = useState<any>([])
	const [col, setCol] = useState<number>(0)

	const dispatch = useDispatch()
	const { masterID } = useParams()


	useEffect(() => {
		dispatch(getFeedbackMaster({ masterID }) as unknown as AnyAction)
	}, [dispatch, masterID])

	useEffect(() => {
		switch (typeRewievs) {
			case 0:
				setFullRewievs(feedbackDataMaster?.feedbackResponses)
				break
			case 1:
				let res = feedbackDataMaster?.feedbackResponses?.filter(
					(element: any) => {
						return element.rate > 2
					}
				)
				setFullRewievs(res)
				setCol(res?.length)
				break
			case 2:
				let restik = feedbackDataMaster?.feedbackResponses?.filter(
					(element: any) => {
						return element.rate <= 2
					}
				)
				setFullRewievs(restik)
				setCol(restik?.length)
				break
		}
	}, [feedbackDataMaster?.feedbackResponses, typeRewievs])

	const typeButton = [
		{
			name: 'Все',
			value: 0,
		},
		{
			name: 'Положительные',
			value: 1,
		},
		{
			name: 'Отрицательные',
			value: 2,
		},
	]

	const handleReply = (id: any) => {
		setID(id)
		setActive(true)
	}

	const handleClose = () => {
		setFeedback('')
		setID(0)
		setActive(false)
	}

	const handlePost = async () => {
		handleClose()
		await dispatch(
			replyToFeedback({
				feedbackId: feedbackID,
				answer: feedback,
			}) as unknown as AnyAction
		)
		dispatch(getFeedbackMaster({ masterID }) as unknown as AnyAction)
		dispatch(getMasterById({ masterID }) as unknown as AnyAction)
	}

	return (
		<>
			<ModalComponent
				title="Ответить на отзыв"
				active={active}
				handleClose={handleClose}
			>
				<div className="min-w-[300px]  ">
					<TextArea
						value={feedback}
						placeholder="ответ на отзыв"
						onChange={setFeedback}
					/>
					<div className="w-full flex justify-end mt-2">
						<Button onClick={handlePost}>Отправить</Button>
					</div>
				</div>
			</ModalComponent>
			<div className={styles.container_rewiev}>
				<div className={styles.card_full_rewiev}>
					<div className={styles.card_full_inside_rewiev}>
						<span>Рейтинг:{dataMasterById?.rating?.toFixed(2) || 0}</span>
						<span>
							{
								feedbackDataMaster?.feedbackResponses?.filter(
									(item: any) => item.rate > 0
								).length
							}
							&nbsp;оценки
						</span>
					</div>
					<Rating
						name="text-feedback"
						readOnly
						value={dataMasterById?.rating || 0}
						size={window.innerWidth < 451 ? 'medium' : 'large'}
						precision={0.5}
					/>
				</div>
				<div className={styles.container_rewievs}>
					<div className={styles.container_header_rewievs}>
						{feedbackDataMaster?.feedbackResponses?.length !== 0 && (
							<div className={styles.header_rewievs_button_container}>
								{typeButton.map(
									(item: { name: string; value: number }, index: number) => {
										return (
											<div
												key={item.value}
												onClick={() => setTypeRewievs(item.value)}
												className={
													item.value === typeRewievs
														? styles.container_header_rewievs_button_active
														: styles.container_header_rewievs_button_notactive
												}
											>
												{item.name} {index === typeRewievs && col}
											</div>
										)
									}
								)}
							</div>
						)}
						<div className={styles.title_header_reiwievs}>
							{feedbackDataMaster?.feedbackResponses?.length} отзывов
						</div>
					</div>
					<div className={styles.rewievs_container}>
						{fullRewievs?.map((item: any) => {
							const originalDate = new Date(item.createdDate)
							const russianDate = originalDate.toLocaleDateString('ru-RU', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})
							return (
								<div>
									<div key={item.feedbackId} className={styles.rewievs_card}>
										<div className={styles.rewievs_card_header}>
											<div className="flex items-start justify-between gap-2">
												<Avatar
													alt={item.userResponse.fullName}
													src={item.userResponse.avatar}
												/>
												<div className="flex flex-col">
													<span className="text-md text-gray-700">
														{item.userResponse.fullName}
													</span>
													<span className="text-sm text-gray-600">
														{russianDate}
													</span>
												</div>
											</div>
											<div className="flex flex-col gap-2">
												<Rating
													name="text-feedback"
													readOnly
													value={item.rate}
													size="small"
													precision={0.5}
												/>
												{!item.replyToFeedbackResponse.answer && (
													<button
														className="rounded bg-gray-100 text-gray-500 font-light"
														onClick={() => handleReply(item.feedbackId)}
													>
														ответить
													</button>
												)}
											</div>
										</div>
										<div className={styles.rewievs_card_main}>
											<div className="text-md text-black/80">
												{item.comment}
											</div>
											{item.images.length > 0 && (
												<div className="flex items-center gap-2 flex-wrap">
													{item.images.map((img: any) => (
														<img
															src={img}
															alt="rewievImage"
															className="rounded-md w-12 h-12 object-cover"
														/>
													))}
												</div>
											)}
											<p className="text-xs text-black/60 ml-5 font-medium">
												{item.replyToFeedbackResponse.answer && 'ответ:'}
											</p>
											<p className="text-sm text-black/70 ml-7">
												{item.replyToFeedbackResponse.answer}
											</p>
										</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}
