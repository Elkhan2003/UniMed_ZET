import { useState, useCallback } from 'react'
import { SlModal } from '../../../components/shared/sl-modal'
import { useDropzone } from 'react-dropzone'
import { postBranchesImage } from '../../../store/features/branchWork-slice'
import { AnyAction } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { CiImageOn } from 'react-icons/ci'
import { SlInput } from '../../../components/shared/sl-input'
import { Controller, useForm } from 'react-hook-form'
import { SlSelect } from '../../../components/shared/sl-select'
import {
	useGetServiceCategories,
	useGetServiceSubCategories,
} from '../../../shared/queries/service-categories'
import { Button } from '../../../components/UI/Buttons/Button/Button'

import { ReactComponent as Search } from '../../../assets/icons/usage/search.svg'

export const CreateService = ({
	active,
	handleClose,
}: {
	active: boolean
	handleClose: () => void
}) => {
	const [step, setStep] = useState(0)
	const dispatch = useDispatch()

	const { ownerData } = useSelector((state: any) => state.ownerCompany)

	const { data: categories = [] } = useGetServiceCategories(
		ownerData?.categoryType
	)

	const {
		register,
		handleSubmit,
		control,
		watch,
		getValues,
		reset,
		formState: { errors },
	} = useForm()

	const { data: subCategories = [] } = useGetServiceSubCategories(
		watch('category')
	)

	const onDropMainImage = useCallback(
		(acceptedFiles: any) => {
			if (acceptedFiles.length !== 0) {
				dispatch(
					postBranchesImage({
						branchId: Number(3),
						workImageLinks: acceptedFiles[0],
					}) as unknown as AnyAction
				)
			} else {
				toast.error('Только одну можно фото загрузить')
			}
		},
		[dispatch]
	)

	const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } =
		useDropzone({
			onDrop: onDropMainImage,
			maxFiles: 1,
		})

	return (
		<SlModal
			headerClassName="bg-[#F5F5F5]"
			wrapperClassName="bg-[#F5F5F5]"
			active={active}
			handleClose={() => {
				handleClose()
				reset()
			}}
			title="Создание услуги"
		>
			<div className="w-full h-full flex flex-col gap-[20px] py-[10px]">
				<div className="flex items-center justify-center gap-[15px]">
					{Array.from({ length: 3 }).map((_, index) => (
						<div
							key={index}
							onClick={() => setStep(index)}
							className={`w-[30px] h-[30px] flex items-center cursor-pointer justify-center rounded-full transition-all duration-300 ${step >= index ? 'bg-[#101010] scale-105' : 'bg-[#E0E0E0] scale-90'}`}
						>
							<p
								className={`text-[14px] ${step >= index ? 'text-white' : 'text-[#101010]'}`}
							>
								{index + 1}
							</p>
						</div>
					))}
				</div>
				{step === 0 && (
					<div className="w-full flex flex-col gap-[15px] items-center">
						<div
							{...getMainRootProps()}
							className="w-[150px] h-[150px] rounded-[16px] bg-[#E8EAED] flex items-center justify-center p-[10px]"
						>
							<input {...getMainInputProps()} />
							<div className="flex flex-col items-center gap-2">
								<CiImageOn fontSize={30} color="#4E4E4E80" />
								<p className="text-[#4E4E4E80] text-[10px] font-[500] text-center">
									Нажмите здесь чтобы загрузить фото
								</p>
							</div>
						</div>
						<SlInput
							label="Название"
							placeholder="Название"
							register={register('name', { required: 'Название обязательно' })}
							error={errors.name?.message as string}
						/>
						<Controller
							name="category"
							control={control}
							rules={{ required: 'Укажите категорию услуги' }}
							render={({ field }) => (
								<SlSelect
									label="Категория"
									value={field.value}
									onChange={field.onChange}
									required
									options={categories?.map((category: any) => ({
										value: category.id,
										label: category.name,
									}))}
								/>
							)}
						/>
						<Controller
							name="categoryId"
							control={control}
							rules={{ required: 'Укажите подкатегорию услуги' }}
							render={({ field }) => (
								<SlSelect
									label="Подкатегория"
									value={field.value}
									onChange={field.onChange}
									required
									options={subCategories?.map((subCategory: any) => ({
										value: subCategory.id,
										label: subCategory.name,
									}))}
								/>
							)}
						/>
						<div className="w-full flex justify-end">
							<Button
								width="fit-content"
								borderRadius="24px"
								disabled={
									!watch('name') || !watch('category') || !watch('categoryId')
								}
								onClick={() => setStep(1)}
							>
								Далее
							</Button>
						</div>
					</div>
				)}
				{step === 1 && (
					<div className="w-full flex flex-col gap-[15px]">
						<div>
							<p className="text-[14px] text-[#101010]">Материал</p>
							<p className="text-[#4E4E4E80] text-[12px]">
								Можете указать какие материалы/средства используются при
								выполнении услуги
							</p>
						</div>
						<div className="relative w-full">
							<input
								style={{
									boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
								}}
								type="text"
								placeholder="Поиск по названию материала, артикулу или штрих-коду"
								className="w-full h-[37px] rounded-[24px] bg-white px-[16px] py-[9px] text-[14px] placeholder:text-[#4E4E4E80] text-[#101010]"
							/>
							<Search className="absolute right-[16px] top-[9px]" />
						</div>
					</div>
				)}
			</div>
		</SlModal>
	)
}
