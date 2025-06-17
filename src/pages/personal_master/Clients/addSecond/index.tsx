import React, { useEffect, useState } from 'react'
import { ModalComponent } from '../../../../components/UI/Modal/Modal'
import { InputNumberMask } from '../../../../components/UI/Inputs/InputMask/InputMask'
import { Input } from '../../../../components/UI/Inputs/Input/Input'
import { Button } from '../../../../components/UI/Buttons/Button/Button'
import { useDispatch } from 'react-redux'
import { postUsersRegistrationByAdmin } from '../../../../store/features/user-slice'
import { AnyAction } from '@reduxjs/toolkit'
import { useCheckPhoneNumberQuery } from '../../../../store/services/user.service'
import { GENDER } from '../../../../shared/lib/constants/constants'
import { InoiSelect } from '../../../../components/UI/select'
import { NewDatePicker } from '../../../../components/shared/date-picker'
import { TextArea } from '../../../../components/UI/Inputs/TextArea/TextArea'

export default function NewUser({ isOpenModal, handleClose }: any) {
    const [validation, setValidation] = useState(true)
    const [loading, setLoading] = useState(false)
    const [dataNewUser, setDataNewUser] = useState<any>({
        id: 0,
        firstName: '',
        lastName: '',
        gender: { name: 'Мужчина', value: 'MALE' },
        birthDate: new Date(),
        phoneNumber: '+996',
        avatar: '',
        isUnregistered: true,
        clientStatistics: {
            averageVisitsPerMonth: 0,
            averageCheck: null,
            totalSpent: null,
            bonuses: null,
            balance: null,
            discount: null,
            totalVisits: 0,
            lastVisitDate: null,
            comment: '',
        },
    })

    const forDate = new Date(dataNewUser.birthDate)

    const { data: phone_number = false } = useCheckPhoneNumberQuery(
        dataNewUser?.phoneNumber.slice(1),
        { skip: !dataNewUser?.phoneNumber }
    )

    const dispatch = useDispatch()

    useEffect(() => {
        setValidation(false)
    }, [dataNewUser])

    async function handlePost() {
        try {
            setLoading(true)
            await dispatch(
                postUsersRegistrationByAdmin({
                    username: dataNewUser.firstName,
                    phoneNumber: dataNewUser.phoneNumber,
                    body: {
                        ...dataNewUser,
                        gender: dataNewUser.gender.value,
                        birthDate:
                            typeof dataNewUser.birthDate === 'string'
                                ? dataNewUser.birthDate
                                : '',
                    },
                }) as unknown as AnyAction
            )
            handleClose()
            setDataNewUser({
                id: 0,
                firstName: '',
                lastName: '',
                gender: { name: 'Мужчина', value: 'MALE' },
                birthDate: new Date(),
                phoneNumber: '+996',
                avatar: '',
                isUnregistered: true,
                clientStatistics: {
                    averageVisitsPerMonth: 0,
                    averageCheck: 0,
                    totalSpent: 0,
                    bonuses: 0,
                    balance: 0,
                    discount: 0,
                    totalVisits: 0,
                    lastVisitDate: '2025-01-16T10:21:30.663Z',
                    comment: '',
                },
            })
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }

    return (
        <ModalComponent
            title="Создать клиента"
            active={isOpenModal}
            handleClose={handleClose}
        >
            <div className="w-[320px] flex flex-col gap-2">
                <Input
                    label="Имя"
                    placeholder="Введите имя клиента"
                    value={dataNewUser.firstName}
                    onChange={(e) =>
                        setDataNewUser({ ...dataNewUser, firstName: e.target.value })
                    }
                    required
                />
                <Input
                    label="Фамилия"
                    placeholder="Введите фамилию клиента"
                    value={dataNewUser.lastName}
                    onChange={(e) =>
                        setDataNewUser({ ...dataNewUser, lastName: e.target.value })
                    }
                    required
                />
                <InputNumberMask
                    label="Номер телефона"
                    onChange={(value) =>
                        setDataNewUser({ ...dataNewUser, phoneNumber: value })
                    }
                    value={dataNewUser.phoneNumber}
                    error={phone_number === true ? 'Этот номер уже используеться!' : ''}
                    required
                />
                <InoiSelect
                    title="Пол"
                    placeholder="Укажите пол клиента"
                    options={GENDER}
                    value={dataNewUser.gender}
                    setValue={(option: any) =>
                        setDataNewUser({ ...dataNewUser, gender: option })
                    }
                    required
                />
                <NewDatePicker
                    label="Дата рождения"
                    date={forDate}
                    setDate={(date: string) =>
                        setDataNewUser({ ...dataNewUser, birthDate: date })
                    }
                />
                <TextArea
                    label="Комментарий"
                    placeholder="Напишите комментарий"
                    value={dataNewUser.clientStatistics.comment}
                    onChange={(e: any) =>
                        setDataNewUser({
                            ...dataNewUser,
                            clientStatistics: {
                                ...dataNewUser.clientStatistics,
                                comment: e,
                            },
                        })
                    }
                />
            </div>
            <div className="flex items-center justify-end gap-4 mt-4">
                <Button
                    width="120px"
                    backgroundColor="white"
                    color="var(--myviolet)"
                    border="1px solid var(--myviolet)"
                    onClick={() => handleClose()}
                >
                    Отмена
                </Button>
                <Button
                    onClick={() => handlePost()}
                    disabled={validation}
                    width="150px"
                    isLoading={loading}
                >
                    Сохранить
                </Button>
            </div>
        </ModalComponent>
    )
}
