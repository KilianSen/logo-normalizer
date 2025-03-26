import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {Home} from "@/pages/home.tsx";
import {OpenCVProvider} from "@/lib/opencv/OpenCVProvider.tsx";

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<OpenCVProvider>
			<Home/>
		</OpenCVProvider>
	</StrictMode>,
)