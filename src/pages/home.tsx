import {ImageCard} from "@/components/ui/ImageCard.tsx";
import {ArrowRight, BoxSelect, Download, Droplets,} from "lucide-react";
import {motion} from "framer-motion";
import {SiGithub} from "@icons-pack/react-simple-icons";
import {MadeIn} from "@/components/ui/MadeIn/src/components/MadeIn.tsx";
import {useState} from "react";

export function Home() {
	const [outImage, setOutImage] = useState("https://picsum.photos/200/300");
	const [inImage, setInImage] = useState("https://picsum.photos/200/300?random=1");
	
	function processImage(files: File[]) {
		if (files.length === 0) {
			return;
		}
		
		const reader = new FileReader();
		reader.onload = (event) => {
			if (event.target?.result) {
				setOutImage(event.target.result as string);
			}
		};
		
		reader.readAsDataURL(files[0]);
		
		setInImage(URL.createObjectURL(files[0]));
		
		console.log(files);
		
		console.log("Processing image...");
	}
	
	function downloadImage() {
		const link = document.createElement("a");
		link.href = outImage;
		link.download = "logo";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
	
	return (
		<>
			<div className={"absolute right-0 bottom-0 p-2"}>
				<MadeIn madeInCC={"DE"} showEU showHeart/>
			</div>
			<div className={"absolute bottom-0 left-0 m-2 p-1 px-3"}>
				<a href={"https://github.com/KilianSen/logo-normalizer"} target={"_blank"}>
					<SiGithub />
				</a>
			</div>
			<div className="flex flex-col items-center justify-center min-h-screen py-2 gap-16">
				<motion.div
					initial={{ minHeight: "100vh" }}
					animate={{ minHeight: "0vh" }}
					transition={{ duration: 1, ease: "easeInOut" }}
					
					className={"flex flex-col items-center justify-center py-12"}>
					<h1 className="text-4xl font-bold">Welcome to the Logo Normalizer</h1>
					<p className="mt-4 text-lg">This tool can help you bring unequal logos into a unified format</p>
				</motion.div>
				<div className={"flex items-center justify-center py-2 gap-2"}>
					<ImageCard src={inImage} className={"w-56 aspect-square!"} hover={<BoxSelect size={45} color={"white"}/>} dragImage={<Droplets size={45} color={"white"}/>} onDrop={processImage}/>
					<ArrowRight size={200}/>
					<ImageCard src={outImage} className={"w-56 aspect-square!"} hover={<Download size={45} color={"white"}/>} onClick={downloadImage} />
				</div>
			</div>
		</>
	)
}

// 				<div className={"flex flex-col items-center justify-center py-2 gap-10"}>
// 					<h1 className="text-4xl font-bold">Bulk</h1>
// 					<p className={"mt-4 text-lg"}>
// 						Bulk editing is a feature that allows you to edit multiple logos at once.<br/>
// 						This can save you time and effort when working with large numbers of logos.<br/>
// 						You can select multiple logos and apply the same edits to all of them at once.
// 					</p>
// 					<div className={"flex w-full gap-2"}>
// 						<Button>Add logos</Button>
// 						<Button>Clear</Button>
// 						<Button>Process</Button>
// 					</div>
// 					<div className={"grid grid-cols-3 gap-4"}>
// 						{[...Array(10)].map((_, i) => (
// 							<ImageCard key={i} src={"https://picsum.photos/200/300"} className={"w-56 aspect-square!"} hover={<X size={45} color={"white"}/>}/>
// 						))}
// 					</div>
// 				</div>