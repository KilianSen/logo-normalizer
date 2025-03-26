import {useEffect, useState} from 'react';
import {OpenCVContext} from "@/lib/opencv/OpenCVContext.tsx";
import {ModuleConfig, OpenCvContextProps, OpenCvProviderProps} from "@/lib/opencv/types.ts";

const scriptId = 'opencv-react'
const moduleConfig: ModuleConfig = {
	wasmBinaryFile: 'opencv_js.wasm',
	usingWasm: true,
	onRuntimeInitialized: () => {}
}

export function OpenCVProvider({openCvVersion = '4.x', openCvPath = '', children}: OpenCvProviderProps) {
	const [cvInstance, setCvInstance] = useState<OpenCvContextProps>({
		isLoaded: false,
		cv: undefined
	})
	
	useEffect(() => {
		if (document.getElementById(scriptId)) {
			console.warn('OpenCV.js script already loaded')
			return
		}
		
		// https://docs.opencv.org/3.4/dc/de6/tutorial_js_nodejs.html
		// https://medium.com/code-divoire/integrating-opencv-js-with-an-angular-application-20ae11c7e217
		// https://stackoverflow.com/questions/56671436/cv-mat-is-not-a-constructor-opencv
		console.log('Loading OpenCV.js...')
		window.Module = {...moduleConfig, onRuntimeInitialized: () => {
			console.log('OpenCV.js loaded, and available in window.cv');
			(window.cv as Promise<typeof window.cv>).then((cv) => {
				setCvInstance({
					isLoaded: true,
					cv
				})
				
				window.cv = cv
			})
		}}
		
		document.body.appendChild((() => {
			const js = document.createElement('script')
			js.id = scriptId
			js.src =
				openCvPath || `https://docs.opencv.org/${openCvVersion}/opencv.js`
			
			js.nonce = 'true'
			js.defer = true
			js.async = true
			
			return js
		})())
	}, [])
	
	return (
		<OpenCVContext value={cvInstance}>
			{children}
		</OpenCVContext>
	)
}


