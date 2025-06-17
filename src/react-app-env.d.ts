/// <reference types="react-scripts" />

declare module 'tippy.js' {
	export interface TippyInstance {
		popper: HTMLElement
	}
	export default function tippy(
		target: string | HTMLElement | HTMLElement[],
		options?: TippyOptions
	): TippyInstance[]
}

declare module '@mui/icons-material/RestartAlt'