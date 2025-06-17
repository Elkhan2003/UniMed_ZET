import { Flex } from "antd"
import { AppointmentStatusColor, convertStatus, TranslateAppointmentStatus } from "../../../shared/lib/helpers/helpers"

interface NotiCardProp {
    id: number
    appointmentId: number
    startTime: string
    endTime: string
    fullName: string
    services: string[]
    appointmentStatus: string
}

export const NotificationsCard = ({
    id,
    appointmentId,
    startTime,
    endTime,
    fullName,
    services,
    appointmentStatus,
}: NotiCardProp) => {
    return (
        <Flex className="bg-myviolet/20 rounded-[16px] p-[10px]" vertical gap={10} >
            <Flex justify="space-between">
                <p className="text-[#101010] text-[20px] font-[500]">Запись № {id}</p>
                <p className="text-[#101010] text-[16px] font-[500]">{startTime.split('T')[0]} | {startTime.split('T')[1].slice(0, 5)}</p>
                {convertStatus(appointmentStatus)}
            </Flex>
            <Flex justify="space-between">
                <p className="space-x-1">{services.map((item) => <span>{item}</span>)}</p>
                <p className="text-[18px] font-[500]">
                    {fullName || ''}
                </p>
            </Flex>
        </Flex>
    )
}