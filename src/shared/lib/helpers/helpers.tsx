import { useState, useEffect } from 'react'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ErrorResponse } from '../../../common/IErrorMessage'
import { ALLOWED_NUMBERS, HOST } from '../constants/constants'
import axiosInstance from '../../api/axios-config'
import { addDays, format, intervalToDuration } from 'date-fns'

export const getCountVisit = (count: number) => {
	const text = 'визит'
	return count < 2 ? `Первый ${text}` : `${count} ${text}`
}

export function timeDifferenceInMinutes(
	startDataValue: any,
	endDataValue: any
) {
	const [startHour, startMinute] = startDataValue.split(':').map(Number)
	const [endHour, endMinute] = endDataValue.split(':').map(Number)

	const startTimeInMinutes = startHour * 60 + startMinute
	const endTimeInMinutes = endHour * 60 + endMinute
	return endTimeInMinutes - startTimeInMinutes
}

export const findCurremtTime = (hour: number, minute: number): boolean => {
	const date = new Date()
	const currentHour = date.getHours()
	const currentMinutes = date.getMinutes()

	if (currentHour === hour) {
		const nextInterval = (minute + 15) % 60
		return currentMinutes >= minute && currentMinutes < nextInterval
	}

	return false
}

export const calculateEndTimeDrop = (startTime: any, fullDuration: any) => {
	const [startHours, startMinutes] = startTime.split(':').map(Number)
	let hours = Math.floor(fullDuration / 60)
	let minutes = fullDuration % 60
	let endHours = startHours + hours
	let endMinutes = startMinutes + minutes
	if (endMinutes >= 60) {
		endMinutes -= 60
		endHours++
	}
	const formattedEndHours = endHours.toString().padStart(2, '0')
	const formattedEndMinutes = endMinutes.toString().padStart(2, '0')
	const endTime = `${formattedEndHours}:${formattedEndMinutes}:00`
	return endTime
}

export const getPaymentType = (obj: any) => {
	switch (obj) {
		case 'CASH':
			return 'наличные'
		case 'MBANK':
			return 'мбанк'
		case 'OPTIMA':
			return 'оптима'
		case 'CARD':
			return 'без нал, карт'
		case 'BONUS':
			return 'бонус'
		default:
			return ''
	}
}

export const formatDate = (dateString: any) => {
	const months = [
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря',
	]

	const date = new Date(dateString)
	const day = date.getDate()
	const monthIndex = date.getMonth()
	const year = date.getFullYear()

	return `${day} ${months[monthIndex]} ${year} год`
}

export const getCompensationType = (type: any) => {
	switch (type) {
		case 'FIXED':
			return 'фиксированный'
		case 'PERCENT':
			return 'процент %'
		default:
			return ''
	}
}

export function formatDateToRussian(dateString: any, str = 'года') {
	const months = [
		'января',
		'февраля',
		'марта',
		'апреля',
		'мая',
		'июня',
		'июля',
		'августа',
		'сентября',
		'октября',
		'ноября',
		'декабря',
	]

	const dateParts = dateString.split('-')
	const monthIndex = parseInt(dateParts[1]) - 1
	const day = dateParts[2]

	const formattedDate = `${Number(day)} ${months[monthIndex]}`
	return formattedDate
}

export const saveTolocalStorage = (key: any, data: any) => {
	try {
		localStorage.setItem(key, JSON.stringify(data))
	} catch (error) {
		window.alert((error as Error).message)
	}
}
export function TranslateWeekShort(name: string) {
	switch (name) {
		case 'Monday':
			return 'Пн'
		case 'Tuesday':
			return 'Вт'
		case 'Wednesday':
			return 'Ср'
		case 'Thursday':
			return 'Чт'
		case 'Friday':
			return 'Пт'
		case 'Saturday':
			return 'Сб'
		case 'Sunday':
			return 'Вс'
	}
}

export function TranslateWeekShortTall(name: string) {
	switch (name) {
		case 'MONDAY':
			return 'Пн'
		case 'TUESDAY':
			return 'Вт'
		case 'WEDNESDAY':
			return 'Ср'
		case 'THURSDAY':
			return 'Чт'
		case 'FRIDAY':
			return 'Пт'
		case 'SATURDAY':
			return 'Сб'
		case 'SUNDAY':
			return 'Вс'
	}
}

