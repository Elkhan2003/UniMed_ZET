import { useState } from 'react'
import {
	Controller,
	useForm,
	FieldError,
	FieldErrorsImpl,
} from 'react-hook-form'
import { SlInput } from '../../../../components/shared/sl-input'
import { SlModal } from '../../../../components/shared/sl-modal'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { SlMultiSelect } from '../../../../components/shared/sl-multi-select '
import {
	useGetInventoryCategories,
	useGetProductsSearchCategory,
	useInventoryOperation,
} from '../../../../shared/queries/inventory.queries'
import { StockProductsCreate } from '../create'

export const CreateEntrance = ({
	active,
	handleClose,
	branchId,
}: {
	active: boolean
	handleClose: () => void
	branchId: number
}) => {
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		watch,
		reset,
	} = useForm()

	const [createProduct, setCreateProduct] = useState(false)

	const { data: products = [] } = useGetProductsSearchCategory(
		branchId,
		watch('category')
	)

	const { data: categories = [] } = useGetInventoryCategories()

	const { mutate: createEntrance } = useInventoryOperation(branchId)

	const onSubmit = (data: any) => {
		createEntrance(
			{
				createdAt: data.date + 'T' + data.time + ':00.508Z',
				supplier: data.supplier,
				totalCost:
					data.productMovements?.reduce(
						(acc: number, val: any) =>
							acc + Number(val?.purchasePrice) * Number(val?.quantity),
						0
					) || 0,
				productMovements: data.productMovements
					?.filter((item: any) => data.products.includes(item.productId))
					.map((mapItem: any) => {
						return {
							productId: mapItem.productId,
							quantity: mapItem.quantity,
							purchasePrice: mapItem?.purchasePrice,
							totalCost: mapItem?.purchasePrice * mapItem.quantity,
						}
					}),
			},
			{
				onSuccess: () => {
					handleClose()
					reset()
				},
			}
		)
	}

	const productMovementsErrors = errors.productMovements as
		| FieldErrorsImpl<any>[]
		| undefined

	return (
		<>
			<SlModal
				active={active}
				handleClose={() => {
					handleClose()
					reset()
				}}
				title="Поступление товара"
				wrapperClassName="bg-[#F5F5F5]"
				headerClassName="bg-[#F5F5F5]"
			>
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="h-full flex flex-col gap-[15px] py-[20px] justify-between"
				>
					<div className="flex flex-col gap-[15px]">
						<div className="w-full flex items-center gap-[10px]">
							<div className="w-full">
								<p className="text-[14px] text-[#4E4E4E] font-[500]">
									Дата поступления товара*
								</p>
								<input
									type="date"
									{...register('date', { required: 'Дата обязательна' })}
									className="bg-white w-full h-[37px] border-[1px] border-[#E8EAED] border-solid rounded-[8px] px-[10px]"
								/>
							</div>
							<div className="w-full">
								<p className="text-[14px] text-[#4E4E4E] font-[500]">Время</p>
								<input
									type="time"
									{...register('time')}
									className="bg-white w-full h-[37px] border-[1px] border-[#E8EAED] border-solid rounded-[8px] px-[10px]"
								/>
							</div>
						</div>
						<SlInput
							label="Поставщик"
							required
							placeholder="Поставщик"
							register={register('supplier', {
								required: 'Поставщик обязательно',
							})}
							error={errors.supplier?.message as string}
						/>
						<Controller
							name="category"
							control={control}
							rules={{ required: 'Укажите Категории' }}
							render={({ field }) => (
								<SlMultiSelect
									label="Категории"
									value={field.value}
									onChange={field.onChange}
									required
									options={categories.map((item: any) => {
										return {
											label: item.name,
											value: item.id,
										}
									})}
									error={errors.category?.message as string} // исправляем error field
								/>
							)}
						/>
						<Controller
							name="products"
							control={control}
							rules={{ required: 'Укажите товары' }}
							render={({ field }) => (
								<SlMultiSelect
									label="Товары"
									value={field.value}
									onChange={field.onChange}
									required
									options={products.map((item: any) => {
										return {
											label: item.name,
											value: item.id,
										}
									})}
									error={errors.products?.message as string} // исправляем error field
								/>
							)}
						/>
						<Button
							width="fit-content"
							padding="0px 20px"
							borderRadius="24px"
							onClick={() => setCreateProduct(true)}
						>
							+ Добавить товар
						</Button>
						{watch('products')?.length > 0 && (
							<div className="bg-white rounded-[16px] p-[10px] w-full flex flex-col gap-[5px]">
								<div className="flex items-center justify-between">
									<p className="text-[#101010] text-[12px]">Название</p>
									<p className="text-[#101010] text-[12px]">Кол-во</p>
									<p className="text-[#101010] text-[12px]">Цена закупа</p>
									<p className="text-[#101010] text-[12px]">Сумма</p>
								</div>
								<div className="flex flex-col gap-2">
									{products.map((item: any, index: number) => {
										if (watch('products')?.includes(item.id)) {
											return (
												<div
													key={item.id}
													className="grid grid-cols-4 items-start gap-4"
												>
													<input
														type="number"
														{...register(
															`productMovements.${index}.productId`,
															{
																value: item.id,
															}
														)}
														className="hidden"
													/>
													<div className="flex items-center gap-1">
														<img
															src={item.image}
															alt={item.name}
															className="w-[30px] h-[30px] rounded-[6px] object-cover bg-gray-200"
														/>
														<div>
															<p className="text-[#101010] text-[12px]">
																{item.name}
															</p>
															<p className="text-[#4E4E4E80] text-[11px]">
																{item.category}
															</p>
														</div>
													</div>

													<div className="flex flex-col">
														<input
															type="number"
															{...register(
																`productMovements.${index}.quantity`,
																{
																	valueAsNumber: true,
																	required: 'Укажите количество',
																	min: {
																		value: 1,
																		message: 'Количество должно быть больше 0',
																	},
																}
															)}
															className={`border border-solid rounded-[6px] px-2 py-1 text-[12px] ${
																productMovementsErrors?.[index]?.quantity
																	? 'border-red-500'
																	: 'border-[#E8EAED]'
															}`}
															placeholder="0"
														/>
													</div>

													<div className="flex flex-col">
														<input
															type="number"
															{...register(
																`productMovements.${index}.purchasePrice`,
																{
																	valueAsNumber: true,
																	required: 'Укажите цену',
																	min: {
																		value: 0.01,
																		message: 'Цена должна быть больше 0',
																	},
																}
															)}
															className={`border border-solid rounded-[6px] px-2 py-1 text-[12px] ${
																productMovementsErrors?.[index]?.purchasePrice
																	? 'border-red-500'
																	: 'border-[#E8EAED]'
															}`}
															placeholder="0"
														/>
													</div>

													<input
														type="number"
														disabled
														value={
															watch(`productMovements.${index}.quantity`) *
															watch(`productMovements.${index}.purchasePrice`)
														}
														className="border border-[#E8EAED] border-solid rounded-[6px] px-2 py-1 text-[12px]"
														placeholder="0"
													/>
												</div>
											)
										}
									})}
								</div>
							</div>
						)}
					</div>
					<div className="flex items-center justify-between gap-[15px]">
						<Button
							borderRadius="24px"
							border="1px solid #D8DADC"
							backgroundColor="white"
							color="#4E4E4E"
							type="button"
							onClick={handleClose}
						>
							Отменить
						</Button>
						<Button borderRadius="24px" type="submit">
							Принять
						</Button>
					</div>
				</form>
			</SlModal>
			<StockProductsCreate
				active={createProduct}
				handleClose={() => setCreateProduct(false)}
			/>
		</>
	)
}
