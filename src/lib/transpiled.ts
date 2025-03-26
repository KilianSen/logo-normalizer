/*eslint-disable @typescript-eslint/no-explicit-any*/

let cv = window.cv

class Image {
	image: any;
	
	constructor(im: any) {
		this.image = im
		
		const aspect_ratio = this.image.rows / this.image.cols;
		const max_pixels = 1920 * 1080 / 4;
		
		if (this.image.rows * this.image.cols > max_pixels) {
			console.log("Resizing input image to ", [Math.sqrt(max_pixels / aspect_ratio), Math.sqrt(max_pixels * aspect_ratio)]);
			const newSize = new cv.Size(Math.sqrt(max_pixels / aspect_ratio), Math.sqrt(max_pixels * aspect_ratio));
			cv.resize(this.image, this.image, newSize, 0, 0, cv.INTER_AREA);
		}
	}
	
	get visual_bounds(): [number, number, number, number] {
		const contours = this.contours;
		const contour = this.mergeContours(contours);
		
		const rect = cv.boundingRect(contour);
		return [rect.x, rect.y, rect.width, rect.height];
	}
	
	get visual_percentage(): number {
		const area_total = this.image.rows * this.image.cols;
		const [, , w, h] = this.visual_bounds;
		const area_visual = w * h;
		return area_visual / area_total;
	}
	
	get foreground_percentage(): number {
		const contours = this.contours;
		const mask = new cv.Mat(this.image.rows, this.image.cols, cv.CV_8U, new cv.Scalar(0, 0, 0, 0));
		cv.drawContours(mask, contours, -1, new cv.Scalar(255, 255, 255, 255), cv.FILLED);
		
		const area_total = this.image.rows * this.image.cols;
		const area_visual = cv.countNonZero(mask);
		
		mask.delete();
		return area_visual / area_total;
	}
	