export function TranslateWeekShortUFullName(name: string) {
	switch (name) {
		case 'MONDAY':
			return 'Понедельник'
		case 'TUESDAY':
			return 'Вторник'
		case 'WEDNESDAY':
			return 'Среда'
		case 'THURSDAY':
			return 'Четверг'
		case 'FRIDAY':
			return 'Пятница'
		case 'SATURDAY':
			return 'Суббота'
		case 'SUNDAY':
			return 'Воскресенье'
	}
}

export const TypeCompanyGenrate = (item: string) => {
	switch (item) {
		case 'barbershop':
			return 'Барбершоп'
		case 'beauty_salon':
			return 'Салон красоты'
		case 'medical':
			return 'Клиника'
		default:
			break
	}
}

export function TranslateAppointmentStatus(name: string) {
	switch (name) {
		case 'IN_PROCESSING':
			return 'Не подтвержден'
		case 'CONFIRMED':
			return 'Подтвержден'
		case 'ARRIVE':
			return 'В работе'
		case 'COMPLETED':
			return 'Завершенный'
		case 'CANCELED':
			return 'Отменен'
		case 'NOT_COME':
			return 'Не пришел'
	}
}

export const convertPayment = (type: string) => {
	switch (type) {
		case 'CASH':
			return 'Наличные'
		case 'CARD':
			return 'Карта'
		case 'MBANK':
			return 'MBANK'
		case 'OPTIMA':
			return 'OPTIMA'
		case 'DISCOUNT':
			return 'Скидка'
		case 'BONUS':
			return 'Бонус'
		case 'BONUS_PAYMENT':
			return 'Бонус'
		case 'BALANCE_PAYMENT':
			return 'Баланс'
		case 'BALANCE':
			return 'Баланс'
		case 'QR_CODE':
			return 'QR-код'
		default:
			return ''
	}
}

export const AppointmentStatusLinear = (
	appointmentStatus: string
): { label: string; value: string; message: string } => {
	let label = ''
	let value = ''
	let message = ''

	switch (appointmentStatus) {
		case 'IN_PROCESSING':
			label = 'Подтвердить запись'
			value = 'CONFIRMED'
			message = 'Запись подтвержден'
			break
		case 'CONFIRMED':
			label = 'Начать запись'
			value = 'ARRIVE'
			message = 'Запись началась'
			break
		case 'ARRIVE':
			label = 'Завершить'
			value = 'COMPLETED'
			break
		default:
			break
	}

	return { label, value, message }
}

export const filterArrayThroughIDBeforeArray = (
	arr: any,
	id: number | number[],
	idname: string,
	label: string
) => {
	if (typeof id === 'number') {
		if (arr.length !== 0) {
			const object = arr?.filter((el: any) => el[idname] === id)[0]
			const labelAll = label.split('-')
			if (object) {
				if (labelAll.length >= 2) {
					return {
						label: labelAll
							.map((item: any) => {
								return `${object[item]}`
							})
							.join(' '),
						value: object[idname],
					}
				} else {
					return { label: object[label], value: object[idname] }
				}
			} else {
				return null
			}
		} else {
			return null
		}
	} else {
		return arr
	}
}

export const translateObject = (item: any) => {
	if (item) {
		if (item?.length === undefined) {
			return item.value || item.id
		} else {
			return item.map(
				(el: { label: string | number; value: number }) => el.value
			)
		}
	} else {
		return ''
	}
}

export function calculateEndTime(
	startTime: string,
	fullDuration: number
): string {
	const [startHours, startMinutes] = startTime.split(':').map(Number)
	let hours = Math.floor(fullDuration / 60)
	let minutes = fullDuration % 60
	let endHours = startHours + hours
	let endMinutes = startMinutes + minutes
	if (endMinutes >= 60) {
		endMinutes -= 60
		endHours++
	}
	const formattedEndHours = endHours.toString().padStart(2, '0')
	const formattedEndMinutes = endMinutes.toString().padStart(2, '0')
	const endTime = `${formattedEndHours}:${formattedEndMinutes}:00`
	return endTime
}

