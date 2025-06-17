import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { useDispatch, useSelector } from 'react-redux'
import {
	deleteBranchesImageMain,
	getBranchesImage,
	getBranchesImageMain,
	postBranchesImageList,
	postBranchesImage,
	deleteBranchesImageList,
} from '../../../../store/features/branchWork-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '../../../../store'
import { DeleteOutlined } from '@ant-design/icons'
import toast from 'react-hot-toast'
import styles from './SamplePage.module.css'
import { useParams } from 'react-router-dom'
import { CiImageOn } from 'react-icons/ci'
import { LayoutContent } from '../../../../components/UI/LayoutContent'
import { Backdrop, CircularProgress } from '@mui/material'
import { StyledTitle } from '../../../../shared/styles'
import { isLoadingSx } from '../../../../shared/lib/constants/constants'

const MiniImage = ({ id, onDropMiniImage, image, branchId }: any) => {
	const { getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => onDropMiniImage(acceptedFiles, id),
	})
	const dispatch = useDispatch()
	return (
		<>
			{image === '' ? (
				<div {...getRootProps()} className={styles.container_mini}>
					<input {...getInputProps()} />
					<div className="flex flex-col items-center gap-2">
						<CiImageOn fontSize={50} />
						<p className="text-[#4E4E4E80] text-[14px] font-[500] text-center">
							Нажмите здесь чтобы загрузить фото
						</p>
					</div>
				</div>
			) : (
				<div className={styles.container_mini_inside}>
					<img
						className={styles.container_mini_image}
						src={image}
						alt="Mini Sample"
					/>
					<div
						className="absolute top-2 right-2 bg-white py-1 px-2 rounded-full shadow-2xl"
						onClick={() =>
							dispatch(
								deleteBranchesImageList({
									branchId,
									images: [image],
								}) as unknown as AnyAction
							)
						}
					>
						<DeleteOutlined />
					</div>
				</div>
			)}
		</>
	)
}

export const SamplePage = () => {
	const { dataBranchImage, dataBranchImageMain, isLoadingBranchWork } =
		useSelector((state: RootState) => state.branchWorks)

	const { id } = useParams()
	const dispatch = useDispatch()

	const [imageList, setImageList] = useState([
		{
			id: Math.random(),
			image: '',
		},
	])
	const [loading, setLaoding] = useState(false)

	useEffect(() => {
		dispatch(
			getBranchesImageMain({
				branchId: Number(id),
			}) as unknown as AnyAction
		)
		dispatch(
			getBranchesImage({
				branchId: Number(id),
			}) as unknown as AnyAction
		)
	}, [dispatch, id])

	useEffect(() => {
		const dataImageDesctructor = dataBranchImage?.map(
			(item: any, index: number) => {
				return { image: item, id: index + 1 }
			}
		)
		setImageList([
			...dataImageDesctructor,
			{
				id: Math.random(),
				image: '',
			},
		])
	}, [dataBranchImage])

	const onDropMainImage = useCallback(
		(acceptedFiles: any) => {
			if (acceptedFiles.length !== 0) {
				dispatch(
					postBranchesImage({
						branchId: Number(id),
						workImageLinks: acceptedFiles[0],
					}) as unknown as AnyAction
				)
			} else {
				toast.error('Только одну можно фото загрузить')
			}
		},
		[dispatch, id]
	)

	const onDropMiniImage = useCallback(
		(acceptedFiles: any, ID: number) => {
			if (acceptedFiles && acceptedFiles.length > 0) {
				dispatch(
					postBranchesImageList({
						branchId: Number(id),
						workImageLinks: acceptedFiles,
					}) as unknown as AnyAction
				)
			}
		},
		[dispatch, id]
	)

	async function handleClear() {
		setLaoding(true)
		const filterImages = imageList.map((item: any) => item.image)
		await dispatch(
			deleteBranchesImageList({
				branchId: Number(id),
				images: filterImages.slice(0, -1),
			}) as unknown as AnyAction
		)
		setLaoding(false)
	}

	const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } =
		useDropzone({
			onDrop: onDropMainImage,
			maxFiles: 1,
		})

	return (
		<div className="w-full">
			<Backdrop sx={isLoadingSx} open={isLoadingBranchWork}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<StyledTitle>Баннер</StyledTitle>
			<div className={styles.container_sample_page}>
				{dataBranchImageMain === '' ? (
					<div {...getMainRootProps()} className={styles.container_glav_sample}>
						<input {...getMainInputProps()} />
						<div className="flex flex-col items-center gap-2">
							<CiImageOn fontSize={50} />
							<p className="text-[#4E4E4E80] text-[14px] font-[500] text-center">
								Для главного баннера нажмите здесь чтобы загрузить фото
							</p>
						</div>
					</div>
				) : (
					<div className={styles.container_glav_sample}>
						<img
							className="w-full h-full object-cover"
							src={dataBranchImageMain}
							alt="img"
						/>
						<div
							onClick={() =>
								dispatch(
									deleteBranchesImageMain({
										branchId: Number(id),
									}) as unknown as AnyAction
								)
							}
							className="absolute top-2 right-2 p-1 px-2 bg-white shadow-2xl rounded-full z-10"
						>
							<DeleteOutlined />
						</div>
					</div>
				)}
				<div className={styles.container_mini_sample}>
					{imageList?.map((item) => (
						<MiniImage
							key={item.id}
							id={item.id}
							onDropMiniImage={onDropMiniImage}
							image={item.image}
							branchId={Number(id)}
						/>
					))}
				</div>
			</div>
			<div className={styles.container_button}>
				<Button isLoading={loading} width="170px" onClick={handleClear}>
					Очистить все
				</Button>
			</div>
		</div>
	)
}
