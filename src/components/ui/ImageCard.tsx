import {ClassValue} from "clsx";
import {cn} from "@/lib/utils.ts";

export function ImageCard({src, className}:{src: string, className?: ClassValue}) {
	return (
		<div className={cn("w-full h-full flex items-center justify-center", className)}>
			<img
				src={src}
				alt="Image"
				className="object-cover w-full h-full rounded-lg shadow-lg"
			/>
		</div>
	)
}