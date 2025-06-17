export const generateTimeSlots = (start: string, end: string, interval: number): string[] => {
	const timeSlots: string[] = []

	const [startHour, startMinute] = start.split(':').map(Number)
	const [endHour, endMinute] = end.split(':').map(Number)

	let currentMinutes = startHour * 60 + startMinute
	const endTotalMinutes = endHour * 60 + endMinute

	while (currentMinutes <= endTotalMinutes) {
		const hours = Math.floor(currentMinutes / 60).toString().padStart(2, '0')
		const minutes = (currentMinutes % 60).toString().padStart(2, '0')
		timeSlots.push(`${hours}:${minutes}`)
		currentMinutes += interval
	}

	return timeSlots
}
