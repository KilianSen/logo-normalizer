import {createContext} from "react";
import {OpenCvContextProps} from "@/lib/opencv/types.ts";

export const OpenCVContext = createContext<OpenCvContextProps>({isLoaded: false, cv: null});