import { Cash } from '../../../assets/icons/ cash'
import { Card } from '../../../assets/icons/card'
import { CreditPlus } from '../../../assets/icons/creditPlus'
import { ReactComponent as MbankIcon } from '../../../assets/icons/mbank-icon.svg'
import { ReactComponent as OptimaBank } from '../../../assets/icons/optima-bank.svg'

export const _KEY_AUTH = 'USER_CHEBER_DATA'
export const _PUSH = 'LOCK'

export const COOKIE =
	window.location.hostname === 'localhost'
		? 'localhost'
		: window.location.host.includes('unibook')
			? 'unibook.ai'
			: 'unimed.work'

export const HOST =
	window.location.hostname === 'localhost' ? 'localhost' : 'unibook.ai'

export const WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export const DAY_OF_WEEK = [
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
	'SUNDAY',
]

export const YEARS = [2027, 2026, 2025, 2024, 2023, 2022, 2021]

export const ALLOWED_NUMBERS = [
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'0',
]

export const YEAR = [
	'Янв',
	'Фев',
	'Мар',
	'Апр',
	'Май',
	'Июн',
	'Июл',
	'Авг',
	'Сен',
	'Окт',
	'Ноя',
	'Дек',
]

export const NOTIFICATION_VALUES = [
	{ value: 'NONE', label: 'Не отправлять' },
	{ value: 'ONE_HOUR', label: 'За час до визита' },
	{ value: 'THREE_HOUR', label: 'За тричаса до визита' },
	{ value: 'DAY', label: 'За день до визита' },
]

export const SUB_TYPE: any = {
	USER: 'Добавление сотрудников',
	TARIFF: 'Тариф',
	TARIFF_USER: 'Тариф и добавление сотрудников',
} as const

export const APPOINTMENT_STATUS = [
	{
		label: 'Не подтвержден',
		value: 'IN_PROCESSING',
	},
	{
		label: 'Подтвержден',
		value: 'CONFIRMED',
	},
	{
		label: 'В работе',
		value: 'ARRIVE',
	},
	{
		label: 'Завершенный',
		value: 'COMPLETED',
	},
	{
		label: 'Отменен',
		value: 'CANCELED',
	},
	{
		label: 'Не пришел',
		value: 'NOT_COME',
	},
]

export const APPOINTMENT_STATUS_FILTER = [
	{
		label: 'Подтвержден',
		value: 'CONFIRMED',
	},
	{
		label: 'Пришел',
		value: 'ARRIVE',
	},
	{
		label: 'Отменен',
		value: 'CANCELED',
	},
]

export const APPOINTMENT_STATUS_POST = [
	{
		label: 'Подтвержден',
		value: 'CONFIRMED',
	},
	{
		label: 'В работе',
		value: 'ARRIVE',
	},
]

export const FULL_WEEK = [
	{
		nameEN: 'MONDAY',
		nameRU: 'Понедельник',
	},
	{
		nameEN: 'TUESDAY',
		nameRU: 'Вторник',
	},
	{
		nameEN: 'WEDNESDAY',
		nameRU: 'Среда',
	},
	{
		nameEN: 'THURSDAY',
		nameRU: 'Четверг',
	},
	{
		nameEN: 'FRIDAY',
		nameRU: 'Пятница',
	},
	{
		nameEN: 'SATURDAY',
		nameRU: 'Суббота',
	},
	{
		nameEN: 'SUNDAY',
		nameRU: 'Воскресенье',
	},
]

export const TypeDay = ['Утро', 'День', 'Вечер']

export const WEEK_CALENDAR = [
	'воскресенье',
	'понедельник',
	'вторник',
	'среда',
	'четверг',
	'пятница',
	'суббота',
]

export const TypeMonth = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
]

export const calendarTimeFormat = {
	hour: 'numeric',
	minute: '2-digit',
}

export const headerToolbar = {
	left: 'prev,dayGridMonth,timeGridWeek,myCustomButton,buttonDate',
	center: 'title',
	right: 'today,timeGridDay,listWeek,next',
}

export const translatebuttonText = {
	today: 'Сегодня',
	day: 'День',
	month: 'Месяц',
	week: 'Неделя',
	list: 'Список',
}

export const isLoadingSx = {
	color: '#fff',
	zIndex: (theme: any) => theme.zIndex.drawer + 1,
}

