import React, { useEffect, useState } from 'react'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { Input } from '../../../components/UI/Inputs/Input/Input'
import { ModalComponent } from '../../../components/UI/Modal/Modal'
import styles from './BonusPage.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '../../../store'
import { getOwnerProfile } from '../../../store/features/owner-slice'
import {
	postCashBack,
	getCashBack,
	deleteCashBack,
	editCashBack,
} from '../../../store/features/cashback-slice'
import { Flex } from 'antd'
import DeleteIcon from '@mui/icons-material/Delete'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'
import { TextArea } from '../../../components/UI/Inputs/TextArea/TextArea'
import { LayoutContent } from '../../../components/UI/LayoutContent'
import { StyledTitle } from '../../../shared/styles'

export interface YourType {
	id: number
	totalSum: number
	bonusName: string
	comment: string
	percent: number
	companyId: number
	createdAt: Date
}

const BonusPage = () => {
	const dispatch = useDispatch()

	const { ownerProfile, loading } = useSelector(
		(state: RootState) => state.owner
	)
	const { cashbackData, cashbackLoading } = useSelector(
		(state: RootState) => state.cashback
	)

	const [postData, setPostData] = useState<any>({
		totalSum: '',
		bonusName: '',
		comment: '',
		percent: '',
	})

	const [open, setOpen] = useState<boolean>(false)
	const [edit, setEdit] = useState<boolean>(false)
	const [editID, setEditID] = useState<number>(-1)
	const [editData, setEditData] = useState<any>({
		totalSum: 0,
		bonusName: '',
		comment: '',
		percent: 0,
	})
	const handleClose = () => {
		setOpen(false)
		setPostData({
			totalSum: '',
			bonusName: '',
			percent: '',
			comment: '',
		})
	}

	useEffect(() => {
		dispatch(getOwnerProfile() as unknown as AnyAction)
	}, [])

	useEffect(() => {
		if (ownerProfile) {
			dispatch(
				getCashBack({
					companyId: ownerProfile.companyId,
				}) as unknown as AnyAction
			)
		}
	}, [ownerProfile])

	const handlePost = async () => {
		await dispatch(
			postCashBack({
				datas: {
					...postData,
					totalSum: Number(postData.totalSum),
					percent: Number(postData.percent),
				},
			}) as unknown as AnyAction
		)
		await dispatch(getOwnerProfile() as unknown as AnyAction)
		handleClose()
	}

	const handleDelete = async (id: number) => {
		await dispatch(deleteCashBack({ cashbackId: id }) as unknown as AnyAction)
		await dispatch(
			getCashBack({ companyId: ownerProfile.companyId }) as unknown as AnyAction
		)
	}

	const validate =
		!postData.totalSum || !postData.bonusName || !postData.percent

	const editValidate =
		!editData.totalSum || !editData.bonusName || !editData.percent

	const BREAD_CRUMBS_BONUS = [
		{
			name: 'Бонусы',
			to: '/bonus',
			isLoading: cashbackLoading,
			path: 1,
		},
	]

	const hadnleEditClick = (res: any) => {
		setEditID(res.id)
		setEditData({
			totalSum: res.totalSum,
			bonusName: res.bonusName,
			comment: res.comment === null ? '' : res.comment,
			percent: res.percent,
		})
		setEdit(true)
	}

	const handleCreate = () => {
		setEdit(false)
		setEditData({
			totalSum: 0,
			bonusName: '',
			comment: '',
			percent: 0,
		})
		setOpen(true)
	}

	const hadnleReset = () => {
		setEdit(false)
		setEditID(-1)
		setEditData({
			totalSum: 0,
			bonusName: '',
			comment: '',
			percent: 0,
		})
	}

	const handleChangeEdit = async () => {
		await dispatch(
			editCashBack({
				datas: editData,
				cashbackId: editID,
			}) as unknown as AnyAction
		)
		await dispatch(
			getCashBack({ companyId: ownerProfile.companyId }) as unknown as AnyAction
		)
		hadnleReset()
	}

	return (
		<div>
			<ModalComponent
				active={open}
				title="Создать Бонус"
				handleClose={handleClose}
			>
				<div className={styles.main_wrapper}>
					<Input
						label="Имя бонуса"
						value={postData.bonusName}
						onChange={(e) =>
							setPostData({ ...postData, bonusName: e.target.value })
						}
					/>
					<div className={styles.inner_wrapper}>
						<Input
							label="Сумма до"
							placeholder="0"
							type="number"
							value={postData.totalSum}
							onChange={(e) =>
								setPostData({ ...postData, totalSum: e.target.value })
							}
						/>
						<Input
							label="Скидка %"
							placeholder="0"
							type="number"
							value={postData.percent}
							onChange={(e) =>
								setPostData({
									...postData,
									percent:
										Number(e.target.value) > 100 ? '100' : e.target.value,
								})
							}
						/>
					</div>
					<TextArea
						label="Комментарий"
						placeholder="Оставьте Комментарий"
						value={postData.comment}
						onChange={(e) => setPostData({ ...postData, comment: e })}
					/>
					<div className={styles.button_wrapper}>
						<Button onClick={handlePost} disabled={validate} width="120px">
							Создать
						</Button>
					</div>
				</div>
			</ModalComponent>
			<LayoutContent>
				<Flex justify="space-between" align='center' >
					<StyledTitle>Бонусы</StyledTitle>
					<Button onClick={handleCreate} width="140px">
						Создать Бонус
					</Button>
				</Flex>
			</LayoutContent>
			<LayoutContent>
				<div className={styles.wrapper}>
					{cashbackData &&
						cashbackData?.map((item: YourType, index: number) => (
							<div key={index} className={styles.get_card}>
								{edit && item.id === editID ? (
									<div className={styles.buttons_wrapper}>
										<button onClick={hadnleReset} className={styles.edit_btn}>
											отмена
										</button>
										<button
											onClick={handleChangeEdit}
											disabled={editValidate}
											style={{
												backgroundColor: editValidate ? 'gray' : '#32a011ec',
											}}
											className={styles.save_btn}
										>
											изменить
										</button>
									</div>
								) : (
									<></>
								)}
								<div className={styles.course}>
									<div className={styles.course_preview}>
										<h6 className="xs:text-xs">Название бонуса</h6>
										<h3 className="xs:text-xs">
											{edit && item.id === editID ? (
												<Input
													value={editData.bonusName}
													onChange={(e) =>
														setEditData({
															...editData,
															bonusName: e.target.value,
														})
													}
												/>
											) : (
												item.bonusName
											)}
										</h3>
									</div>
									<div className={styles.course_info}>
										<p className="xs:text-xs">
											Дата создания:{' '}
											<span className={styles.data_text}>
												{new String(item.createdAt).slice(11, 16)}
												{'/'}
												{new String(item.createdAt).slice(0, 10)}
											</span>
										</p>
										<p className="xs:text-[11px] flex item-center">
											<p className="mt-[5px] mr-[2px]">До:</p>
											{edit && item.id === editID ? (
												<>
													<input
														value={editData.totalSum}
														onChange={(e) =>
															setEditData({
																...editData,
																totalSum: !e.target.value
																	? 0
																	: Number(e.target.value),
															})
														}
														className={styles.input}
													/>
													<span className={styles.lox}>сом </span>
												</>
											) : (
												<span className={styles.lox}>
													{`${item.totalSum}  сом `}{' '}
												</span>
											)}
											<p className="mt-[5px] mx-[2px]">{' - Скидка:'}</p>
											{edit && item.id === editID ? (
												<>
													<input
														value={editData.percent}
														onChange={(e) =>
															setEditData({
																...editData,
																percent: !e.target.value
																	? 0
																	: Number(e.target.value),
															})
														}
														className={styles.input}
													/>{' '}
													<span className={styles.lox}>%</span>
												</>
											) : (
												<span
													className={styles.lox}
												>{`${item.percent} %`}</span>
											)}
										</p>
										<div className={styles.suka}>
											<p className={styles.comment_text}>
												Комент: <br />{' '}
												{edit && item.id === editID ? (
													<div style={{ margin: '3px' }}>
														<Input
															value={editData.comment}
															onChange={(e) =>
																setEditData({
																	...editData,
																	comment: e.target.value,
																})
															}
														/>
													</div>
												) : (
													<span>
														{item.comment ? item.comment : 'Нет Коментария'}
													</span>
												)}
											</p>
										</div>
										<div
											onClick={() => handleDelete(item.id)}
											style={{
												position: 'absolute',
												top: '8px',
												right: '0px',
												width: '40px',
												height: '30px',
												backgroundColor: '#32a011ec',
												borderRadius: '10px 0px 0px 10px',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												cursor: 'pointer',
											}}
										>
											<Tooltip title="Удалить" placement="top">
												<DeleteIcon className={styles.icons} />
											</Tooltip>
										</div>
										<div
											onClick={() => hadnleEditClick(item)}
											style={{
												position: 'absolute',
												top: '48px',
												right: '0px',
												width: '40px',
												height: '30px',
												backgroundColor: '#32a011ec',
												borderRadius: '10px 0px 0px 10px',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												cursor: 'pointer',
											}}
										>
											<Tooltip title="Редактировать">
												<EditIcon className={styles.icons} />
											</Tooltip>
										</div>
									</div>
								</div>
							</div>
						))}
				</div>
			</LayoutContent>
		</div>
	)
}

export default BonusPage
