import { useEffect, useState } from 'react'
import { BannerPage } from '../Banner'
import { Button } from '../../../components/UI/Buttons/Button/Button'
import { NewImagePicker } from '../../../components/shared/image-picker'
import {
	useDeleteWorksImagesMutation,
	useGetWorksImagesQuery,
	usePostWorksImagesMutation,
} from '../../../store/services/works.service'
import axiosInstance from '../../../shared/api/axios-config'
import { LayoutContent } from '../../../components/UI/LayoutContent'
import { useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { ModalComponent } from '../../../components/UI/Modal/Modal'
import { DeleteOutlined } from '@ant-design/icons'
import toast from 'react-hot-toast'
import { StyledTitle } from '../../../shared/styles'
import { Backdrop, CircularProgress } from '@mui/material'
import { isLoadingSx } from '../../../shared/lib/constants/constants'

export const PersonalWorks = () => {
	const { individualData } = useSelector((state: RootState) => state.individual)
	const [isLoading, setIsLoading] = useState(true)

	const { data: dataBranchWork } = useGetWorksImagesQuery(
		{
			branchId: individualData?.branchId,
		},
		{ skip: !individualData }
	)

	const [active, setActive] = useState(false)

	const [deleteBranchWorks] = useDeleteWorksImagesMutation()

	const [postBranchWorks] = usePostWorksImagesMutation()

	const [workImageLinkses, setWorkImageLinks] = useState<any>(null)

	async function handleDelete(workImageLinks: string) {
		try {
			setIsLoading(true)
			await deleteBranchWorks({
				branchId: individualData?.branchId,
				workImageLinks: workImageLinks,
			})
			toast.success('Картинка успешно удалена')
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setIsLoading(false)
		}
	}

	async function handlePost() {
		try {
			setIsLoading(true)
			setActive(false)
			const formData = new FormData()
			formData.append(`file`, workImageLinkses)
			const res = await axiosInstance.post('files', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			const image = res.data
			const resd: any = await postBranchWorks({
				workImageLinks: image,
				branchId: individualData?.branchId,
			})
			if (resd['error']) {
				toast.error(`Произошла ошибка: ${resd?.error.data?.message}`)
			} else {
				toast.success('Картинка успешно добавлена')
			}
			setWorkImageLinks(null)
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 1000)
		return () => clearTimeout(timer)
	}, [])

	return (
		<div className="w-full space-y-4 bg-white p-[20px]  min-h-[calc(100vh-45px)]">
			<Backdrop sx={isLoadingSx} open={isLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>
			<div className="w-full min-h-[200px]">
				<div className="w-full flex justify-between">
					<StyledTitle>Мои работы</StyledTitle>
					<p
						onClick={() => setActive(true)}
						className="text-myviolet text-[16px] font-[500] myfont"
					>
						+Добавить фото
					</p>
				</div>
				<ModalComponent
					active={active}
					title="Выберите изображение"
					handleClose={() => setActive(false)}
				>
					<div className="space-y-2 p-2 w-fit">
						<NewImagePicker
							value={workImageLinkses}
							setValue={setWorkImageLinks}
						/>
						<div className="flex justify-end">
							<Button
								width="100px"
								disabled={!workImageLinkses}
								onClick={handlePost}
								isLoading={isLoading}
							>
								Сохранить
							</Button>
						</div>
					</div>
				</ModalComponent>
				<div className="flex gap-2 flex-wrap">
					{dataBranchWork?.map((item: any, index: number) => (
						<div
							key={index}
							className="rounded-[16px] relative w-[200px] h-[200px] overflow-hidden bg-gray-100"
						>
							<div className="absolute top-2 right-2 bg-white p-1 px-2 shadow-2xl rounded-full z-10">
								<DeleteOutlined onClick={() => handleDelete(item)} />
							</div>

							<img
								className="absolute inset-0 w-full h-full object-cover"
								src={item}
								alt="custom-sample"
							/>
						</div>
					))}
				</div>
			</div>
			<BannerPage />
		</div>
	)
}
