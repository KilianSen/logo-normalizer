import {ClassValue} from "clsx";
import {cn} from "@/lib/utils.ts";
import {ReactElement} from "react";

export function ImageCard({src, className, hover, onClick}:{src: string, hover?: ReactElement, className?: ClassValue, onClick?: () => void}) {
	return (
		<div className={cn("relative w-full h-full flex items-center justify-center group", className)} onClick={onClick}>
			<img
				src={src}
				alt="Image"
				className="object-cover w-full h-full rounded-lg shadow-lg"
			/>
			{hover && <div
				className={"hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg  items-center justify-center"}>
				{hover}
			</div>}
		</div>
	)
}