export const countDuration = (arr: any) => {
	if (Array.isArray(arr) && arr.length !== 0) {
		const value = arr.reduce(
			(
				acc: number,
				item: {
					label: string | number
					value: number
					duration: number
				}
			) => acc + item.duration,
			0
		)
		return value
	} else {
		return 0
	}
}

export function AppointmentStatusColor(type: string) {
	const storedColors = localStorage.getItem('COLORS')

	const colors = storedColors
		? JSON.parse(storedColors)
		: {
				CANCELED: '#FF5E5E',
				CONFIRMED: '#0EA5E9',
				ARRIVE: '#F4CE36',
				COMPLETED: '#3FC24C',
				IN_PROCESSING: '#101010',
				NOT_COME: '#FF8A24',
			}

	const color = colors[type]

	return color
}

export const getMonday = (date: string) => {
	const inputDate = new Date(date)
	const dayOfWeek = inputDate.getDay()

	if (dayOfWeek === 1) {
		return inputDate.toISOString().slice(0, 10)
	} else {
		const monday = new Date(inputDate)
		monday.setDate(inputDate.getDate() - ((dayOfWeek + 7) % 7) + 1)
		return monday.toISOString().slice(0, 10)
	}
}

export const getSunday = (date: string) => {
	const inputDate = new Date(date)
	const dayOfWeek = inputDate.getDay()
	if (dayOfWeek === 0) {
		return inputDate.toISOString().slice(0, 10)
	} else {
		const sunday = new Date(inputDate)
		const daysUntilNextSunday = 7 - dayOfWeek
		sunday.setDate(inputDate.getDate() + daysUntilNextSunday)
		return sunday.toISOString().slice(0, 10)
	}
}

export const destructuringMessage = (error: unknown) => {
	const errorResponse = (error as ErrorResponse).response
	const errorMessage = errorResponse?.data?.message || (error as Error).message
	return errorMessage
}

export const translateDuration = (time: number) => {
	const hour = Math.floor(time / 60)
	const minute = time % 60
	const formattedHour = hour.toString().padStart(2, '0')
	const formattedMinute = minute.toString().padStart(2, '0')
	if (hour !== 0) {
		return `${formattedHour}:${formattedMinute}час`
	} else {
		return `${minute}мин`
	}
}

export const translateDurationToNumber = (time: string | number) => {
	if (typeof time === 'string') {
		if (time.split('').includes('м')) {
			return +time.slice(0, 2)
		} else {
			const [minutes, seconds] = time.split(':')
			const totalSecs = parseInt(minutes) * 60 + parseInt(seconds)
			return totalSecs
		}
	} else {
		return 30
	}
}

export const HostGenerator = (domain: string, branchId: any, main: boolean) => {
	if (main) {
		return (window.location.href = `https://${domain}.${HOST}`)
	} else {
		return (window.location.href = `https://${domain}.${HOST}/${branchId}`)
	}
}
export function setCookie(name: any, value: any, days: any, domain: any) {
	var expires = ''
	if (days) {
		var date = new Date()
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
		expires = '; expires=' + date.toUTCString()
	}
	document.cookie =
		name + '=' + (value || '') + expires + '; path=/; domain=' + domain
}

export function deleteCookie(name: any, domain: string) {
	return new Promise((resolve, reject) => {
		try {
			document.cookie =
				name +
				'=; expires=Thu, 01 Jan 1970 00:00:01 GMT;' +
				(domain ? ' domain=' + domain + ';' : '')
			resolve(`Cookie ${name} удален`)
		} catch (error) {
			reject(error)
		}
	})
}

export function getCookie(name: any) {
	var value = '; ' + document.cookie
	var parts = value.split('; ' + name + '=')
	if (parts.length === 2) return parts.pop()?.split(';').shift()
}

export const getColorTextStyle = (categoryType: string, pathname: any) => {
	const parts = pathname.split('/')
	const serviceBack = parts[2]
	if (
		serviceBack ||
		pathname.split('/')[1] === 'profile' ||
		pathname.split('/')[1] === 'history'
	) {
		return { color: 'grey' }
	} else {
		switch (categoryType) {
			case 'barbershop':
			case 'beauty_salon':
				return { color: 'white' }
			default:
				return { color: 'grey' }
		}
	}
}