	get contours(): any {
		const gray = new cv.Mat();
		cv.cvtColor(this.image, gray, cv.COLOR_RGBA2GRAY, 0);
		const thresholded = new cv.Mat();
		cv.threshold(gray, thresholded, 127, 255, cv.THRESH_BINARY);
		
		const contours = new cv.MatVector();
		const hierarchy = new cv.Mat();
		cv.findContours(thresholded, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
		
		gray.delete();
		thresholded.delete();
		hierarchy.delete();
		
		return contours;
	}
	
	mergeContours(contours: any): any {
		let s_x: number | null = null;
		let m_x: number | null = null;
		let s_y: number | null = null;
		let m_y: number | null = null;
		
		for (let i = 0; i < contours.size(); ++i) {
			const contour = contours.get(i);
			for (let j = 0; j < contour.data32S.length; j += 2) {
				const x = contour.data32S[j];
				const y = contour.data32S[j + 1];
				
				if (s_x === null || x < s_x) {
					s_x = x;
				}
				if (m_x === null || x > m_x) {
					m_x = x;
				}
				if (s_y === null || y < s_y) {
					s_y = y;
				}
				if (m_y === null || y > m_y) {
					m_y = y;
				}
			}
			contour.delete();
		}
		
		if (s_x === null || m_x === null || s_y === null || m_y === null) {
			throw new Error("Could not find visual bounds");
		}

		return cv.matFromArray(4, 1, cv.CV_32SC2, [s_x, s_y, m_x, s_y, m_x, m_y, s_x, m_y]);
	}
	
	get colors(): { color: number[], count: number }[] {
		const colors: { color: number[], count: number }[] = [];
		for (let i = 0; i < this.image.data.length; i += 4) {
			const color = [this.image.data[i], this.image.data[i + 1], this.image.data[i + 2]];
			let found = false;
			for (let j = 0; j < colors.length; j++) {
				if (colors[j].color[0] === color[0] && colors[j].color[1] === color[1] && colors[j].color[2] === color[2]) {
					colors[j].count++;
					found = true;
					break;
				}
			}
			if (!found) {
				colors.push({ color: color, count: 1 });
			}
		}
		colors.sort((a, b) => b.count - a.count);
		return colors.slice(0, options.color_limit);
	}
	
	get background_colors(): { color: number[], count: number }[] {
		const mask = new cv.Mat(this.image.rows, this.image.cols, cv.CV_8U, new cv.Scalar(0, 0, 0, 0));
		const contours = this.contours;
		cv.drawContours(mask, contours, -1, new cv.Scalar(255, 255, 255, 255), cv.FILLED);
		
		const background_pixels: number[][] = [];
		for (let i = 0; i < this.image.rows; i++) {
			for (let j = 0; j < this.image.cols; j++) {
				if (mask.ucharPtr(i, j)[0] === 0) {
					background_pixels.push([this.image.ucharPtr(i, j)[0], this.image.ucharPtr(i, j)[1], this.image.ucharPtr(i, j)[2]]);
				}
			}
		}
		
		const unique_colors: { color: number[], count: number }[] = [];
		for (const pixel of background_pixels) {
			let found = false;
			for (const color of unique_colors) {
				if (color.color[0] === pixel[0] && color.color[1] === pixel[1] && color.color[2] === pixel[2]) {
					color.count++;
					found = true;
					break;
				}
			}
			if (!found) {
				unique_colors.push({ color: pixel, count: 1 });
			}
		}
		
		unique_colors.sort((a, b) => b.count - a.count);
		mask.delete();
		return unique_colors.slice(0, options.color_limit);
	}
	
	crop(bounds: [number, number, number, number]): Image {
		const [x, y, w, h] = bounds;
		const rect = new cv.Rect(x, y, w, h);
		this.image = this.image.roi(rect);
		return this;
	}
	
	strip_color(colorInfo: { color: number[], count: number }, new_color: number[], margin: number, blur: number = 3): Image {
		const color = colorInfo.color;
		const blurred_image = new cv.Mat();
		const ksize = new cv.Size(blur, blur);
		cv.GaussianBlur(this.image, blurred_image, ksize, 0, 0, cv.BORDER_DEFAULT);
		
		const mask = new cv.Mat(this.image.rows, this.image.cols, cv.CV_8U);
		for (let i = 0; i < this.image.rows; i++) {
			for (let j = 0; j < this.image.cols; j++) {
				const pixel = blurred_image.ucharPtr(i, j);
				const diff = [Math.abs(pixel[0] - color[0]), Math.abs(pixel[1] - color[1]), Math.abs(pixel[2] - color[2])];
				if (diff[0] <= margin && diff[1] <= margin && diff[2] <= margin) {
					mask.ucharPtr(i, j)[0] = 255;
				} else {
					mask.ucharPtr(i, j)[0] = 0;
				}
			}
		}
		
		for (let i = 0; i < this.image.rows; i++) {
			for (let j = 0; j < this.image.cols; j++) {
				if (mask.ucharPtr(i, j)[0] === 255) {
					this.image.ucharPtr(i, j)[0] = new_color[0];
					this.image.ucharPtr(i, j)[1] = new_color[1];
					this.image.ucharPtr(i, j)[2] = new_color[2];
				}
			}
		}
		
		blurred_image.delete();
		mask.delete();
		return this;
	}
	
	extend(l: number, r: number, t: number, b: number, fill: number[]): Image {
		const borderType = cv.BORDER_CONSTANT;
		const value = new cv.Scalar(fill[0], fill[1], fill[2], 255);
		cv.copyMakeBorder(this.image, this.image, t, b, l, r, borderType, value);
		return this;
	}
	
	resize(size: [number, number]): Image {
		const newSize = new cv.Size(size[0], size[1]);
		cv.resize(this.image, this.image, newSize, 0, 0, cv.INTER_AREA);
		return this;
	}
}

class Options {
	color_limit: number = 5;
}

const options = new Options();
const target_p = 0.2;
const target_res: [number, number] = [256, 256];

export function ttPI(im: any, cv2: any   ): void {
	cv = cv2;
	let Test = new Image(im);
	Test = Test.crop(Test.visual_bounds);
	const m_bound = Math.max(Test.visual_bounds[2], Test.visual_bounds[3]);
	console.log("Got bounds");
	const dH = m_bound - Test.visual_bounds[3];
	const dW = m_bound - Test.visual_bounds[2];
	Test = Test.extend(Math.floor(dW / 2), dW - Math.floor(dW / 2), Math.floor(dH / 2), dH - Math.floor(dH / 2), [255, 255, 255]);
	console.log("Rectangular finish");
	let cntr = 0;
	while ((Test.visual_percentage > target_p || Test.foreground_percentage > target_p) && cntr < 250) {
		Test = Test.extend(1, 1, 1, 1, [255, 255, 255]);
		cntr += 1;
		console.log(`Extension ${cntr}, ${Test.visual_percentage} ${Test.foreground_percentage}`);
	}
	console.log(Test.visual_percentage, Test.foreground_percentage);
	
	console.log(123);
	//Test = Test.strip_color(Test.background_colors[0], [0, 0, 0], 10);
	
	Test = Test.resize(target_res);
	return Test.image
}