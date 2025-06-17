import dayjs from "dayjs";

export const dataControl = {
	entityId: 0,
	entityType: '',
	startDate: dayjs(new Date()).format('YYYY-MM-DD'),
	endDate: dayjs(new Date()).format('YYYY-MM-DD'),
	dayScheduleRequests: [
		{
			startTime: '',
			endTime: '',
			dayOfWeek: 'MONDAY',
			workingDay: true,
			breakRequest: [],
		},
		{
			startTime: '',
			endTime: '',
			dayOfWeek: 'TUESDAY',
			workingDay: false,
			breakRequest: [],
		},
		{
			startTime: '',
			endTime: '',
			dayOfWeek: 'WEDNESDAY',
			workingDay: false,
			breakRequest: [],
		},
		{
			startTime: '',
			endTime: '',
			dayOfWeek: 'THURSDAY',
			workingDay: false,
			breakRequest: [],
		},
		{
			startTime: '',
			endTime: '',
			dayOfWeek: 'FRIDAY',
			workingDay: false,
			breakRequest: [],
		},
		{
			startTime: '',
			endTime: '',
			dayOfWeek: 'SATURDAY',
			workingDay: false,
			breakRequest: [],
		},
		{
			startTime: '',
			endTime: '',
			dayOfWeek: 'SUNDAY',
			workingDay: false,
			breakRequest: [],
		},
	],
}
