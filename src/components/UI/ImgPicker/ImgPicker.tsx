import { useDropzone } from 'react-dropzone'
import { LuImagePlus } from 'react-icons/lu'
import styles from './imgPicker.module.css'
import { MouseEvent, useCallback } from 'react'
import { RxCross2 } from 'react-icons/rx'

interface ImgPickerProps {
	onChange: any
	value: any
}

export const ImgPicker = (props: ImgPickerProps) => {
	const onDrop = useCallback(
		(acceptedFiles: any) => {
			props.onChange(acceptedFiles[0])
		},
		[props]
	)

	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	const Reset = (event: MouseEvent) => {
		event.stopPropagation()
		props.onChange('')
	}

	return (
		<div className={styles.picker_container}>
			<div className={styles.containerdrop} {...getRootProps()} {...props}>
				{props.value === '' ? (
					<div className={styles.is_empty_wrapper}>
						<p className={styles.is_empty_content}>
							<LuImagePlus size={30} />
							Перенесите сюда файл или выберите <br /> Требования: jpeg, png,
							tiff, bmp, Менее 5 Mb
						</p>
					</div>
				) : (
					<div className={styles.is_empty_wrapper}>
						<img
							className={styles.img}
							src={
								props.value instanceof File
									? URL.createObjectURL(props.value)
									: props.value
							}
							alt=""
							width={0}
							height={0}
						/>
						<RxCross2 size={36} className={styles.delete} onClick={Reset} />
					</div>
				)}
				<input {...getInputProps()} />
			</div>
		</div>
	)
}
