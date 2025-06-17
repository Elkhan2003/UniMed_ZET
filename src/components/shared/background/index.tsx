import { MainLogo } from '../../../assets/icons/MainLogo'
import Kyz from '../../../assets/image/KYZ.png'

export const Background = () => {
	return (
		<div className="w-full h-full bg-gradient-to-t from-[#FFFFFF33] to-myviolet relative">
			<div className="absolute top-0 left-0 right-0 flex flex-col justify-center items-center h-[50%]">
				<div className="flex items-center">
					<MainLogo color="white" height="22" width="19" />
					<p className="text-white text-[28px] baloo-cheatan font-[800]">
						niWork
					</p>
				</div>
				<p className="text-text-primary text-[34px] text-white font-[600] text-center mt-4">
					Присоединяйтесь к нашей
				</p>
				<p className="text-text-primary text-[34px] text-white font-[600] text-center">
					платформе онлайн-записи!
				</p>
				<p className="text-text-primary text-[20px] text-white font-[400] text-center mt-4">
					Упростите процесс бронирования для ваших клиентов и
				</p>
				<p className="text-text-primary text-[20px] text-white font-[400] text-center ">
					увеличьте количество записей.
				</p>
			</div>
			<div className="absolute bottom-0 right-0 left-0 h-[60%] flex justify-center">
				<img src={Kyz} alt="Kyz" className="h-full w-auto" />
			</div>
		</div>
	)
}