export const handleResize = () => {
	if (window.innerWidth < 1100 && window.innerWidth > 850) {
		return 4
	}
	if (window.innerWidth < 850 && window.innerWidth > 600) {
		return 3
	}
	if (window.innerWidth < 600 && window.innerWidth > 450) {
		return 2
	}
	if (window.innerWidth < 450 && window.innerWidth > 300) {
		return 1
	}
	if (window.innerWidth > 1100) {
		return 6
	}
	return 6
}

export const convertPhoneNumber = (phoneNumber: string | undefined) => {
	if (!phoneNumber) return '+996 (XXX) XXX-XXX'
	const numberOnly = phoneNumber?.replace(/\D/g, '')

	const formattedNumber = `+996 (${numberOnly?.slice(
		3,
		6
	)}) ${numberOnly?.slice(6, 9)}-${numberOnly?.slice(9, 12)}`

	return formattedNumber
}

export const isNumeric = (string: string) => /^[+-]?\d+(\.\d+)?$/.test(string)

export const s3FileThunk = createAsyncThunk(
	's3/uploadFile',
	async (file: File, { rejectWithValue }) => {
		const formData = new FormData()
		formData.append('file', file)

		try {
			const response = await axiosInstance.post('/files', formData)
			return response.data
		} catch (error) {
			return rejectWithValue((error as Error).message)
		}
	}
)

export const filterAllowedNumbers = (input: string) => {
	return input
		.split('')
		.filter((char: string) => ALLOWED_NUMBERS.includes(char))
		.join('')
}

