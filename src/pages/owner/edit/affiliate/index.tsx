import { useEffect, useState } from 'react'
import { LayoutContent } from '../../../../components/UI/LayoutContent'
import {
	useGetOneBranchQuery,
	useGetUnitsQuery,
	usePutBranchMutation,
} from '../../../../store/services/branch.service'
import { InoiSelect } from '../../../../components/UI/select'
import { InoiInput } from '../../../../components/UI/input'
import { Flex } from 'antd'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { InputNumberMask } from '../../../../components/UI/Inputs/InputMask/InputMask'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { BsFillGeoAltFill } from 'react-icons/bs'
import axios from 'axios'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { yandexApiKey } from '../../create/affiliate'

// Define geographic unit types
type GeographicUnitType =
	| 'COUNTRY'
	| 'REGION'
	| 'CITY'
	| 'DISTRICT'
	| 'RESIDENTIAL_AREA'
	| 'ADDRESS'
	| 'FLOOR'
	| 'OFFICE_NUMBER'

// Interface for geographic unit request
interface GeographicUnitRequest {
	name: string
	latitude: number
	longitude: number
	geographicUnitType: GeographicUnitType
}

// Interface for full address request
interface FullAddressRequest {
	parentId: number
	geographicUnitRequests: GeographicUnitRequest[]
}

// Interface for branch data
interface BranchData {
	phoneNumber: string
	fullAddressRequest: FullAddressRequest
}

// Interface for geographic unit from API
interface GeographicUnit {
	id: number
	name: string
	latitude: number
	longitude: number
	geographicUnitType: GeographicUnitType
	childrenGeographicUnit?: GeographicUnit[]
}

// Interface for branch from API
interface Branch {
	id: number
	phoneNumber: string
	addresses: GeographicUnit[]
	image?: string
	main: boolean
}

// Interface for address search result
interface AddressSearchResult {
	name: string
	location: {
		lat: number
		lng: number
	}
}

// Interface for component props
interface EditAffilateProps {
	isOpen: boolean
	setIsOpen: (prev: boolean) => void
	Units: GeographicUnit[]
	branchId: number
	onSuccess?: () => void
}

// Interface for selected location
interface SelectedLocation {
	id: number
	name: string
}

// Interface for view state
interface ViewState {
	longitude: number
	latitude: number
	zoom: number
}

