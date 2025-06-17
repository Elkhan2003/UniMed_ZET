import { useState } from 'react'
import { LayoutContent } from '../../../../components/UI/LayoutContent'
import { useGetUnitsQuery } from '../../../../store/services/branch.service'
import { InoiSelect } from '../../../../components/UI/select'
import { InoiInput } from '../../../../components/UI/input'
import { StyledTitle } from '../../../../shared/styles'
import { Flex } from 'antd'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { usePostBranchMutation } from '../../../../store/services/branch.service'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { InputNumberMask } from '../../../../components/UI/Inputs/InputMask/InputMask'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { BsFillGeoAltFill } from 'react-icons/bs'
import axios from 'axios'

export const yandexApiKey = 'a1dfe19c-2cd2-4246-8cce-6f6ecfc92283'

export const CreateAffiliate = () => {
	const navigate = useNavigate()
	const { data: Untis = [] } = useGetUnitsQuery()
	const [postBranch] = usePostBranchMutation()
	const [branchData, setBranchData] = useState({
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
	})

	const [viewState, setViewState] = useState({
		longitude: branchData?.geographicUnitRequests[1]?.longitude || 0,
		latitude: branchData?.geographicUnitRequests[1]?.latitude || 0,
		zoom: 10,
	})
	const [phoneNumber, setPhoneNumber] = useState('+996')
	const [country, setCountry] = useState<any>('')
	const [regions, setRegions] = useState<any>([])
	const [region, setRegion] = useState<any>({ id: 0, name: '' })
	const [districts, setDistricts] = useState<any>([])
	const [district, setDisctrict] = useState<any>('')
	const [cities, setCities] = useState<any>([])
	const [city, setCity] = useState<any>('')
	const [mikroDistricts, setMikroDistricts] = useState<any>([])
	const [mikroDistrict, setMikroDistrict] = useState<any>('')
	const [potentials, setPotentials] = useState([])
	const [isDisabled, setIsDisabled] = useState(false)
	const [loading, setLoading] = useState(false)

	const changeValue = (e: any, path: string, flik?: boolean) => {
		const value = !flik ? e.target.value : e

		setBranchData((prevData: any) => {
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

	const handlePost = async () => {
		try {
			setLoading(true)
			const response = await postBranch({
				body: branchData,
				phoneNumber: phoneNumber,
			})
			toast.success('Филиал успешно добавлен')
			navigate('/affiliate')
		} catch (error) {
			toast.error('Не удалось добавить филиал')
		} finally {
			setLoading(false)
		}
	}

	const handlePrev = () => {
		navigate(-1)
	}

	const handleAddresses = async (address: string) => {
		if (address) {
			try {
				const addressUnit = branchData.geographicUnitRequests.find(
					(unit: any) => unit.geographicUnitType === 'ADDRESS'
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
				throw error
			}
		} else {
			setPotentials([])
		}
	}

	return (
		<LayoutContent>
			<div
				className="flex items-center cursor-pointer gap-2.5 mb-[20px]"
				onClick={handlePrev}
			>
				<ArrowBackIcon />
				<span className="text-base font-medium">Назад</span>
			</div>
			<StyledTitle>Создание филиала компании</StyledTitle>
			<Flex className="mt-4" vertical gap={10}>
				<Flex align="center" gap={10}>
					<InputNumberMask
						label="Номер телефона"
						required
						onChange={(e) => setPhoneNumber(e)}
						value={phoneNumber}
					/>
					<InoiSelect
						title="Страна"
						required
						placeholder="Выберите страну"
						value={country}
						options={Untis}
						setValue={(e: any) => {
							setCountry({ id: e.id, name: e.name })
							const reversedRegions = [...e.childrenGeographicUnit].reverse()
							setRegions(reversedRegions)
							changeValue(e.latitude, 'geographicUnitRequests.1.latitude', true)
							changeValue(
								e.longitude,
								'geographicUnitRequests.1.longitude',
								true
							)
						}}
					/>
				</Flex>
				<Flex gap={10}>
					<InoiSelect
						title="Область"
						placeholder="Выберите область"
						required
						setValue={(e: any) => {
							setRegion({ id: e.id, name: e.name })
							setDistricts(e.childrenGeographicUnit)
							changeValue(e.latitude, 'geographicUnitRequests.1.latitude', true)
							changeValue(
								e.longitude,
								'geographicUnitRequests.1.longitude',
								true
							)
							changeValue(e.id, 'parentId', true)
						}}
						value={region?.name || ''}
						options={regions}
						noData="Сначала выберите страну!"
					/>
					<InoiSelect
						title="Район"
						placeholder="Выберите район"
						options={districts}
						value={district}
						setValue={(e: any) => {
							setDisctrict(e.name)
							setCities(e.childrenGeographicUnit)
							changeValue(e.latitude, 'geographicUnitRequests.1.latitude', true)
							changeValue(
								e.longitude,
								'geographicUnitRequests.1.longitude',
								true
							)
							changeValue(e.id, 'parentId', true)
						}}
						noData="Сначала выберите область / город!"
						required
					/>
					{!region.name.startsWith('город') &&
						!district.startsWith('город') && (
							<InoiSelect
								title="Город"
								placeholder="Выберите город"
								value={city}
								options={cities}
								setValue={(e: any) => {
									setCity({ id: e.id, name: e.name })
									setMikroDistricts(e.childrenGeographicUnit)
									changeValue(
										e.latitude,
										'geographicUnitRequests.1.latitude',
										true
									)
									changeValue(
										e.longitude,
										'geographicUnitRequests.1.longitude',
										true
									)
									changeValue(e.id, 'parentId', true)
								}}
								noData="Сначала выберите район!"
							/>
						)}
				</Flex>
				<Flex gap={10}>
					<InoiSelect
						title="Микрорайон / Село / Жилмасиив"
						placeholder="Выберите микрорайон"
						options={mikroDistricts}
						value={mikroDistrict}
						setValue={(e: any) => {
							setMikroDistrict({ id: e.id, name: e.name })
							changeValue(e.id, 'parentId', true)
							changeValue(
								e.geographicUnitType,
								'geographicUnitRequests.0.geographicUnitType',
								true
							)
						}}
						noIcon
					/>
					<div className="relative w-[50%]">
						<InoiInput
							value={branchData.geographicUnitRequests[1].name}
							onChange={(e: any) => {
								changeValue(e, 'geographicUnitRequests.1.name')
								handleAddresses(e.target.value)
							}}
							title="Адрес"
							required
							placeholder="Введите адрес"
						/>
						<Flex
							vertical
							className="absolute top-16 left-0 right-0 bg-white rounded-2xl shadow-lg z-50 p-1 max-h-[200px] overflow-y-auto"
						>
							{potentials.map((option: any, index) => (
								<li
									key={index}
									onClick={() => {
										setBranchData((prevData) => {
											const updatedGeographicUnits =
												prevData.geographicUnitRequests.map((unit) =>
													unit.geographicUnitType === 'ADDRESS'
														? {
																...unit,
																latitude: option.location.lat,
																longitude: option.location.lng,
																name: option.name,
															}
														: unit
												)

											return {
												...prevData,
												geographicUnitRequests: updatedGeographicUnits,
											}
										})

										setPotentials([])
									}}
									className="cursor-pointer text-xs px-2 py-1 rounded-md transition-colors duration-200 hover:bg-gray-100"
								>
									{option.name}
								</li>
							))}
						</Flex>
					</div>
				</Flex>
				<Flex gap={10}>
					<InoiInput
						value={branchData.geographicUnitRequests[2].name}
						onChange={(e: any) =>
							changeValue(e, 'geographicUnitRequests.2.name')
						}
						title="Этаж"
						placeholder="Введите этаж"
					/>
					<InoiInput
						value={branchData.geographicUnitRequests[3].name}
						onChange={(e: any) =>
							changeValue(e, 'geographicUnitRequests.3.name')
						}
						title="Номер офиса"
						placeholder="Введите номер офиса"
					/>
				</Flex>
				<div className="w-[300px] h-[200px]">
					<Map
						mapboxAccessToken="pk.eyJ1IjoiYTZ1eGE0IiwiYSI6ImNscGhibWM5aTA1c28ycm1oNGdjYTYybnQifQ.JFaTlYbkSMf395KgTMMkSQ"
						style={{
							width: '100%',
							height: '100%',
							borderRadius: '15px',
						}}
						onClick={(e) => {
							const lat = e.lngLat.lat
							const lng = e.lngLat.lng
							changeValue(lat, 'geographicUnitRequests.1.latitude', true)
							changeValue(lng, 'geographicUnitRequests.1.longitude', true)
						}}
						{...viewState}
						onMove={(evt) => setViewState(evt.viewState)}
						mapStyle="mapbox://styles/a6uxa4/clpish7f200ng01pjdlv8fkcs"
						maxZoom={30}
					>
						<Marker
							latitude={branchData.geographicUnitRequests[1].latitude}
							longitude={branchData.geographicUnitRequests[1].longitude}
							anchor="center"
						>
							<BsFillGeoAltFill size={20} className="text-violet-600" />
						</Marker>
					</Map>
				</div>
				<Flex justify="end">
					<Button
						isLoading={loading}
						disabled={isDisabled}
						onClick={handlePost}
						width="150px"
					>
						Сохранить
					</Button>
				</Flex>
			</Flex>
		</LayoutContent>
	)
}