export const convertStatus = (status: string) => {
	switch (status) {
		case 'NOT_COME':
			return (
				<div className="flex bg-[#FF8A24] items-center gap-[5px] px-3 h-[34px] rounded-[8px] w-fit">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15 16L20 21M20 16L15 21M11 14C7.13401 14 4 17.134 4 21H11M15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
							stroke="white"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<p className="text-[#FFFFFF] font-[600] text-[14px]">Не пришел</p>
				</div>
			)
		case 'IN_PROCESSING':
			return (
				<div className="flex bg-[#E8EAED] items-center gap-[5px] px-3 h-[34px] rounded-[16px] w-fit">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M4 21H3C3 21.5523 3.44772 22 4 22V21ZM11.8584 15.0608C12.4051 15.139 12.9117 14.7592 12.9899 14.2125C13.0681 13.6658 12.6883 13.1592 12.1416 13.081L11.8584 15.0608ZM14 22C14.5523 22 15 21.5523 15 21C15 20.4477 14.5523 20 14 20V22ZM17.2899 17.2929C16.8994 17.6834 16.8994 18.3166 17.2899 18.7071C17.6804 19.0976 18.3136 19.0976 18.7041 18.7071L17.2899 17.2929ZM15.0916 14.7507C14.9539 15.2856 15.2759 15.8308 15.8107 15.9684C16.3456 16.1061 16.8908 15.7841 17.0284 15.2493L15.0916 14.7507ZM17.997 20C17.4447 20 16.997 20.4477 16.997 21C16.997 21.5523 17.4447 22 17.997 22V20ZM18.007 22C18.5593 22 19.007 21.5523 19.007 21C19.007 20.4477 18.5593 20 18.007 20V22ZM14 7C14 8.65685 12.6569 10 11 10V12C13.7614 12 16 9.76142 16 7H14ZM11 10C9.34315 10 8 8.65685 8 7H6C6 9.76142 8.23858 12 11 12V10ZM8 7C8 5.34315 9.34315 4 11 4V2C8.23858 2 6 4.23858 6 7H8ZM11 4C12.6569 4 14 5.34315 14 7H16C16 4.23858 13.7614 2 11 2V4ZM5 21C5 17.6863 7.68629 15 11 15V13C6.58172 13 3 16.5817 3 21H5ZM11 15C11.292 15 11.5786 15.0208 11.8584 15.0608L12.1416 13.081C11.7682 13.0276 11.387 13 11 13V15ZM4 22H14V20H4V22ZM18.997 15.5C18.997 15.6732 18.9515 15.8053 18.6775 16.0697C18.5238 16.218 18.3428 16.3653 18.0919 16.574C17.8536 16.7723 17.5741 17.0087 17.2899 17.2929L18.7041 18.7071C18.92 18.4913 19.1405 18.3033 19.3709 18.1116C19.5887 17.9305 19.8452 17.7223 20.0665 17.5087C20.5425 17.0493 20.997 16.4314 20.997 15.5H18.997ZM17.997 14.5C18.5493 14.5 18.997 14.9477 18.997 15.5H20.997C20.997 13.8431 19.6538 12.5 17.997 12.5V14.5ZM17.0284 15.2493C17.1395 14.8177 17.5324 14.5 17.997 14.5V12.5C16.5977 12.5 15.4245 13.457 15.0916 14.7507L17.0284 15.2493ZM17.997 22H18.007V20H17.997V22Z"
							fill="black"
						/>
					</svg>
					<p className="text-black font-[600] text-[14px]">Не подтвержден</p>
				</div>
			)
		case 'CONFIRMED':
			return (
				<div className="flex bg-[#D2F1FF] items-center gap-[5px] px-3 h-[30px] rounded-[16px] w-fit">
					<svg
						width="17"
						height="17"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10.5 21H4C4 17.4735 6.60771 14.5561 10 14.0709M16.4976 16.2119C15.7978 15.4328 14.6309 15.2232 13.7541 15.9367C12.8774 16.6501 12.7539 17.843 13.4425 18.6868C13.8312 19.1632 14.7548 19.9983 15.4854 20.6353C15.8319 20.9374 16.0051 21.0885 16.2147 21.1503C16.3934 21.203 16.6018 21.203 16.7805 21.1503C16.9901 21.0885 17.1633 20.9374 17.5098 20.6353C18.2404 19.9983 19.164 19.1632 19.5527 18.6868C20.2413 17.843 20.1329 16.6426 19.2411 15.9367C18.3492 15.2307 17.1974 15.4328 16.4976 16.2119ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z"
							stroke="#0EA5E9"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<p className="text-[#0EA5E9] font-[600] text-[14px]">Подтвержден</p>
				</div>
			)
		case 'ARRIVE':
			return (
				<div className="flex bg-[#FFF7D9] items-center gap-[5px] px-3 h-[34px] rounded-[16px] w-fit">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.865 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
							fill="#F4B836"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M15.39 14.7676C15.259 14.7676 15.127 14.7336 15.006 14.6626L11.615 12.6396C11.389 12.5036 11.249 12.2586 11.249 11.9956V7.63361C11.249 7.21961 11.585 6.88361 11.999 6.88361C12.413 6.88361 12.749 7.21961 12.749 7.63361V11.5696L15.775 13.3726C16.13 13.5856 16.247 14.0456 16.035 14.4016C15.894 14.6366 15.645 14.7676 15.39 14.7676Z"
							fill="#F4B836"
						/>
					</svg>

					<p className="text-[#F4B836] font-[600] text-[14px]">В работе</p>
				</div>
			)
		case 'COMPLETED':
			return (
				<div className="flex bg-[#D6FFD4] items-center gap-[5px] px-3 h-[34px] rounded-[16px] w-fit">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M7.67 1.99988H16.34C19.73 1.99988 22 4.37988 22 7.91988V16.0909C22 19.6199 19.73 21.9999 16.34 21.9999H7.67C4.28 21.9999 2 19.6199 2 16.0909V7.91988C2 4.37988 4.28 1.99988 7.67 1.99988ZM11.43 14.9899L16.18 10.2399C16.52 9.89988 16.52 9.34988 16.18 8.99988C15.84 8.65988 15.28 8.65988 14.94 8.99988L10.81 13.1299L9.06 11.3799C8.72 11.0399 8.16 11.0399 7.82 11.3799C7.48 11.7199 7.48 12.2699 7.82 12.6199L10.2 14.9899C10.37 15.1599 10.59 15.2399 10.81 15.2399C11.04 15.2399 11.26 15.1599 11.43 14.9899Z"
							fill="#3FC24C"
						/>
					</svg>
					<p className="text-[#3FC24C] font-[600] text-[14px]">Завершен</p>
				</div>
			)
		case 'CANCELED':
			return (
				<div className="flex bg-[#FFD3D3] items-center gap-[5px] px-3 h-[34px] rounded-[16px] w-fit">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M9.60229 15.1367C9.41029 15.1367 9.21829 15.0637 9.07229 14.9167C8.77929 14.6237 8.77929 14.1497 9.07229 13.8567L13.8643 9.06472C14.1573 8.77172 14.6313 8.77172 14.9243 9.06472C15.2173 9.35772 15.2173 9.83172 14.9243 10.1247L10.1323 14.9167C9.98629 15.0637 9.79429 15.1367 9.60229 15.1367Z"
							fill="#FF5E5E"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M14.3963 15.1396C14.2043 15.1396 14.0123 15.0666 13.8663 14.9196L9.07034 10.1226C8.77734 9.82958 8.77734 9.35558 9.07034 9.06258C9.36434 8.76958 9.83834 8.76958 10.1303 9.06258L14.9263 13.8596C15.2193 14.1526 15.2193 14.6266 14.9263 14.9196C14.7803 15.0666 14.5873 15.1396 14.3963 15.1396Z"
							fill="#FF5E5E"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.864 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
							fill="#FF5E5E"
						/>
					</svg>
					<p className="text-[#FF5E5E] font-[600] text-[14px]">Отменен</p>
				</div>
			)
	}
}

