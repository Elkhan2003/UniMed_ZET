import { useState, useRef, useEffect } from 'react'
import { Switch } from '../../../../../components/shared/switch'
import toast from 'react-hot-toast'
import {
	usePostTemplateMutation,
	usePutTemplateMutation,
} from '../../../../../store/services/push-template.service'
import { Button } from '../../../../../components/UI/Buttons/Button/Button'
import { _PUSH, COOKIE } from '../../../../../shared/lib/constants/constants'
import { setCookie, getCookie } from '../../../../../shared/lib/helpers/helpers'
import { HighlightTextarea, Message } from './consts'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../../store'

export const Notificate = ({ ByType, refetch, branchId }: any) => {
	const [active, setActive] = useState<boolean>(false)
	const [value, setValue] = useState('')
	const [loading, setLoading] = useState(false)
	const [putTemplate] = usePutTemplateMutation()
	const [postTemplate] = usePostTemplateMutation()

	const textareaRef = useRef<HTMLTextAreaElement>(null)

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}, [value])

	useEffect(() => {
		if (ByType) {
			setValue(ByType.template)
		}
	}, [ByType])

	useEffect(() => {
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
		}
	}, [value])

	const handlePut = async () => {
		try {
			setLoading(true)
			const res: any = await putTemplate({
				id: ByType.id,
				body: {
					template: value,
					pushTemplateType: 'CREATION',
				},
			})
			if (res['error']) {
				toast.error(res?.error?.data?.message || 'Произошла ошибка')
			} else {
				refetch()
				toast.success('Шаблон успешно изменен')
			}
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setLoading(false)
			refetch()
		}
	}

	const handlePost = async () => {
		try {
			setLoading(true)
			const res: any = await postTemplate({
				branchId: branchId,
				body: {
					template: value,
					pushTemplateType: 'NOTIFICATION',
				},
			})
			if (res['error']) {
				toast.error(res?.error?.data?.message || 'Произошла ошибка')
			} else {
				refetch()
				toast.success('Шаблон успешно создан')
			}
		} catch (error) {
			toast.error('Произошла ошибка')
		} finally {
			setLoading(false)
			refetch()
		}
	}

	useEffect(() => {
		const bars = async () => {
			const lock: any = await getCookie(_PUSH)
			const des: any = lock ? await JSON.parse(lock) : {}
			setActive(des?.NOTIFICATION || false)
		}
		bars()
	}, [])

	return (
		<div>
			<div className="p-4 flex items-center gap-2">
				<div className="w-[6px] h-[6px] rounded-full bg-black" />
				<span>
					Напоминания о приёме будут автоматически созданы и предложены для
					отправки до приема в течение установленного вами периода времени1
				</span>
			</div>
			<div className="w-full bg-white px-4 py-2 flex justify-between">
				<p className="text-[15px] font-[500]">Включить напоминание</p>
				<Switch
					setActive={setActive}
					active={active}
					onClick={async () => {
						const lock: any = await getCookie(_PUSH)
						const des: any = lock ? await JSON.parse(lock) : {}
						setCookie(
							_PUSH,
							JSON.stringify({
								CREATION: des?.CREATION || false,
								NOTIFICATION: !active,
								DELETION: des?.DELETION || false,
							}),
							7,
							`.${COOKIE}`
						)
					}}
				/>
			</div>
			{ByType?.template && (
				<>
					<div className="px-4 py-2">
						<p className="text-[14px]">Просмотр сообщения</p>
					</div>
					<div className="w-full bg-white px-4 py-4 flex justify-end">
						<div className="bg-[#E8EAED] rounded-[16px] p-[10px] max-w-[60%]">
							<Message text={ByType.template} />
						</div>
					</div>
				</>
			)}
			<div className="px-4 py-2">
				<p className="text-[14px]">
					{ByType?.template
						? 'Изменить содержимое сообщения'
						: 'Создать сообщение'}
				</p>
			</div>
			<div className="w-full bg-white p-4 flex flex-col gap-2">
				<HighlightTextarea value={value} setValue={setValue} />
				<div className="flex justify-end gap-2">
					<Button
						width="120px"
						isLoading={loading}
						onClick={ByType?.template ? handlePut : handlePost}
						disabled={Boolean(!value?.length)}
					>
						{ByType?.template ? 'Сохранить' : 'Создать'}
					</Button>
				</div>
			</div>
			<div className="flex flex-col gap-[10px] p-4">
				<p>Описание</p>
				<p>
					<span className="text-myviolet">{`{master_name}`}</span> - Имя Специалиста
				</p>
				<p>
					<span className="text-myviolet">{`{phone_number}`}</span> - Тел. номер
					специалиста
				</p>
				<p>
					<span className="text-myviolet">{`{address}`}</span> - Адрес
				</p>
				<p>
					<span className="text-myviolet">{`{user_name}`}</span> - Имя
					пользователя
				</p>
				<p>
					<span className="text-myviolet">{`{services}`}</span> - Список услуг
				</p>
				<p>
					<span className="text-myviolet">{`{date}`}</span> - Дата назначения
				</p>
				<p>
					<span className="text-myviolet">{`{start_time}`}</span> - Время начала
				</p>
				<p>
					<span className="text-myviolet">{`{end_time}`}</span> - Время окончания
				</p>
			</div>
		</div>
	)
}
