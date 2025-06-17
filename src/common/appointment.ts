export interface IAppointmentService {
    id: number
    name: number
    price: number
    duration: number
    type: boolean
}

export interface IAppointment {
	appointmentId: number
	startTime: string
	endTime: string
	description: string
	appointmentStatus: string
	userId: number
	userFirstName: string
	userLastName: string
	userPhoneNumber: string
	masterId: number
	masterFirstName: string
	masterLastName: string
	services: IAppointmentService[] 
	numberOfVisits: number
	promocode: string
	unregistered: true
}