export function formatPhoneNumber(phoneNumber: string) {
	const cleaned = ('' + phoneNumber).replace(/\D/g, '')
	const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{3})$/)

	if (match) {
		return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`
	}

	return phoneNumber
}

export function formatServiceInfo(info: any): string {
	if (info === undefined) return ''
	const { startTime, endTime } = info

	const startDateTime = new Date(startTime)

	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	}

	const formattedDate = startDateTime.toLocaleDateString('ru-RU', options)
	const formattedStartTime = startDateTime.toLocaleTimeString('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	})

	let formattedEndTime = ''
	if (endTime) {
		const endDateTime = new Date(endTime)
		formattedEndTime = endDateTime.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	return `${formattedDate} ${formattedStartTime} - ${formattedEndTime || formattedStartTime}`
}

export function formatDateBasedOnToday(targetDateStr: any) {
	const targetDate: any = new Date(targetDateStr)
	const today: any = new Date()

	today.setHours(0, 0, 0, 0)
	targetDate.setHours(0, 0, 0, 0)

	const diff = (targetDate - today) / (1000 * 60 * 60 * 24)

	const options = { day: '2-digit', month: 'long' }
	if (diff === -1)
		return `вчера (${targetDate.toLocaleDateString('ru-RU', options)})`
	if (diff === 0)
		return `сегодня (${targetDate.toLocaleDateString('ru-RU', options)})`
	if (diff === 1)
		return `завтра (${targetDate.toLocaleDateString('ru-RU', options)})`

	return targetDate.toLocaleDateString('ru-RU', options)
}

export const openWhatsAppChat = (phone: string, message: string) => {
	const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
	window.open(url, '_blank')
}

export const openTelegramChat = (phone: string, message: string) => {
	const url = `https://t.me/${phone}?text=${encodeURIComponent(message)}`
	window.open(url, '_blank')
}

export const filterTemplateByStatus = (status: string) => {
	switch (status) {
		case 'IN_PROCESSING':
			return 'CREATION'
		case 'CONFIRMED':
			return 'NOTIFICATION'
		case 'CANCELED':
			return 'DELETION'
		case 'NOT_COME':
			return 'DELETION'
		default:
			return 'NOTIFICATION'
	}
}

export const desctructWeek = (weekStart: Date) => {
	const weekDays = []
	for (let i = 0; i < 7; i++) {
		const day = addDays(weekStart, i)
		if (!isNaN(day.getTime())) {
			weekDays.push({
				dayOfWeek: format(day, 'eeee'),
				dayNumber: format(day, 'd'),
				date: format(day, 'yyyy-MM-dd'),
			})
		}
	}
	return weekDays
}

const getPluralForm = (
	number: number,
	one: string,
	few: string,
	many: string
) => {
	if (number % 10 === 1 && number % 100 !== 11) {
		return one
	} else if (
		number % 10 >= 2 &&
		number % 10 <= 4 &&
		(number % 100 < 10 || number % 100 >= 20)
	) {
		return few
	} else {
		return many
	}
}

