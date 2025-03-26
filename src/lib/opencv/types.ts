import * as React from "react";

export type OpenCvContextProps = {
	isLoaded: boolean
	cv: typeof window.cv
}

export type OpenCvProviderProps = {
	openCvVersion?: string
	openCvPath?: string
	children: React.ReactNode
}

export type ModuleConfig = {
	wasmBinaryFile: string
	usingWasm: boolean
	onRuntimeInitialized: () => void
}

declare global {
	interface Window {
		Module: ModuleConfig;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		cv: any;
	}
}