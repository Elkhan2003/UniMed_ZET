import styles from './Container.module.css'

interface ContainerProps {
	children: any
	sx?: any
	backColor?: any
}

export default function Container(props: ContainerProps) {
	return (
		<section className={styles.wrapper} style={props.backColor}>
			<div className={styles.inner_wrapper} style={props.sx}>
				{props.children}
			</div>
		</section>
	)
}
