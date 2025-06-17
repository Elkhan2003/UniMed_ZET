import { useState } from 'react'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import {
	useGetCountryQuery,
	useDeleteCountryMutation,
	usePutCountryMutation,
} from '../../../../store/services/country.service'
import toast from 'react-hot-toast'
import { MdDelete } from 'react-icons/md'
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { BsPencilSquare } from 'react-icons/bs'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import GeographicUnitModal from './RegionModal'
import Modals from './CountryModal'

export const AdressSuper = () => {
	const { data: countries = [], refetch } = useGetCountryQuery()
	const [countryDelete] = useDeleteCountryMutation()
	const [coutntryPut] = usePutCountryMutation()

	const [modalActives, setModalActives] = useState<any>({
		country: false,
		region: false,
		district: false,
		residentialArea: false,
	})

	const [modalType, setModalType] = useState<'edit' | 'delete' | null>(null)
	const [formValues, setFormValues] = useState<any>({
		name: '',
		latitude: '',
		longitude: '',
		geographicUnitType: 'COUNTRY',
	})
	const [selectedId, setSelectedId] = useState<number | null>(null)
	const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
		null
	)
	const [expandedCountries, setExpandedCountries] = useState<Set<number>>(
		new Set()
	)
	const [expandedRegionId, setExpandedRegionId] = useState<number | null>(null)
	const [expandedCityId, setExpandedCityId] = useState<number | null>(null)

	const toggleCountrySet = (id: number) => {
		const newExpandedCountries = new Set(expandedCountries)
		if (newExpandedCountries.has(id)) {
			newExpandedCountries.delete(id)
		} else {
			newExpandedCountries.add(id)
		}
		setExpandedCountries(newExpandedCountries)
	}

	const toggleRegion = (id: number) => {
		setExpandedRegionId(expandedRegionId === id ? null : id)
		setExpandedCityId(null)
	}

	const toggleCity = (id: number) => {
		setExpandedCityId(expandedCityId === id ? null : id)
	}

	const handleInputChange = (field: string, value: string) => {
		setFormValues((prev: any) => ({ ...prev, [field]: value }))
	}

	// !PUt
	const handlePut = async () => {
		try {
			if (selectedId !== null) {
				await coutntryPut({
					geographicUnitId: selectedId,
					body: {
						name: formValues.name,
						latitude: formValues.latitude,
						longitude: formValues.longitude,
						geographicUnitType: formValues.geographicUnitType,
					},
				})

				toast.success(' успешно обновлена!')
				setModalType(null)
				refetch()
			}
		} catch (error: any) {
			const errorMessage = error?.countries?.message || 'Ошибка при обновлении '
			toast.error(`Ошибка: ${errorMessage}`)
		}
	}

	// ! DELETE
	const handleDelete = async (id: number) => {
		if (selectedId !== null) {
			try {
				await countryDelete({ geographicUnitId: selectedId }).unwrap()
				toast.success('Успешно удалено!')
				refetch()
			} catch (error: any) {
				const errorMessage =
					error?.countries?.message || 'Ошибка при обновлении Страны'
				toast.error(`Ошибка: ${errorMessage}`)
			} finally {
				setModalType(null)
				setSelectedId(null)
			}
		}
	}

	const handleDeleteClick = (id: number) => {
		setSelectedId(id)
		setModalType('delete')
	}

	return (
		<div className="p-6 space-y-4 bg-white ">
			<Modals
				active={modalActives.country}
				handleClose={() => setModalActives({ ...modalActives, country: false })}
				refetch={refetch}
				type="COUNTRY"
				title="страна"
				placeholderName="Страна"
			/>

			<GeographicUnitModal
				active={modalActives.region}
				handleClose={() => setModalActives({ ...modalActives, region: false })}
				parentId={selectedCountryId}
				refetch={refetch}
				type="REGION"
				title="регион"
				placeholderName="Региондун"
			/>

			<GeographicUnitModal
				active={modalActives.district}
				handleClose={() =>
					setModalActives({ ...modalActives, district: false })
				}
				parentId={selectedCountryId}
				refetch={refetch}
				type="DISTRICT"
				title="район"
				placeholderName="Райондун"
			/>

			<GeographicUnitModal
				active={modalActives.residentialArea}
				handleClose={() =>
					setModalActives({ ...modalActives, residentialArea: false })
				}
				parentId={selectedCountryId}
				refetch={refetch}
				type="RESIDENTIAL_AREA"
				title="жилой район"
				placeholderName="Жилой район"
			/>

			<div className="flex justify-between">
				<h2 className="text-xl w-[200px] font-bold">Страны</h2>
				<div className="flex  gap-4">
					<p>Широта</p>
					<p>Долгота</p>
				</div>
				<Button
					backgroundColor="#5865F2"
					width="200px"
					onClick={() => {
						setModalActives({ ...modalActives, country: true })
					}}
				>
					Добавить
				</Button>
			</div>

			<div className="space-y-4">
				{countries
					.filter((country: any) => country.geographicUnitType === 'COUNTRY')
					.map((country: any) => (
						<div
							key={country.id}
							className="border border-gray-300 rounded-lg p-4"
						>
							<div
								onClick={() => toggleCountrySet(country.id)}
								className="flex cursor-pointer w-full border p-2 border-solid rounded-[10px] border-[#757778] h-[60px] justify-between items-center"
							>
								<h3 className="text-lg font-medium w-[100px]">
									{country.name}
								</h3>
								<div className="flex gap-3">
									<p>{country.latitude}</p>
									<p>{country.longitude}</p>
								</div>
								<div className="flex gap-3 items-center space-x-2">
									<BsPencilSquare
										onClick={() => {
											setSelectedId(country.id)
											setModalType('edit')
											setFormValues({
												name: country.name,
												latitude: country.latitude,
												longitude: country.longitude,
												geographicUnitType: country.geographicUnitType,
											})
										}}
										fontSize={20}
										className="text-myadmin cursor-pointer"
									/>
									<MdDelete
										fontSize={20}
										className="text-myadmin cursor-pointer"
										onClick={() => handleDeleteClick(country.id)}
									/>
									<button onClick={() => toggleCountrySet(country.id)}>
										{expandedCountries.has(country.id) ? (
											<FaChevronDown className="text-gray-800" />
										) : (
											<FaChevronRight className="text-gray-500" />
										)}
									</button>
								</div>
							</div>

							{expandedCountries.has(country.id) && (
								<div className="mt-4 space-y-4 border-l-2 border-gray-300 pl-4">
									<div className="flex justify-between">
										<h1 className="text-[20px] font-bold">Регионы</h1>
										<Button
											backgroundColor="#5865F2"
											onClick={() => {
												setModalActives({ ...modalActives, region: true })
												setSelectedCountryId(country.id)
											}}
											width="170px"
										>
											Добавить
										</Button>
									</div>
									{country.childrenGeographicUnit
										?.filter(
											(region: any) => region.geographicUnitType === 'REGION'
										)
										.map((region: any) => (
											<div
												key={region.id}
												className="border-l-2 border-gray-300 pl-4"
											>
												<div
													onClick={() => toggleRegion(region.id)}
													className="flex cursor-pointer justify-between border rounded-[10px] p-2 border-solid border-[#757778] items-center"
												>
													<h4 className="text-md font-medium w-[200px]">
														{region.name}
													</h4>
													<div className="flex gap-2">
														<p>{region.latitude}</p>
														<p>{region.longitude}</p>
													</div>
													<div className="flex gap-3">
														<BsPencilSquare
															onClick={() => {
																setSelectedId(region.id)
																setModalType('edit')
																setFormValues({
																	name: region.name,
																	latitude: region.latitude,
																	longitude: region.longitude,
																	geographicUnitType: region.geographicUnitType,
																})
															}}
															fontSize={20}
															className="text-myadmin cursor-pointer"
														/>
														<MdDelete
															fontSize={20}
															className="text-myadmin cursor-pointer  "
															onClick={() => handleDeleteClick(region.id)}
														/>
														<button onClick={() => toggleRegion(region.id)}>
															{expandedRegionId === region.id ? (
																<FaChevronDown className="text-gray-400" />
															) : (
																<FaChevronRight className="text-gray-400" />
															)}
														</button>
													</div>
												</div>
												{expandedRegionId === region.id && (
													<div className="mt-2 pl-4 border-l-2 border-gray-200">
														<div className="flex justify-between mb-2">
															<h1 className="text-[18px] font-bold">Район</h1>
															<Button
																backgroundColor="#5865F2"
																onClick={() => {
																	setModalActives({
																		...modalActives,
																		district: true,
																	})
																	setSelectedCountryId(region.id)
																}}
																width="160px"
															>
																Добавить
															</Button>
														</div>
														{region.childrenGeographicUnit
															?.filter(
																(city: any) =>
																	city.geographicUnitType === 'DISTRICT'
															)
															.map((city: any) => (
																<div
																	key={city.id}
																	className="border-l-2 border-gray-200 pl-4"
																>
																	<div
																		onClick={() => toggleCity(city.id)}
																		className="flex mb-3 cursor-pointer border rounded-[10px] p-2 border-solid border-[#757778] justify-between items-center"
																	>
																		<p className="text-sm font-medium">
																			{city.name}
																		</p>
																		<div className="flex gap-2">
																			<p>{city.latitude}</p>
																			<p>{city.longitude}</p>
																		</div>
																		<div className="flex gap-3">
																			<BsPencilSquare
																				onClick={() => {
																					setSelectedId(city.id)
																					setModalType('edit')
																					setFormValues({
																						name: city.name,
																						latitude: city.latitude,
																						longitude: city.longitude,
																						geographicUnitType:
																							city.geographicUnitType,
																					})
																				}}
																				fontSize={20}
																				className="text-myadmin cursor-pointer"
																			/>
																			<MdDelete
																				fontSize={20}
																				className="text-myadmin cursor-pointer  "
																				onClick={() =>
																					handleDeleteClick(city.id)
																				}
																			/>
																			<button
																				onClick={() => toggleCity(city.id)}
																			>
																				{expandedCityId === city.id ? (
																					<FaChevronDown className="text-gray-400" />
																				) : (
																					<FaChevronRight className="text-gray-400" />
																				)}
																			</button>
																		</div>
																	</div>
																	{expandedCityId === city.id && (
																		<div className="mt-2 pl-4 border-l-2 border-gray-100">
																			<div className="flex justify-between mb-2">
																				<div className="flex gap-3">
																					<h1 className="text-[16px] font-bold">
																						Жилой Район
																					</h1>
																					<p className="text-[16px] font-bold">
																						Микро Район
																					</p>
																					<p className="text-[16px] font-bold">
																						Село
																					</p>
																				</div>
																				<Button
																					backgroundColor="#5865F2"
																					onClick={() => {
																						setModalActives({
																							...modalActives,
																							residentialArea: true,
																						})
																						setSelectedCountryId(city.id)
																					}}
																					width="150px"
																				>
																					Добавить
																				</Button>
																			</div>
																			{city.childrenGeographicUnit
																				?.filter(
																					(district: any) =>
																						district.geographicUnitType ===
																						'RESIDENTIAL_AREA'
																				)
																				.map((district: any) => (
																					<div
																						key={district.id}
																						className="pl-8 mb-2 flex rounded-[10px] justify-between border p-2 border-solid border-[#757778]"
																					>
																						<p className="text-sm">
																							{district.name}
																						</p>
																						<p>Широта: {district.latitude}</p>
																						<p>Долгота: {district.longitude}</p>
																						<div className="flex gap-3">
																							<BsPencilSquare
																								onClick={() => {
																									setSelectedId(district.id)
																									setModalType('edit')
																									setFormValues({
																										name: district.name,
																										latitude: district.latitude,
																										longitude:
																											district.longitude,
																										geographicUnitType:
																											district.geographicUnitType,
																									})
																								}}
																								fontSize={20}
																								className="text-myadmin cursor-pointer"
																							/>
																							<MdDelete
																								fontSize={20}
																								className="text-myadmin cursor-pointer  "
																								onClick={() =>
																									handleDeleteClick(district.id)
																								}
																							/>
																						</div>
																					</div>
																				))}
																		</div>
																	)}
																</div>
															))}
													</div>
												)}
											</div>
										))}
								</div>
							)}
						</div>
					))}
			</div>

			{modalType === 'edit' && (
				<ModalComponent
					active={true}
					title="Изменить Страны"
					handleClose={() => setModalType(null)}
				>
					<div className="w-[300px] mt-4 flex flex-col gap-4">
						<Input
							type="tect"
							value={formValues.name}
							onChange={(e) => handleInputChange('name', e.target.value)}
							placeholder="Добавить страна "
							label="Страна"
						/>
						<Input
							type="number"
							value={formValues.latitude}
							onChange={(e) => handleInputChange('latitude', e.target.value)}
							placeholder="Широта"
							label="Широта"
						/>
						<Input
							type="number"
							value={formValues.longitude}
							onChange={(e) => handleInputChange('longitude', e.target.value)}
							placeholder="Долгота"
							label="Долгота"
						/>
						<p>{formValues.geographicUnitType}</p>
						{/* <Input
							type="text"
							value={formValues.geographicUnitType}
							onChange={(e) =>
								handleInputChange('geographicUnitType', e.target.value)
							}
							placeholder="Тип"
							label="Тип"
						/> */}
						<div className="flex  gap-4">
							<Button
								backgroundColor="black"
								color="white"
								onClick={() => setModalType(null)}
							>
								Отмена
							</Button>
							<Button backgroundColor="#5865F2" onClick={handlePut}>Сохранить</Button>
						</div>
					</div>
				</ModalComponent>
			)}

			{modalType === 'delete' && (
				<ModalComponent
					active={true}
					handleClose={() => setModalType(null)}
					title="Вы точно хотите удалить?"
				>
					<div className="flex items-center gap-5 p-5 bg-gray-50 rounded-lg">
						<Button
							onClick={() => setModalType(null)}
							backgroundColor="black"
							color="white"
						>
							Отмена
						</Button>
						<Button backgroundColor="#5865F2" onClick={handleDelete}>Да</Button>
					</div>
				</ModalComponent>
			)}
		</div>
	)
}