export const EditAffilate = ({
	isOpen,
	setIsOpen,
	Units,
	branchId,
	onSuccess = () => false,
}: EditAffilateProps): JSX.Element => {
	const navigate = useNavigate()
	const { data: Getting } = useGetOneBranchQuery(branchId, {
		skip: !branchId,
	})
	// Get all geographic units for initialization
	const { data: allUnits } = useGetUnitsQuery()
	const [putBranch, { isLoading: isPutLoading }] = usePutBranchMutation()

	const [branchData, setBranchData] = useState<BranchData>({
		phoneNumber: '',
		fullAddressRequest: {
			parentId: 0,
			geographicUnitRequests: [
				{
					name: '',
					latitude: 0,
					longitude: 0,
					geographicUnitType: 'RESIDENTIAL_AREA',
				},
				{
					name: '',
					latitude: 42.8487765,
					longitude: 74.6077618,
					geographicUnitType: 'ADDRESS',
				},
				{
					name: '',
					latitude: 0,
					longitude: 0,
					geographicUnitType: 'FLOOR',
				},
				{
					name: '',
					latitude: 0,
					longitude: 0,
					geographicUnitType: 'OFFICE_NUMBER',
				},
			],
		},
	})

	const [viewState, setViewState] = useState<ViewState>({
		longitude:
			branchData?.fullAddressRequest?.geographicUnitRequests[1]?.longitude ||
			74.6077618,
		latitude:
			branchData?.fullAddressRequest?.geographicUnitRequests[1]?.latitude ||
			42.8487765,
		zoom: 10,
	})
	const [phoneNumber, setPhoneNumber] = useState<string>('+996')
	const [country, setCountry] = useState<SelectedLocation>({ id: 0, name: '' })
	const [regions, setRegions] = useState<GeographicUnit[]>([])
	const [region, setRegion] = useState<SelectedLocation>({ id: 0, name: '' })
	const [districts, setDistricts] = useState<GeographicUnit[]>([])
	const [district, setDistrict] = useState<string>('')
	const [cities, setCities] = useState<GeographicUnit[]>([])
	const [city, setCity] = useState<SelectedLocation>({ id: 0, name: '' })
	const [mikroDistricts, setMikroDistricts] = useState<GeographicUnit[]>([])
	const [mikroDistrict, setMikroDistrict] = useState<SelectedLocation>({
		id: 0,
		name: '',
	})
	const [potentials, setPotentials] = useState<AddressSearchResult[]>([])
	const [isDisabled, setIsDisabled] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)

	const changeValue = (e: any, path: string, flik?: boolean): void => {
		const value = !flik ? e.target.value : e

		setBranchData((prevData) => {
			const keys = path.split('.')
			let updatedData = { ...prevData }
			let temp: any = updatedData

			keys.forEach((key, index) => {
				if (index === keys.length - 1) {
					temp[key] = value
				} else {
					// Check if the key refers to an array index
					if (!isNaN(parseInt(keys[index + 1]))) {
						if (!Array.isArray(temp[key])) {
							temp[key] = []
						}
					} else if (temp[key] === undefined) {
						temp[key] = {}
					}

					temp = temp[key]
				}
			})

			return updatedData
		})
	}

	const handleUpdate = async (): Promise<void> => {
		try {
			setLoading(true)
			// Fix: using putBranch instead of postBranch since it's an edit
			const response: any = await putBranch({
				branchId: branchId,
				body: {
					phoneNumber: phoneNumber,
					fullAddressRequest: branchData.fullAddressRequest,
				},
			})
			if (response['error']) {
				toast.error(response?.error?.data?.message || 'Произошла ошибка')
			} else {
				toast.success('Филиал успешно обновлен')
				onSuccess()
				setIsOpen(false)
			}
		} catch (error) {
			toast.error('Не удалось обновить филиал')
		} finally {
			setLoading(false)
		}
	}

	const handleAddresses = async (address: string): Promise<void> => {
		if (address) {
			try {
				const addressUnit =
					branchData.fullAddressRequest.geographicUnitRequests.find(
						(unit) => unit.geographicUnitType === 'ADDRESS'
					)

				const longitude = addressUnit?.longitude || 0
				const latitude = addressUnit?.latitude || 0

				const response = await axios.get(
					`https://geocode-maps.yandex.ru/1.x/`,
					{
						params: {
							apikey: yandexApiKey,
							geocode: address,
							format: 'json',
							ll: `${longitude},${latitude}`,
							spn: '0.1,0.1',
						},
					}
				)

				const geoObjects =
					response.data.response.GeoObjectCollection.featureMember

				if (geoObjects.length === 0) {
					return
				}

				const results = geoObjects.map((item: any) => {
					const geoObject = item.GeoObject
					const [longitude, latitude] = geoObject.Point.pos.split(' ')

					return {
						name: geoObject.metaDataProperty.GeocoderMetaData.text,
						location: {
							lat: parseFloat(latitude),
							lng: parseFloat(longitude),
						},
					}
				})

				setPotentials(results)
				return
			} catch (error) {
				console.error('Error fetching addresses:', error)
				toast.error('Ошибка при поиске адреса')
			}
		} else {
			setPotentials([])
		}
	}

	// Initialize regions when country is selected
	useEffect(() => {
		if (allUnits && allUnits.length > 0) {
			// Find the Kyrgyzstan country unit or use the first unit
			const kyrgyzstan =
				allUnits.find((unit: GeographicUnit) => unit.id === 1) || allUnits[0]

			if (kyrgyzstan) {
				// Pre-select this country if no country is selected yet
				if (country.id === 0) {
					setCountry({ id: kyrgyzstan.id, name: kyrgyzstan.name })
				}

				// Set the regions from the country's children
				if (
					kyrgyzstan.childrenGeographicUnit &&
					kyrgyzstan.childrenGeographicUnit.length > 0
				) {
					const reversedRegions = [
						...kyrgyzstan.childrenGeographicUnit,
					].reverse()
					setRegions(reversedRegions)
				}
			}
		}
	}, [allUnits, country.id])

	// Fix: Updated to handle the correct data structure
	useEffect(() => {
		if (Getting) {
			setPhoneNumber(Getting.phoneNumber || '+996')

			// Initialize address data structure
			const newBranchData: BranchData = {
				phoneNumber: Getting.phoneNumber || '',
				fullAddressRequest: {
					parentId: 0,
					geographicUnitRequests: [
						{
							name: '',
							latitude: 0,
							longitude: 0,
							geographicUnitType: 'RESIDENTIAL_AREA',
						},
						{
							name: '',
							latitude: 42.8487765,
							longitude: 74.6077618,
							geographicUnitType: 'ADDRESS',
						},
						{
							name: '',
							latitude: 0,
							longitude: 0,
							geographicUnitType: 'FLOOR',
						},
						{
							name: '',
							latitude: 0,
							longitude: 0,
							geographicUnitType: 'OFFICE_NUMBER',
						},
					],
				},
			}

			// Process addresses from the fetched data
			if (Getting.addresses && Array.isArray(Getting.addresses)) {
				Getting.addresses.forEach((item: GeographicUnit) => {
					switch (item.geographicUnitType) {
						case 'COUNTRY':
							setCountry({ id: item.id, name: item.name })
							break
						case 'REGION':
							setRegion({ id: item.id, name: item.name })
							break
						case 'DISTRICT':
							setDistrict(item.name)
							break
						case 'CITY':
							setCity({ id: item.id, name: item.name })
							break
						case 'RESIDENTIAL_AREA':
							// Update the residential area in geographicUnitRequests array
							const residentialIndex =
								newBranchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'RESIDENTIAL_AREA'
								)
							if (residentialIndex !== -1) {
								newBranchData.fullAddressRequest.geographicUnitRequests[
									residentialIndex
								] = {
									...newBranchData.fullAddressRequest.geographicUnitRequests[
										residentialIndex
									],
									name: item.name,
									latitude: item.latitude || 0,
									longitude: item.longitude || 0,
								}
							}
							break
						case 'ADDRESS':
							// Update the address in geographicUnitRequests array
							const addressIndex =
								newBranchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'ADDRESS'
								)
							if (addressIndex !== -1) {
								newBranchData.fullAddressRequest.geographicUnitRequests[
									addressIndex
								] = {
									...newBranchData.fullAddressRequest.geographicUnitRequests[
										addressIndex
									],
									name: item.name,
									latitude: item.latitude || 42.8487765,
									longitude: item.longitude || 74.6077618,
								}

								// Update map view state
								setViewState({
									longitude: item.longitude || 74.6077618,
									latitude: item.latitude || 42.8487765,
									zoom: 10,
								})
							}
							break
						case 'FLOOR':
							// Update the floor in geographicUnitRequests array
							const floorIndex =
								newBranchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'FLOOR'
								)
							if (floorIndex !== -1) {
								newBranchData.fullAddressRequest.geographicUnitRequests[
									floorIndex
								] = {
									...newBranchData.fullAddressRequest.geographicUnitRequests[
										floorIndex
									],
									name: item.name,
								}
							}
							break
						case 'OFFICE_NUMBER':
							// Update the office number in geographicUnitRequests array
							const officeIndex =
								newBranchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'OFFICE_NUMBER'
								)
							if (officeIndex !== -1) {
								newBranchData.fullAddressRequest.geographicUnitRequests[
									officeIndex
								] = {
									...newBranchData.fullAddressRequest.geographicUnitRequests[
										officeIndex
									],
									name: item.name,
								}
							}
							break
					}
				})

				// Set the parent ID from the most specific geographic unit
				if (Getting.addresses.length > 0) {
					const mostSpecificUnit = Getting.addresses.find(
						(addr: GeographicUnit) =>
							addr.geographicUnitType === 'RESIDENTIAL_AREA' ||
							addr.geographicUnitType === 'CITY' ||
							addr.geographicUnitType === 'DISTRICT'
					)

					if (mostSpecificUnit) {
						newBranchData.fullAddressRequest.parentId = mostSpecificUnit.id
					}
				}
			}

			// Update the branch data state
			setBranchData(newBranchData)
		}
	}, [Getting])

	useEffect(() => {
		if (allUnits && allUnits.length > 0) {

			const countryUnit = allUnits.find(
				(unit: GeographicUnit) =>
					unit.geographicUnitType === 'COUNTRY' && unit.id === 1
			)

			if (countryUnit) {

				if (country.id === 0) {
					setCountry({
						id: countryUnit.id,
						name: countryUnit.name,
					})
				}

				if (Getting && Getting.addresses) {
					const regionAddress = Getting.addresses.find(
						(addr: any) => addr.geographicUnitType === 'REGION'
					)

					if (regionAddress && countryUnit.childrenGeographicUnit) {
						const allRegions = [...countryUnit.childrenGeographicUnit].reverse()
						setRegions(allRegions)

						const matchingRegion = countryUnit.childrenGeographicUnit.find(
							(r: any) => r.id === regionAddress.id
						)

						if (matchingRegion) {
							setRegion({
								id: matchingRegion.id,
								name: matchingRegion.name,
							})

							if (matchingRegion.childrenGeographicUnit) {
								setDistricts(matchingRegion.childrenGeographicUnit)

								const districtAddress = Getting.addresses.find(
									(addr: any) => addr.geographicUnitType === 'DISTRICT'
								)

								if (districtAddress) {
									const matchingDistrict =
										matchingRegion.childrenGeographicUnit.find(
											(d: any) => d.id === districtAddress.id
										)

									if (matchingDistrict) {
										setDistrict(matchingDistrict.name)

										if (matchingDistrict.childrenGeographicUnit) {
											setCities(matchingDistrict.childrenGeographicUnit)
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}, [allUnits, Getting])

	useEffect(() => {
		const addressUnit =
			branchData.fullAddressRequest.geographicUnitRequests.find(
				(unit) => unit.geographicUnitType === 'ADDRESS'
			)

		const isValid =
			phoneNumber.length >= 10 &&
			country.id > 0 &&
			region.id > 0 &&
			district &&
			addressUnit &&
			addressUnit.name

		setIsDisabled(!isValid)
	}, [phoneNumber, country, region, district, branchData])

	return (
		<ModalComponent
			title={'Редактирование филиала'}
			active={isOpen}
			handleClose={() => setIsOpen(false)}
		>
			<Flex className="mt-4 w-[600px]" vertical gap={10}>
				<Flex gap={10}>
					<InputNumberMask
						label="Номер телефона"
						required
						onChange={(e: string) => setPhoneNumber(e)}
						value={phoneNumber}
					/>
					<InoiSelect
						title="Страна"
						required
						placeholder="Выберите страну"
						value={country.name}
						options={allUnits || Units}
						setValue={(e: GeographicUnit) => {
							setCountry({ id: e.id, name: e.name })
							if (
								e.childrenGeographicUnit &&
								e.childrenGeographicUnit.length > 0
							) {
								const reversedRegions = [...e.childrenGeographicUnit].reverse()
								setRegions(reversedRegions)
							} else {
								setRegions([])
							}

							setRegion({ id: 0, name: '' })
							setDistrict('')
							setCity({ id: 0, name: '' })
							setMikroDistrict({ id: 0, name: '' })

							const addressIndex =
								branchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'ADDRESS'
								)

							if (addressIndex !== -1) {
								changeValue(
									e.latitude || 0,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.latitude`,
									true
								)
								changeValue(
									e.longitude || 0,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.longitude`,
									true
								)

								setViewState({
									longitude: e.longitude || 74.6077618,
									latitude: e.latitude || 42.8487765,
									zoom: 10,
								})
							}

							changeValue(e.id, 'fullAddressRequest.parentId', true)
						}}
					/>
				</Flex>
				<Flex gap={10}>
					<InoiSelect
						title="Область"
						placeholder="Выберите область"
						required
						setValue={(e: GeographicUnit) => {
							setRegion({ id: e.id, name: e.name })
							setDistricts(e.childrenGeographicUnit || [])

							changeValue(e.id, 'fullAddressRequest.parentId', true)

							const addressIndex =
								branchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'ADDRESS'
								)

							if (addressIndex !== -1) {
								changeValue(
									e.latitude || 0,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.latitude`,
									true
								)
								changeValue(
									e.longitude || 0,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.longitude`,
									true
								)

								setViewState({
									longitude: e.longitude || 74.6077618,
									latitude: e.latitude || 42.8487765,
									zoom: 10,
								})
							}
						}}
						value={region.name || ''}
						options={regions}
						noData="Сначала выберите страну!"
					/>
					<InoiSelect
						title="Район"
						placeholder="Выберите район"
						options={districts}
						value={district}
						setValue={(e: GeographicUnit) => {
							setDistrict(e.name)
							// Check if childrenGeographicUnit exists and has items
							if (
								e.childrenGeographicUnit &&
								e.childrenGeographicUnit.length > 0
							) {
								setCities(e.childrenGeographicUnit)
							} else {
								setCities([])
							}

							// Reset downstream selections
							setCity({ id: 0, name: '' })
							setMikroDistrict({ id: 0, name: '' })

							// Update the parent ID for the request
							changeValue(e.id, 'fullAddressRequest.parentId', true)

							// Update the address coordinates with district coordinates
							const addressIndex =
								branchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'ADDRESS'
								)

							if (addressIndex !== -1) {
								changeValue(
									e.latitude || 0,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.latitude`,
									true
								)
								changeValue(
									e.longitude || 0,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.longitude`,
									true
								)

								// Update map view
								setViewState({
									longitude: e.longitude || 74.6077618,
									latitude: e.latitude || 42.8487765,
									zoom: 10,
								})
							}
						}}
						noData="Сначала выберите область / город!"
						required
					/>
				</Flex>
				<Flex gap={10}>
					{!region?.name?.startsWith('город') &&
						!district.startsWith('город') && (
							<InoiSelect
								title="Город"
								placeholder="Выберите город"
								value={city.name}
								options={cities}
								setValue={(e: GeographicUnit) => {
									setCity({ id: e.id, name: e.name })
									setMikroDistricts(e.childrenGeographicUnit || [])

									// Update the parent ID for the request
									changeValue(e.id, 'fullAddressRequest.parentId', true)

									// Update the address coordinates with city coordinates
									const addressIndex =
										branchData.fullAddressRequest.geographicUnitRequests.findIndex(
											(unit) => unit.geographicUnitType === 'ADDRESS'
										)

									if (addressIndex !== -1) {
										changeValue(
											e.latitude || 0,
											`fullAddressRequest.geographicUnitRequests.${addressIndex}.latitude`,
											true
										)
										changeValue(
											e.longitude || 0,
											`fullAddressRequest.geographicUnitRequests.${addressIndex}.longitude`,
											true
										)

										// Update map view
										setViewState({
											longitude: e.longitude || 74.6077618,
											latitude: e.latitude || 42.8487765,
											zoom: 10,
										})
									}
								}}
								noData="Сначала выберите район!"
							/>
						)}
					<InoiSelect
						title="Микрорайон / Село / Жилмасиив"
						placeholder="Выберите микрорайон"
						options={mikroDistricts}
						value={mikroDistrict.name}
						setValue={(e: GeographicUnit) => {
							setMikroDistrict({ id: e.id, name: e.name })

							// Update the parent ID for the request
							changeValue(e.id, 'fullAddressRequest.parentId', true)

							// Update the residential area in geographicUnitRequests
							const residentialIndex =
								branchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'RESIDENTIAL_AREA'
								)

							if (residentialIndex !== -1) {
								changeValue(
									e.name,
									`fullAddressRequest.geographicUnitRequests.${residentialIndex}.name`,
									true
								)
							}
						}}
						noIcon
					/>
				</Flex>
				<div className="relative w-full">
					<InoiInput
						value={
							branchData.fullAddressRequest.geographicUnitRequests.find(
								(unit) => unit.geographicUnitType === 'ADDRESS'
							)?.name || ''
						}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							// Find the index of the ADDRESS unit
							const addressIndex =
								branchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'ADDRESS'
								)

							if (addressIndex !== -1) {
								changeValue(
									e,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.name`
								)
								handleAddresses(e.target.value)
							}
						}}
						title="Адрес"
						required
						placeholder="Введите адрес"
					/>
					<Flex
						vertical
						className="absolute top-16 left-0 right-0 bg-white rounded-2xl shadow-lg z-50 p-1 max-h-[200px] overflow-y-auto"
					>
						{potentials.map((option: AddressSearchResult, index: number) => (
							<li
								key={index}
								onClick={() => {
									// Find the index of the ADDRESS unit
									const addressIndex =
										branchData.fullAddressRequest.geographicUnitRequests.findIndex(
											(unit) => unit.geographicUnitType === 'ADDRESS'
										)

									if (addressIndex !== -1) {
										changeValue(
											option.location.lat,
											`fullAddressRequest.geographicUnitRequests.${addressIndex}.latitude`,
											true
										)
										changeValue(
											option.location.lng,
											`fullAddressRequest.geographicUnitRequests.${addressIndex}.longitude`,
											true
										)
										changeValue(
											option.name,
											`fullAddressRequest.geographicUnitRequests.${addressIndex}.name`,
											true
										)

										// Update map view
										setViewState({
											longitude: option.location.lng,
											latitude: option.location.lat,
											zoom: 14, // Zoom in more for specific address
										})
									}

									setPotentials([])
								}}
								className="cursor-pointer text-xs px-2 py-1 rounded-md transition-colors duration-200 hover:bg-gray-100"
							>
								{option.name}
							</li>
						))}
					</Flex>
				</div>
				<Flex gap={10}>
					<InoiInput
						value={
							branchData.fullAddressRequest.geographicUnitRequests.find(
								(unit) => unit.geographicUnitType === 'FLOOR'
							)?.name || ''
						}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							// Find the index of the FLOOR unit
							const floorIndex =
								branchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'FLOOR'
								)

							if (floorIndex !== -1) {
								changeValue(
									e,
									`fullAddressRequest.geographicUnitRequests.${floorIndex}.name`
								)
							}
						}}
						title="Этаж"
						placeholder="Введите этаж"
					/>
					<InoiInput
						value={
							branchData.fullAddressRequest.geographicUnitRequests.find(
								(unit) => unit.geographicUnitType === 'OFFICE_NUMBER'
							)?.name || ''
						}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							// Find the index of the OFFICE_NUMBER unit
							const officeIndex =
								branchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'OFFICE_NUMBER'
								)

							if (officeIndex !== -1) {
								changeValue(
									e,
									`fullAddressRequest.geographicUnitRequests.${officeIndex}.name`
								)
							}
						}}
						title="Номер офиса"
						placeholder="Введите номер офиса"
					/>
				</Flex>
				<div className="w-full h-[200px]">
					<Map
						mapboxAccessToken="pk.eyJ1IjoiYTZ1eGE0IiwiYSI6ImNscGhibWM5aTA1c28ycm1oNGdjYTYybnQifQ.JFaTlYbkSMf395KgTMMkSQ"
						style={{
							width: '100%',
							height: '100%',
							borderRadius: '15px',
						}}
						onClick={(e: any) => {
							const lat = e.lngLat.lat
							const lng = e.lngLat.lng

							// Find the index of the ADDRESS unit
							const addressIndex =
								branchData.fullAddressRequest.geographicUnitRequests.findIndex(
									(unit) => unit.geographicUnitType === 'ADDRESS'
								)

							if (addressIndex !== -1) {
								changeValue(
									lat,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.latitude`,
									true
								)
								changeValue(
									lng,
									`fullAddressRequest.geographicUnitRequests.${addressIndex}.longitude`,
									true
								)
							}
						}}
						{...viewState}
						onMove={(evt: any) => setViewState(evt.viewState)}
						mapStyle="mapbox://styles/a6uxa4/clpish7f200ng01pjdlv8fkcs"
						maxZoom={30}
					>
						<Marker
							latitude={
								branchData.fullAddressRequest.geographicUnitRequests.find(
									(unit) => unit.geographicUnitType === 'ADDRESS'
								)?.latitude || 42.8487765
							}
							longitude={
								branchData.fullAddressRequest.geographicUnitRequests.find(
									(unit) => unit.geographicUnitType === 'ADDRESS'
								)?.longitude || 74.6077618
							}
							anchor="center"
						>
							<BsFillGeoAltFill size={20} className="text-violet-600" />
						</Marker>
					</Map>
				</div>
				<Flex justify="end">
					<Button
						isLoading={loading || isPutLoading}
						disabled={isDisabled}
						onClick={handleUpdate}
						width="150px"
					>
						Сохранить
					</Button>
				</Flex>
			</Flex>
		</ModalComponent>
	)
}
