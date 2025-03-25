import {ClassValue} from "clsx";
import {cn} from "@/lib/utils.ts";
import {ReactElement, useEffect, useState} from "react";
import Dropzone from "react-dropzone";
import {Conditional} from "@/lib/conditional.ts";

export function ImageCard({src, className, hover, onClick, onDrop, dragImage}:{src: string, hover?: ReactElement, className?: ClassValue, onClick?: () => void, onDrop?: (acceptedFiles: File[]) => void, dragImage?: ReactElement}) {
	const [drag, setDrag] = useState(false)
	useEffect(() => {
		console.log(drag, !!onDrop)
	}, [drag]);
	
	return (
		<div className={cn("relative w-full h-full flex items-center justify-center group", className)} onClick={onClick}>
			<Conditional condition={!!onDrop} truthy={<DZZ onDrop={(acceptedFiles) => {
				setDrag(false)
				if (onDrop) onDrop(acceptedFiles)
			}} children={<></>} onDragEnter={() => setDrag(true)} onDragLeave={() => setDrag(false)}/>} falsy={<></>}>
				<div className="w-full h-full">
					<img
						src={src}
						alt="Image"
						className="object-cover w-full h-full rounded-lg shadow-lg"
					/>
					{hover && <div
                        className={"hidden group-hover:flex absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg  items-center justify-center"}>
						{hover}
                    </div>}
					{
						drag && <div
							className={"absolute top-0 left-0 w-full h-full bg-black/50 rounded-lg flex items-center justify-center"}>
							{dragImage}
						</div>
					}
				</div>
			</Conditional>
		</div>
	)
}

function DZZ(
	{
		children,
		onDrop,
		onDragEnter,
		onDragLeave
	}:{
		children: ReactElement,
		onDrop?: (acceptedFiles: File[]) => void,
		onDragEnter?: () => void,
		onDragLeave?: () => void
	}
) {
	return (
		<Dropzone
			onDrop={onDrop}
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
		>
		{({getRootProps, getInputProps}) => (
			<div {...getRootProps()} className="w-full h-full">
				<input {...getInputProps()} />
				{children}
			</div>)}
	</Dropzone>
	)
}