export interface IPostSchedules {
	entityId: number
	entityType: string
	startDate: string | Date
	endDate: string | Date
	dayScheduleRequests: dayScheduleRequests[]
}

export interface IBreak {
	startTime: string
	endTime: string
	comment: string
	isScheduleBreak: boolean
	day: string
}

export interface dayScheduleRequests {
	startTime: string
	endTime: string
	dayOfWeek: string
	workingDay: boolean
	breakRequest: IBreak[]
}

export interface IScheduleEntity {
	EntityDto: ScheduleEntity[]
}

export interface ScheduleEntity {
	id: number
	startTime: string
	endTime: string
	workingDay: true
	dayOfWeek: string
	day: string
	breaks: IBreak[]
}
