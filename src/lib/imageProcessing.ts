/* eslint-disable @typescript-eslint/no-explicit-any */

import {ttPI} from "@/lib/transpiled.ts";

/**
 * processImage
 * @param b64dataURL - Base64 encoded data URL of the image to be processed
 * @param cv2 - OpenCV.js instance
 * @returns - Base64 encoded data URL of the processed image
 */
export async function processImageExternal(b64dataURL: string, cv2: any): Promise<string> {
	let canvas = document.createElement("canvas");
	let ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Failed to get canvas context");
	}
	const img = new Image();
	img.src = b64dataURL;
	await new Promise((resolve) => {
		img.onload = resolve;
	});
	canvas.width = img.width;
	canvas.height = img.height;
	ctx.drawImage(img, 0, 0);
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	const src = new cv2.Mat(canvas.height, canvas.width, cv2.CV_8UC4);
	src.data.set(imageData.data);
	
	const dst = await processImage(src, cv2);
	
	// convert back to base64 data URL
	canvas = document.createElement("canvas");
	canvas.width = src.cols;
	canvas.height = src.rows;
	ctx = canvas.getContext("2d");
	if (!ctx) {
		throw new Error("Failed to get canvas context");
	}
	ctx.putImageData(new ImageData(new Uint8ClampedArray(dst.data), dst.cols, dst.rows), 0, 0);
	const dataURL = canvas.toDataURL("image/png");
	// free memory
	src.delete();
	dst.delete();
	
	return dataURL;
}

export async function processImage(cvImage: any, cv2: any): Promise<any> {
	
	
	return ttPI(cvImage, cv2);
}