export const DATA_HEADER_BEAUTYSALON = [
	{
		name: 'Популярные услуги',
		id: 1,
	},
	{
		name: 'О нас',
		id: 2,
	},
	{
		name: 'Контакты и Услуги',
		id: 3,
	},
	{
		name: 'Специалисты филиала',
		id: 4,
	},
	{
		name: 'Отзывы',
		id: 5,
	},
	{
		name: 'Филиалы',
		id: 6,
	},
]

export const TYPE_LANDING = [
	{
		label: 'Барбершоп',
		value: 'barbershop',
	},
	{
		label: 'Салон кросаты',
		value: 'beauty_salon',
	},
	{
		label: 'Клиника',
		value: 'medical',
	},
	{
		value: 'it',
		label: 'IT Компании',
	},
	{
		value: 'construction_and_renovation',
		label: 'Строительные компании',
	},
	{
		value: 'restaurants_and_cafes',
		label: 'Кафе и рестораны',
	},
	{
		value: 'training_and_courses',
		label: 'Курсы и тренинги',
	},
	{
		value: 'apartment_rentals',
		label: 'Дома Квартиры',
	},
]

export const PAYMENT_TYPE = [
	{
		label: 'Без. наличный',
		value: 'CARD',
	},
	{
		label: 'МБАНК',
		value: 'MBANK',
	},
	{
		label: 'ОПТИМА',
		value: 'OPTIMA',
	},
]

export const TYPE_OF_PAYMENT = [
	{
		label: 'Наличный',
		value: 'CASH',
	},
	{
		label: 'Без. наличный',
		value: 'CARD',
	},
	{
		label: 'МБАНК',
		value: 'MBANK',
	},
	{
		label: 'ОПТИМА',
		value: 'OPTIMA',
	},
]

export const COMPENSATION_TYPE = [
	{
		label: 'Фиксированный',
		value: 'FIXED',
	},
	{
		label: 'Процент %',
		value: 'PERCENT',
	},
]

export const EXPERIENCE = [
	{
		label: '1 год',
		value: 1,
	},
	{
		label: '2 год',
		value: 2,
	},
	{
		label: '3 год',
		value: 3,
	},
	{
		label: '4 год',
		value: 4,
	},
	{
		label: '5 год',
		value: 5,
	},
	{
		label: '6 год',
		value: 6,
	},
	{
		label: '7 год',
		value: 7,
	},
]

export const COUNTRIES = [
	{ label: 'Кыргызстан', value: [74.766098, 41.20438] },
	{ label: 'Казахстан', value: [66.923684, 48.019573] },
	{ label: 'Россия', value: [105.318756, 61.52401] },
	{ label: 'Сша', value: [-95.712891, 37.09024] },
]

export const masks = {
	kg: '(...) ...-...',
	kz: '(...) ...-..-..',
	ru: '(...) ...-..-..',
}

export const ROLES = {
	ADMIN: 'ADMIN',
	PERSONAl_MASTER: 'PERSONAL_MASTER',
	OWNER: 'OWNER',
	SUPER_ADMIN: 'SUPER_ADMIN',
	MASTER: 'MASTER',
}

export const ENTITY_TYPE = {
	USER: 'USER',
	ADMIN: 'ADMIN',
	MASTER: 'MASTER',
	BRANCH: 'BRANCH',
}

export const PAYMENTS_CARDS = [
	{
		Icon: Cash,
		id: 'e1',
		name: 'Наличные',
	},
	{
		Icon: Card,
		id: 'e2',
		name: 'Карта',
	},
	{
		Icon: MbankIcon,
		id: 'e3',
		name: 'MBANK',
	},
	{
		Icon: OptimaBank,
		id: 'e4',
		name: 'Optima Bank',
	},
	{
		Icon: CreditPlus,
		id: 'e5',
		name: 'Бонусы',
	},
]

export const GENDER = [
	{ name: 'Не указан', value: 'NOT_SPECIFIED' },
	{ name: 'Мужчина', value: 'MALE' },
	{ name: 'Женщина', value: 'FEMALE' },
]

export const GENDER_CONVERT: any = {
	MALE: 'Мужчина',
	FEMALE: 'Женщина',
	NOT_SPECIFIED: 'Не указан',
}

export const CATEGORY_TYPE: any = {
	barbershop: 'Барбершоп',
	beauty_salon: 'Салон красоты',
	medical: 'Медицина',
	personal_master: 'Персональный Специалист',
	personal_doctor: 'Персональный доктор',
}

