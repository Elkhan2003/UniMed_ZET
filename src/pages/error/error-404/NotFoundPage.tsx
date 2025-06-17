import { Button } from '../../../components/UI/Buttons/Button/Button'
import { useNavigate } from 'react-router'
import styles from './NotFoundPage.module.css'

export const NotFoundPage = () => {
	function handleClick() {
		window.location.href = window.location.href = 'https://admin.unibook.ai'
	}

	return (
		<div className="wrapper-lottie">
			<span className={styles.title}>Код ошибки: 404</span>
			<Button width="150px" color="white" onClick={() => handleClick()}>
				Назад
			</Button>
		</div>
	)
}