export const formatDuration = (durationInDays: unknown): string => {
	if (
		typeof durationInDays !== 'number' ||
		isNaN(durationInDays) ||
		durationInDays <= 0
	) {
		return ''
	}

	try {
		const duration = intervalToDuration({
			start: 0,
			end: durationInDays * 24 * 60 * 60 * 1000,
		})

		const years = duration.years || 0
		const months = duration.months || 0
		const days = duration.days || 0

		const yearsText = years
			? `${years} ${getPluralForm(years, 'год', 'года', 'лет')} `
			: ''
		const monthsText = months
			? `${months} ${getPluralForm(months, 'месяц', 'месяца', 'месяцев')} `
			: ''
		const daysText = days
			? `${days} ${getPluralForm(days, 'день', 'дня', 'дней')}`
			: ''

		return `${yearsText}${monthsText}${daysText}`.trim()
	} catch (e) {
		console.error('Ошибка при форматировании длительности:', e)
		return ''
	}
}

export const useWindowWidth = () => {
	const [windowWidth, setWindowWidth] = useState<number>(1300)
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setWindowWidth(window.innerWidth)

			const handleResize = () => {
				setWindowWidth(window.innerWidth)
			}

			window.addEventListener('resize', handleResize)

			return () => {
				window.removeEventListener('resize', handleResize)
			}
		}
	}, [])

	return windowWidth
}

const isLocalhost = (): boolean => {
	if (typeof window === 'undefined') return false

	const { hostname } = window.location
	return (
		hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
	)
}

export const getRoute = (subdomain?: string): string => {
	if (typeof window === 'undefined') {
		return ''
	}

	const { hostname } = window.location
	const isLocal = isLocalhost()

	const getLocalhostURL = () =>
		subdomain ? `http://${subdomain}.localhost:3000/` : 'http://localhost:3000/'

	const getProductionURL = () => {
		if (hostname.includes('unibook')) {
			return subdomain
				? `https://${subdomain}.unibook.ai/`
				: 'https://unibook.ai/'
		}

		return subdomain
			? `https://${subdomain}.unimed.work/`
			: 'https://unimed.work/'
	}

	return isLocal ? getLocalhostURL() : getProductionURL()
}

export const calculateRate = (price: number, durationInDays: number) => {
	if (durationInDays >= 30) {
		return `${Math.round((price / durationInDays) * 30)} c / месяц`
	}
	return `${Math.round(price / durationInDays)} c / день`
}

export const convertPaymentType = (type: string): string => {
	switch (type) {
		case 'CASH':
			return 'Наличный'
		case 'CARD':
			return 'Безналичный'
		case 'MBANK':
			return 'MBANK'
		case 'OPTIMA':
			return 'Optima Bank'
		case 'DISCOUNT':
			return 'Скидка'
		case 'BONUS':
			return 'Бонус'
		case 'BONUS_PAYMENT':
			return 'Оплата бонусами'
		case 'BALANCE_PAYMENT':
			return 'Оплата с баланса'
		case 'BALANCE':
			return 'Пополнение баланса'
		default:
			return type
	}
}

export const getRussianUnitName = (unit: string): string => {
	switch (unit) {
		case 'PIECE':
			return 'Штука'
		case 'KILOGRAM':
			return 'Килограмм'
		case 'GRAM':
			return 'Грамм'
		case 'LITER':
			return 'Литр'
		case 'MILLILITER':
			return 'Миллилитр'
		case 'METER':
			return 'Метр'
		case 'CENTIMETER':
			return 'Сантиметр'
		case 'SQUARE_METER':
			return 'Квадратный метр'
		case 'CUBIC_METER':
			return 'Кубический метр'
		case 'PACK':
			return 'Упаковка'
		case 'BOX':
			return 'Коробка'
		case 'SET':
			return 'Набор'
		default:
			return unit
	}
}

export const convertProductStatus = (status: string) => {
	switch (status) {
		case 'ACTIVE':
			return 'Активный'
		case 'OUT_OF_STOCK':
			return 'Неактивный'
		case 'ARCHIVED':
			return 'Архивный'
		default:
			return status
	}
}
