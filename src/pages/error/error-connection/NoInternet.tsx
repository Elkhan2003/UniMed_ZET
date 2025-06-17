import { Button } from '../../../components/UI/Buttons/Button/Button'
import styles from './NoInternet.module.css'

export const NoInternetPage = () => {
	function handleClick() {
		window.location.reload()
	}

	return (
		<div className="wrapper-lottie">
			<Button
				width="150px"
				color="black"
				border="1px solid black"
				onClick={() => handleClick()}
			>
				Обновить
			</Button>
		</div>
	)
}
