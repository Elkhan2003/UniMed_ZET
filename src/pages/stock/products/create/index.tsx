import { useCallback } from 'react'
import { SlModal } from '../../../../components/shared/sl-modal'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { CiImageOn } from 'react-icons/ci'
import {
	useCreateProduct,
	useGetInventoryCategories,
} from '../../../../shared/queries/inventory.queries'
import { Controller, useForm } from 'react-hook-form'
import { SlSelect } from '../../../../components/shared/sl-select'
import { SlInput } from '../../../../components/shared/sl-input'
import { unitsStock } from '../../../../shared/lib/constants/constants'
import { getRussianUnitName } from '../../../../shared/lib/helpers/helpers'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { useSearchParams } from 'react-router-dom'
import { useCreateFile } from '../../../../shared/queries/files.quries'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useOwnerStore } from '../../../../shared/states/owner.store'

const unitsSelect = unitsStock.map((unit) => ({
	value: unit,
	label: getRussianUnitName(unit),
}))

export const StockProductsCreate = ({
	active,
	handleClose,
}: {
	active: boolean
	handleClose: () => void
}) => {
	const branchId = useOwnerStore((state: any) => state.branchId)

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm()

	const { data: categories = [] } = useGetInventoryCategories()
	const { mutate: createProduct } = useCreateProduct(Number(branchId))
	const { mutate: createFile, isPending: isLoadingCreateFile } = useCreateFile()

	const onDropMainImage = useCallback((acceptedFiles: any) => {
		if (acceptedFiles.length !== 0) {
			createFile(acceptedFiles[0], {
				onSuccess: (data) => {
					setValue('image', data)
				},
				onError: (error) => {
					toast.error(error?.message || 'Ошибка при загрузке фото')
				},
			})
		} else {
			toast.error('Только одно фото можно загрузить')
		}
	}, [])

	const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } =
		useDropzone({
			onDrop: onDropMainImage,
			maxFiles: 1,
		})

	const onSubmit = (data: any) => {
		createProduct(data, {
			onSuccess: () => {
				handleClose()
			},
		})
	}

	return (
		<SlModal
			wrapperClassName="bg-[#F5F5F5]"
			headerClassName="bg-[#F5F5F5]"
			active={active}
			handleClose={() => {
				handleClose()
				reset()
			}}
			title="Создание товара"
		>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-[15px] py-[20px]"
			>
				<div
					{...getMainRootProps()}
					className="w-[150px] h-[150px] rounded-[16px] bg-[#E8EAED] flex items-center justify-center"
				>
					<input {...getMainInputProps()} />
					{isLoadingCreateFile ? (
						<div className="w-full h-full flex items-center justify-center">
							<AiOutlineLoading3Quarters className="w-8 h-8 animate-spin text-[#FF99D4]" />
						</div>
					) : watch('image') ? (
						<img
							src={watch('image')}
							alt="product"
							className="w-full h-full rounded-[16px] object-cover"
						/>
					) : (
						<div className="flex flex-col items-center gap-2 p-[10px]">
							<CiImageOn fontSize={30} color="#4E4E4E80" />
							<p className="text-[#4E4E4E80] text-[10px] font-[500] text-center">
								Нажмите здесь чтобы загрузить фото
							</p>
						</div>
					)}
				</div>
				<Controller
					name="categoryId"
					control={control}
					rules={{ required: 'Укажите категорию товара' }}
					render={({ field }) => (
						<SlSelect
							label="Категория"
							value={field.value ?? ''}
							onChange={(value) => field.onChange(value)}
							required
							options={[
								{ value: '', label: 'Укажите категорию товара' },
								...categories.map((category: any) => ({
									value: category.id,
									label: category.name,
								})),
							]}
							error={errors.categoryId?.message as string}
						/>
					)}
				/>

				<SlInput
					label="Название"
					required
					placeholder="Название"
					register={register('name', { required: 'Название обязательно' })}
					error={errors.name?.message as string}
				/>
				<SlInput
					label="Артикул"
					required
					placeholder="Артикул"
					register={register('articleNumber', {
						required: 'Артикул обязательно',
					})}
					error={errors.articleNumber?.message as string}
				/>
				<SlInput
					label="Штрих-код"
					placeholder="Штрих-код"
					required
					register={register('barcode', { required: 'Штрих-код обязательно' })}
					error={errors.barcode?.message as string}
				/>
				<Controller
					name="measureUnitType"
					control={control}
					rules={{ required: 'Укажите единицу измерения' }}
					render={({ field }) => (
						<SlSelect
							label="Единица измерения при поступлении*"
							value={field.value}
							onChange={field.onChange}
							required
							options={[
								{ value: '', label: 'Укажите единицу измерения' },
								...unitsSelect,
							]}
							error={errors.measureUnitType?.message as string}
						/>
					)}
				/>
				<div className="flex items-center gap-[10px]">
					<SlInput
						label="В упаковке"
						required
						placeholder="В упаковке"
						register={register('quantityPerPackage', {
							required: 'В упаковке обязательно',
						})}
						error={errors.quantityPerPackage?.message as string}
					/>

					<Controller
						name="packagingUnitType"
						control={control}
						rules={{ required: 'Укажите единицу измерения' }}
						render={({ field }) => (
							<SlSelect
								label="Единица измерения"
								value={field.value}
								onChange={field.onChange}
								required
								options={[
									{ value: '', label: 'Укажите единицу измерения' },
									...unitsSelect,
								]}
								error={errors.packagingUnitType?.message as string}
							/>
						)}
					/>
				</div>
				<SlInput
					label="Цена продажи"
					required
					placeholder="Цена продажи"
					register={register('sellingPrice', {
						required: 'Цена продажи обязательно',
					})}
					error={errors.sellingPrice?.message as string}
				/>
				<SlInput
					label="Описание"
					required
					placeholder="Описание"
					register={register('description', {
						required: 'Описание обязательно',
					})}
					error={errors.description?.message as string}
				/>
				<div className="flex justify-end">
					<Button type="submit" borderRadius="24px" width="fit-content">
						Создать
					</Button>
				</div>
			</form>
		</SlModal>
	)
}
