import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { useDispatch, useSelector } from 'react-redux'
import {
	deleteBranchesImageMain,
	getBranchesImage,
	getBranchesImageMain,
	postBranchesImageList,
	postBranchesImage,
	deleteBranchesImageList,
} from '../../../store/features/branchWork-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { RootState } from '../../../store'
import toast from 'react-hot-toast'
import styles from './SamplePage.module.css'
import { useGetMasterProfileQuery } from '../../../store/services/master.service'
import { StyledTitle } from '../../../shared/styles'
import { CiImageOn } from 'react-icons/ci'
import { DeleteOutlined } from '@ant-design/icons'
import { Backdrop, CircularProgress } from '@mui/material'
import { isLoadingSx } from '../../../shared/lib/constants/constants'

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

export const BannerPage = () => {
	const { data: masterData } = useGetMasterProfileQuery()
	const { dataBranchImage, dataBranchImageMain } = useSelector(
		(state: RootState) => state.branchWorks
	)

	const [loading, setLaoding] = useState(false)

	const [imageList, setImageList] = useState([
		{
			id: Math.random(),
			image: '',
		},
	])

	const dispatch = useDispatch()

	useEffect(() => {
		if (masterData) {
			dispatch(
				getBranchesImageMain({
					branchId: masterData?.branchId,
				}) as unknown as AnyAction
			)
			dispatch(
				getBranchesImage({
					branchId: masterData?.branchId,
				}) as unknown as AnyAction
			)
		}
	}, [dispatch, masterData])

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
						branchId: masterData?.branchId,
						workImageLinks: acceptedFiles[0],
					}) as unknown as AnyAction
				)
			} else {
				toast.error('Только одну можно фото загрузить')
			}
		},
		[dispatch, masterData?.branchId]
	)

	const onDropMiniImage = useCallback(
		async (acceptedFiles: any) => {
			if (acceptedFiles && acceptedFiles.length > 0) {
				setLaoding(true)
				await dispatch(
					postBranchesImageList({
						branchId: masterData?.branchId,
						workImageLinks: acceptedFiles,
					}) as unknown as AnyAction
				)
				setLaoding(false)
			}
		},
		[dispatch, masterData?.branchId]
	)

	async function handleClear() {
		setLaoding(true)
		const filterImages = imageList.map((item: any) => item.image)
		await dispatch(
			deleteBranchesImageList({
				branchId: masterData?.branchId,
				images: filterImages.slice(0, -1),
			}) as unknown as AnyAction
		)
		setLaoding(false)
	}

	useEffect(() => {
		if (loading === true) {
			setTimeout(() => {
				setLaoding(false)
			}, 2000)
		}
	}, [loading])

	const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } =
		useDropzone({
			onDrop: onDropMainImage,
			maxFiles: 1,
		})

	return (
		<div className="w-full  bg-white ">
			<Backdrop sx={isLoadingSx} open={loading}>
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
										branchId: masterData?.branchId,
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
							branchId={masterData?.branchId}
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
