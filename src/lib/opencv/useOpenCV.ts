import {useContext} from "react";

import {OpenCVContext} from "@/lib/opencv/OpenCVContext.tsx";

export function useOpenCV() {
	const context = useContext(OpenCVContext);
	if (context === undefined) {
		throw new Error('useOpenCV must be used within a OpenCVProvider');
	}
	return context;
}