export const blocked = `linear-gradient(
      150deg,
      rgba(255, 255, 255) 0%,
      #F5F5F5 1%,
      rgba(255, 255, 255) 2%,
      rgba(255, 255, 255) 3%,
      #F5F5F5 4%,
      rgba(255, 255, 255) 5%,
      rgba(255, 255, 255) 6%,
      #F5F5F5 7%,
      rgba(255, 255, 255) 8%,
      rgba(255, 255, 255) 9%,
      #F5F5F5 10%,
      rgba(255, 255, 255) 11%,
      rgba(255, 255, 255) 12%,
      #F5F5F5 13%,
      rgba(255, 255, 255) 14%,
      rgba(255, 255, 255) 15%,
      #F5F5F5 16%,
      rgba(255, 255, 255) 17%,
      rgba(255, 255, 255) 18%,
      #F5F5F5 19%,
      rgba(255, 255, 255) 20%,
	  rgba(255, 255, 255) 21%,
      #F5F5F5 22%,
      rgba(255, 255, 255) 23%,
      rgba(255, 255, 255) 24%,
      #F5F5F5 25%,
      rgba(255, 255, 255) 26%,	
      rgba(255, 255, 255) 27%,
      #F5F5F5 28%,
      rgba(255, 255, 255) 29%,
      rgba(255, 255, 255) 30%,
      #F5F5F5 31%,
      rgba(255, 255, 255) 32%,
	  rgba(255, 255, 255) 33%,
      #F5F5F5 34%,
      rgba(255, 255, 255) 35%,
      rgba(255, 255, 255) 36%,
      #F5F5F5 37%,
      rgba(255, 255, 255) 38%,
      rgba(255, 255, 255) 39%,
      #F5F5F5 40%,
      rgba(255, 255, 255) 41%,
      rgba(255, 255, 255) 42%,
      #F5F5F5 43%,
      rgba(255, 255, 255) 44%,
      rgba(255, 255, 255) 45%,
      #F5F5F5 46%,
      rgba(255, 255, 255) 47%,
      rgba(255, 255, 255) 48%,
      #F5F5F5 49%,
      rgba(255, 255, 255) 50%,
	  rgba(255, 255, 255) 51%,
      #F5F5F5 52%,
      rgba(255, 255, 255) 53%,
      rgba(255, 255, 255) 54%,
      #F5F5F5 55%,
      rgba(255, 255, 255) 56%,
      rgba(255, 255, 255) 57%,
      #F5F5F5 58%,
      rgba(255, 255, 255) 59%,
      rgba(255, 255, 255) 60%,
      #F5F5F5 61%,
      rgba(255, 255, 255) 62%,
      rgba(255, 255, 255) 63%,
      #F5F5F5 64%,
      rgba(255, 255, 255) 65%,
      rgba(255, 255, 255) 66%,
      #F5F5F5 67%,
      rgba(255, 255, 255) 68%,
      rgba(255, 255, 255) 69%,
      #F5F5F5 70%,
      rgba(255, 255, 255) 71%,
      rgba(255, 255, 255) 72%,
      #F5F5F5 73%,
      rgba(255, 255, 255) 74%,
      rgba(255, 255, 255) 75%,
      #F5F5F5 76%,
      rgba(255, 255, 255) 77%,
      rgba(255, 255, 255) 78%,
      #F5F5F5 79%,
      rgba(255, 255, 255) 80%,
      rgba(255, 255, 255) 81%,
      #F5F5F5 82%,
      rgba(255, 255, 255) 83%,
      rgba(255, 255, 255) 84%,
      #F5F5F5 85%,
      rgba(255, 255, 255) 86%,
      rgba(255, 255, 255) 87%,
      #F5F5F5 88%,
      rgba(255, 255, 255) 89%,
      rgba(255, 255, 255) 90%,
      #F5F5F5 91%,
      rgba(255, 255, 255) 92%,
      rgba(255, 255, 255) 93%,
      #F5F5F5 94%,
      rgba(255, 255, 255) 95%,
      rgba(255, 255, 255) 96%,
      #F5F5F5 97%,
      rgba(255, 255, 255) 98%,
      rgba(255, 255, 255) 99%,
      #F5F5F5 100%,
      rgba(255, 255, 255) 100%
    )`

export const unitsStock = [
	'PIECE',
	'KILOGRAM',
	'GRAM',
	'LITER',
	'MILLILITER',
	'METER',
	'CENTIMETER',
	'SQUARE_METER',
	'CUBIC_METER',
	'PACK',
	'BOX',
	'SET',
]
