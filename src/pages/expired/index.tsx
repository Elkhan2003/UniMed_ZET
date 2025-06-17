import { NavLink } from 'react-router-dom'

export const SubscriptionExpiredPage = () => {
	return (
		<div className="w-full h-[calc(100vh-45px)] bg-gray-100 flex justify-center items-center px-4">
			<div className="text-center">
				<p className="text-lg font-medium text-gray-800">
					Срок действия вашей подписки истек. Перейдите в раздел подписки, чтобы
					продлить её.
				</p>
				<NavLink
					to="/subscription"
					className="mt-4 inline-block px-5 py-2 bg-myviolet text-white font-medium rounded-lg transition"
				>
					Перейти к продлению
				</NavLink>
			</div>
		</div>
	)
}
