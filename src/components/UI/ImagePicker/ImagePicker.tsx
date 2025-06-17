import { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import isEmptyImagePicker from '../../../assets/image/isEmptyImagePicker.webp'
import styles from './ImagePicker.module.css'
import { FaUserAlt } from 'react-icons/fa'

interface ImagePickerProps {
	width?: string
	height?: string
	border?: string
	borderRadius?: string
	backgroundColor?: string
	color?: string
	setValue: any
	value?: any
}

export const ImagePicker = (
	{ setValue, value }: ImagePickerProps,
	props: ImagePickerProps
) => {
	const [selectedImage, setSelectedImage] = useState<string | undefined>(value)

	useEffect(() => {
		setSelectedImage(value)
	}, [value])

	const onDrop = (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const file = acceptedFiles[0]
			const reader = new FileReader()
			reader.onloadend = () => {
				setSelectedImage(reader.result as string)
			}
			reader.readAsDataURL(file)
			setValue(file)
		}
	}

	const { getRootProps, getInputProps } = useDropzone({ onDrop })

	const IsTrueImage = () => {
		if (selectedImage === undefined) {
			return isEmptyImagePicker
		} else {
			return selectedImage
		}
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.containerdrop} {...getRootProps()} {...props}>
				{selectedImage ? (
					<img
						className={styles.img}
						src={IsTrueImage()}
						alt="ImagePicker"
						width={0}
						height={0}
						style={props}
					/>
				) : (
					<FaUserAlt fontSize={110} onClick={() => IsTrueImage()} />
				)}
				<input {...getInputProps()} />
			</div>
		</div>
	)
}
